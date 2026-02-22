import axios from 'axios';
import config from '../../config/config.js';
import logger from '../../config/logger.js';
import { Order } from "../../models/orderModel.js"

const getToken = async () => {
    try {
        const res = await axios.post(
            `${config.xpressbees.baseUrl}/users/login`,
            {
                email: config.xpressbees.email,
                password: config.xpressbees.password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // ✅ TOKEN IS DIRECT STRING
        const token = res.data?.data;

        if (!token) {
            logger.error("❌ Xpressbees token missing", res.data);
            return null;
        }

        return token;
    } catch (error) {
        logger.error(
            "❌ Xpressbees login failed:",
            error.response?.data || error.message
        );
        return null;
    }
};

export const createShipment = async (order) => {
    const token = await getToken();
    if (!token) throw new Error("XpressBees: Token generation failed");

    const payload = {
        // order_number: order.id,
        order_number: `ORD-${order.id}`,
        unique_order_number: "yes",
        shipping_charges: 100,
        payment_type: "prepaid",
        order_amount: order.total_amount,
        request_auto_pickup: "yes",

        consignee: {
            name: order.User.name,
            address: order.User.address_line,
            city: order.User.city,
            state: order.User.state,
            pincode: order.User.pincode,
            phone: order.User.phone
        },

        pickup: {
            warehouse_name: "Delhi Warehouse",
            name: order.Vendor.business_name,
            address: `${order.Vendor.house_no}, ${order.Vendor.street_name}`,
            city: order.Vendor.city,
            state: order.Vendor.state,
            pincode: order.Vendor.pincode,
            phone: order.Vendor.phone
        },

        order_items: [
            {
                name: order.product.product_type,
                qty: String(order.quantity),
                price: String(order.total_amount),
                sku: order.product.sku,
            },
        ],

        collectable_amount: 0   // COD nahi hai isliye 0
    };

    try {
        console.log("E")
        const response = await axios.post(
            `${config.xpressbees.baseUrl}/shipments2`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer Token ${token}`
                }
            }
        );

        console.log(response)
        console.log("F")

        if (response.data.status) {
            const data = response.data.data;
            console.log("Success! AWB:", data?.awb_number);
            console.log("Label PDF:", data?.label_url);
            console.log("Label PDF2:", data?.label);
            console.log("Tracking Link:", data?.tracking_url);

            await sendSMS(
                order.User.phone,
                `Hi ${order.User.name}, your order ${order.id} has been shipped and is on its way! Thank you for shopping with Stylekins!`
            );
            return { success: true, awb: data.awb_number, label: data.label };
        } else {
            console.error("Xpressbees Error:", response.data.message);
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.log("Error:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Network error" };
    }
}


export const trackShipment = async (awbNumber) => {
    const token = await getToken(); // Token har baar fresh lo
    if (!token) throw new Error('Token failed');
    if (!awbNumber) {
        throw new Error("AWB number required for tracking");
    }

    const trackUrl = `${config.xpressbees.baseUrl}/shipments2/track/${awbNumber}`

    try {
        const response = await axios.get(trackUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer Token ${token}`
            }
        });

        if (response.data.status) {
            const trackingData = response.data.data;
            console.log("Tracking Success!");
            console.log("Current Status:", trackingData.status);
            console.log("AWB Number:", trackingData.awb_number);
            console.log("History:", trackingData.history);
            console.log("Full Data:", trackingData);

            return {
                success: true,
                data: trackingData  // Poora tracking data return karo
            };
        } else {
            console.error("Tracking Error:", response.data.message || "Unknown error");
            return {
                success: false,
                message: response.data.message || "Tracking failed"
            };
        }

    } catch (error) {
        console.error("Tracking API Error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Network or API error"
        };
    }
};

export const mapShiprocketStatusToOrderStatus = (shiprocketStatus) => {
    if (!shiprocketStatus) return "pending";

    const status = shiprocketStatus.toUpperCase();

    if (status.includes("PICKED")) return "shipped";
    if (status.includes("IN TRANSIT")) return "shipped";
    if (status.includes("OUT FOR DELIVERY")) return "shipped";
    if (status.includes("DELIVERED")) return "delivered";
    if (status.includes("CANCEL")) return "cancelled";
    if (status.includes("MANIFEST")) return "confirmed";

    return "pending";
};

export const generateShiprocketToken = async () => {
    try {
        const response = await axios.post(
            `${config.shiprocket.baseUrl}/auth/login`,
            {
                email: config.shiprocket.email,
                password: config.shiprocket.password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // console.log("Shiprocket Auth Response:", response.data.token);

        if (!response.data?.token) {
            throw new Error("Shiprocket token missing");
        }

        return response.data.token;

    } catch (error) {
        console.error("Shiprocket Auth Error:", error.message);
        throw error; // calling code ko pata chale
    }
};

export const createShiprocketOrder = async (fullOrder) => {
    try {

        const payload = {
            order_id: fullOrder.id,
            order_date: new Date(fullOrder.created_at).toDateString(),
            pickup_location: "warehouse",

            billing_customer_name: fullOrder.User.name,
            billing_last_name: "Naruto",
            billing_address: fullOrder.User.address_line,
            billing_city: fullOrder.User.city,
            billing_pincode: fullOrder.User.pincode,
            billing_state: fullOrder.User.state,
            billing_country: "India",
            billing_email: fullOrder.User.email,
            billing_phone: fullOrder.User.phone,

            shipping_is_billing: true,              // Shipping address same as billing

            order_items: [
                {
                    name: fullOrder.product.product_type,
                    sku: fullOrder.product.sku,
                    units: fullOrder.quantity,
                    selling_price: fullOrder.product.selling_price
                }
            ],

            payment_method: "Prepaid",
            sub_total: fullOrder.total_amount,

            length: 10,                               // > 0.5 cm
            breadth: 15,                              // > 0.5 cm
            height: 20,                               // > 0.5 cm
            weight: 1.0                               // > 0 kg
        };

        const token = await generateShiprocketToken();

        const response = await axios.post(
            `${config.shiprocket.baseUrl}/orders/create/adhoc`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Shiprocket Order Create Response:", response);

        const shipmentId = response.data?.shipment_id;

        if (!shipmentId) {
            throw new Error("shipment_id not received from Shiprocket");
        }

        // DB UPDATE 
        await Order.update(
            { shipment_id: shipmentId },
            { where: { id: fullOrder.id } }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Shiprocket Order Create Error:",
            error?.response?.data || error.message
        );
        throw error; // calling code ko pata chale
    }
};

export const trackShiprocketShipment = async (shipmentId) => {
    try {

        if (!shipmentId) {
            throw new Error("shipmentId is required for tracking");
        }

        //  Generate token
        const token = await generateShiprocketToken();

        //  Call Shiprocket Tracking API
        const response = await axios.get(
            `${config.shiprocket.baseUrl}/courier/track/shipment/${shipmentId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Shiprocket Tracking Response:", response.data);

        return response.data;
    } catch (error) {
        console.error(
            "Shiprocket Tracking Error:",
            error?.response?.data || error.message
        );
        throw error; // calling code ko pata chale
    }
};