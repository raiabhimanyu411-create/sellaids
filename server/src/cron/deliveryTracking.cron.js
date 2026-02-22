import cron from "node-cron";
import { trackShipment } from "../providers/orderTracking/orderTracking.js"
import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
import { sendSMS } from "../providers/sms/smsAlert.js";

cron.schedule("0 */6 * * *", async () => {
    console.log("⏰ Delivery tracking cron running...");

    const orders = await Order.findAll({
        where: {
            order_status: ["shipped", "in_transit"]
        },
        include: [{ model: User }]
    });

    for (const order of orders) {
        try {
            const tracking = await trackShipment(order.awb_number);

            const lastEvent = tracking?.data?.history?.[0];

            if (tracking.success && lastEvent?.status_code === "DL") {

                // ✅ Delivered SMS
                await sendSMS(
                    order.User.phone,
                    `Hi ${order.User.name}, your order ${order.id} has been successfully delivered. Thank you for shopping with Stylekins Pvt. Ltd.!`
                );

                // ✅ DB update
                await Order.update(
                    { order_status: "delivered" },
                    { where: { id: order.id } }
                );

                console.log(`✅ Order ${order.id} marked as delivered`);
            }
        } catch (err) {
            console.error("❌ Delivery cron error:", err.message);
        }
    }
});
