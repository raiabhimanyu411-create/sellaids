import axios from "axios";
import config from "../../config/config.js";
import { sendSMS } from "../../providers/sms/smsAlert.js";
import { Order } from "../../models/orderModel.js";
import { User } from "../../models/userModel.js";

const xpressbees = axios.create({
    baseURL: config.xpressbees.baseUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.xpressbees.token}`
    },
});

// Shipment Create (When order confirm)
export const createShipmentService = async (order) => {
    try {
        const response = await xpressbees.post("/shipments2", {
            order_number: order.id,               // tumhara internal order id
            payment_type: order.payment_type,     // "cod" ya "prepaid"
            order_amount: order.totalAmount,      // total order value
            package_weight: order.weight,         // grams me weight
            package_length: order.length,         // cm me length
            package_breadth: order.breadth,       // cm me breadth
            package_height: order.height,         // cm me height
            request_auto_pickup: "yes",           // pickup request auto bhejne ke liye
            shipping_charges: order.shippingCharge || 40,
            cod_charges: order.codCharge || 30,
            discount: order.discount || 0,
            collectable_amount:
                order.payment_type === "cod" ? order.totalAmount : 0,

            consignee: {
                name: customer.name,
                address: customer.address,
                address_2: customer.address_2 || "",
                city: customer.city,
                state: customer.state,
                pincode: customer.pincode,
                phone: customer.phone,
            },

            pickup: {
                warehouse_name: "Main Warehouse",
                name: "Ajay Kumar",
                address: "Gomti Nagar",
                address_2: "Near Metro Station",
                city: "Lucknow",
                state: "Uttar Pradesh",
                pincode: "226010",
                phone: "9876543210",
            },

            order_items: [
                {
                    name: order.itemName,
                    qty: order.quantity,
                    price: order.price,
                    sku: order.sku || "SKU001",
                },
            ],

            courier_id: 1,
        });

        const data = response.data;
        console.log(response)
        console.log(data)
        // if (data.awb_number) {
        //     await order.update({ awb_number: data.awb_number });
        //     console.log(`✅ Shipment created for order ${order.id}: ${data.awb_number}`);
        // }
        return data;
    } catch (error) {
        console.error("Xpressbees createShipment error:", error.response?.data || error.message);
        throw error;
    }
};

// Shipment Tracking (for CRON/Webhook)
export const trackShipmentService = async (awbNumber) => {
    try {
        const response = await xpressbees.get(`/shipments2/track/${awbNumber}`);

        const trackingData = response.data;

        if (trackingData?.status && trackingData?.data) {
            const shipmentInfo = trackingData.data;
            const currentStatus = shipmentInfo.status?.toLowerCase();

            // 4️⃣ Check existing order in DB
            const order = await Order.findOne({ where: { awb_number: awbNumber } });
            if (!order) return trackingData;

            // 5️⃣ Status-based actions
            if (currentStatus.includes("pending pickup") && order.order_status !== "pending") {
                await order.update({ order_status: "pending" });
            }

            if (currentStatus.includes("in transit") && order.order_status !== "shipped") {
                await order.update({ order_status: "shipped" });

                const user = await User.findOne({ where: { id: order.user_id } });
                if (user)
                    await sendSMS(
                        user.mobile,
                        `Hi ${user.name}, your order ${order.id} has been shipped! Thank you for shopping with us.`
                    );
            }

            if (currentStatus.includes("delivered") && order.order_status !== "delivered") {
                await order.update({ order_status: "delivered" });

                const user = await User.findOne({ where: { id: order.user_id } });
                if (user)
                    await sendSMS(
                        user.mobile,
                        `Hi ${user.name}, your order ${order.id} has been successfully delivered. We hope you love it!`
                    );
            }
        }

        return trackingData;
    } catch (error) {
        console.error("trackShipmentService error:", error.response?.data || error.message);
        throw new Error("Shipment tracking failed");
    }
};