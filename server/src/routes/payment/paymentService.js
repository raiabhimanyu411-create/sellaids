import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../../models/orderModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Cart } from "../../models/cartModel.js";
import { Product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import logger from "../../config/logger.js";
import { sequelize } from "../../config/db.js";
import { Vendor } from "../../models/vendorModel.js";
import { sendSMS } from "../../providers/sms/smsAlert.js"
import { generateInvoicePDF } from "../../utils/generateInvoice.js";
import { createShipment, createShiprocketOrder } from "../../providers/orderTracking/orderTracking.js";
import { sendInvoiceEmail } from "../../utils/mailer.js"
// import { createShipmentService } from "../xpressbees/xpressbeesService.js"

export const createRazorpayInstance = () => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    logger.info("Razorpay instance created successfully");
    return instance;
  } catch (error) {
    logger.error("Failed to create Razorpay instance:", error);
    return null;
  }
};

export const createOrderService = async (userId, cartItems, shippingAddress, finalTotalFromFrontend) => {
  const transaction = await sequelize.transaction();
  try {

    if (!cartItems?.length) {
      await transaction.rollback();
      return { status: false, message: "Cart is empty" };
    }

    let totalAmount = 0;

    for (const item of cartItems) {

      const product = await Product.findByPk(item.product_id, { transaction });

      if (!product) {
        await transaction.rollback();
        return { status: false, message: `Product ${item.product_id} not found in database` };
      }

      if (!product.vendor_id) {
        await transaction.rollback();
        return { status: false, message: `Product ${product.name} has no vendor assigned` };
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return { status: false, message: `${product.name} is out of stock` };
      }

      const sellingPrice = item.product?.price || product.price;

      if (!sellingPrice || sellingPrice <= 0) {
        await transaction.rollback();
        return { status: false, message: `Invalid price for ${product.name}: ${sellingPrice}` };
      }

      totalAmount += sellingPrice * item.quantity;
    }

    const COMMISSION = {
      vendor: 70,
      admin: 30,
    };

    const SHIPPING_FEE = 100;
    const PLATFORM_FEE = 50;
    const finalAmount = totalAmount + SHIPPING_FEE + PLATFORM_FEE;
    const productAmount = totalAmount;

    const vendorEarning = Number(((totalAmount * COMMISSION.vendor) / 100).toFixed(2));
    const adminCommission = Number(((totalAmount * COMMISSION.admin) / 100).toFixed(2));

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      await transaction.rollback();
      return { status: false, message: "Invalid final amount calculated" };
    }

    const razorpay = createRazorpayInstance();
    if (!razorpay) {
      await transaction.rollback();
      return { status: false, message: "Failed to initialize payment gateway" };
    }

    const existingPayment = await Payment.findOne({
      where: { user_id: userId, payment_status: "pending" },
      transaction,
    });

    let razorpayOrder, orders = [], payment;

    if (existingPayment) {
      razorpayOrder = {
        id: existingPayment.razorpay_order_id,
        amount: finalAmount * 100,
        currency: "INR",
      };

      await Order.update(
        {
          total_amount: totalAmount,
          shipping_address: shippingAddress
        },
        {
          where: { user_id: userId, payment_status: "pending" },
          transaction
        }
      );

      await existingPayment.update({
        amount: productAmount,
        shipping_fee: SHIPPING_FEE,
        platform_fee: PLATFORM_FEE,
        vendor_earning: vendorEarning,
        admin_commission: adminCommission,
      }, { transaction });

      orders = await Order.findAll({
        where: { user_id: userId, payment_status: "pending" },
        transaction
      });
      payment = existingPayment;

    } else {
      razorpayOrder = await razorpay.orders.create({
        amount: finalAmount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}_${userId}`,
      });

      for (const item of cartItems) {
        const product = await Product.findByPk(item.product_id, { transaction });

        const sellingPrice = item.product?.price || product.price;

        const order = await Order.create({
          user_id: userId,
          vendor_id: product.vendor_id,
          product_id: item.product_id,
          quantity: item.quantity,
          total_amount: sellingPrice * item.quantity,   // ← Frontend ya DB price
          payment_status: "pending",
          order_status: "pending",
          shipping_address: shippingAddress,
          payment_method: "razorpay",
          transaction_id: razorpayOrder.id,
          order_date: new Date(),
        }, { transaction });

        orders.push(order);
      }

      const vendorId = orders[0].vendor_id;
      payment = await Payment.create({
        order_id: orders[0].id,
        user_id: userId,
        vendor_id: vendorId,
        payment_method: "razorpay",
        razorpay_order_id: razorpayOrder.id,
        amount: productAmount,
        shipping_fee: SHIPPING_FEE,
        platform_fee: PLATFORM_FEE,
        vendor_earning: vendorEarning,
        admin_commission: adminCommission,
        payment_status: "pending",
        payment_date: new Date(),
        payment_info: razorpayOrder,
        currency: "INR",
      }, { transaction });

    }

    await transaction.commit();

    return {
      status: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: finalAmount,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID,
        orderIds: orders.map(o => o.id),
      },
    };

  } catch (error) {
    await transaction.rollback();
    console.error("🚨 createOrderService ERROR:", error);
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return { status: false, message: error.message || "Internal server error" };
  }
};
export const verifyPaymentService = async (userId, paymentDetails) => {
  const transaction = await sequelize.transaction();
  const updatedOrders = [];
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderIds } = paymentDetails;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      await transaction.rollback();
      return { status: false, message: "Missing Razorpay payment details" };
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await transaction.rollback();
      return { status: false, message: "Invalid payment signature" };
    }

    for (const orderId of orderIds) {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        include: [{ model: Product, as: "product" }],
        transaction
      });

      if (!order || !order.product) {
        await transaction.rollback();
        return { status: false, message: `Order or product not found for ${orderId}` };
      }

      await order.update(
        {
          payment_status: "success",
          order_status: "confirmed",
          transaction_id: razorpay_payment_id,
          updated_at: new Date(),
        },
        { transaction }
      );

      const product = order.product;

      // Payment success ke baad FINAL stock calculation
      const newStock = Math.max(product.stock - order.quantity, 0);

      await product.update(
        {
          stock: newStock > 0 ? newStock : 0,
          stock_status: newStock <= 0 ? "out_of_stock" : "in_stock",
        },
        { transaction }
      );

      updatedOrders.push(order); // updatedOrders push
    }

    const payment = await Payment.findOne({ where: { razorpay_order_id }, transaction });
    if (!payment) {
      await transaction.rollback();
      return { status: false, message: "Payment record not found" };
    }
    await payment.update(
      {
        payment_status: "success",
        razorpay_payment_id,
        razorpay_signature,
        transaction_id: razorpay_payment_id,
        payment_info: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        updated_at: new Date(),
      },
      { transaction }
    );

    await Cart.destroy({ where: { user_id: userId }, transaction });

    // await transaction.commit();
    // logger.info(`Payment verified for Razorpay order ${razorpay_order_id}`);

    try {
      await transaction.commit();
      logger.info(`Payment verified for Razorpay order ${razorpay_order_id}`);
    } catch (error) {
      // agar transaction already commit ho chuka ho ya rollback ki state me ho
      if (error.message.includes("finished with state")) {
        logger.warn(
          `⚠️ Commit skipped or already finished for Razorpay order ${razorpay_order_id}`
        );
      } else {
        logger.error("❌ Transaction commit failed:", error);
        try {
          await transaction.rollback();
          logger.info("✅ Transaction rolled back after commit failure");
        } catch (rollbackError) {
          logger.error("⚠️ Rollback failed or already finished:", rollbackError);
        }
      }
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["name", "phone"],
    });

    if (!user) {
      logger.warn(`User ${userId} not found for post-payment actions.`);
    } else {
      for (const order of updatedOrders) {

        const fullOrder = await Order.findOne({
          where: { id: order.id },
          include: [
            { model: Product, as: "product" },
            { model: User },
            { model: Vendor }
          ]
        });

        if (!fullOrder) {
          logger.warn(`Full order not found for order ${order.id}`);
          continue;
        }

        try {
          // 🔹 Invoice number
          const invoiceNumber = `INV-${fullOrder.id}-${Date.now()}`;

          // 🔹 Prepare invoice data
          const invoiceData = {
            id: fullOrder.id,

            invoiceNumber: invoiceNumber,
            orderNumber: fullOrder.id,
            orderDate: new Date(fullOrder.created_at).toDateString(),

            customerName: fullOrder.User.name,
            customerEmail: fullOrder.User.email,
            customerPhone: fullOrder.User.phone,
            customerAddress: fullOrder.User.address_line,
            customerCity: fullOrder.User.city,
            customerPincode: fullOrder.User.pincode,
            customerState: fullOrder.User.state,
            customerCountry: "India",

            items: [
              {
                name: fullOrder.product.product_type,
                sku: fullOrder.product.sku,
                qty: fullOrder.quantity,
                price: fullOrder.total_amount
              }
            ],

            subtotal: fullOrder.total_amount,
            shipping_fee: 100,
            platform_fee: 50,
          };


          // console.log("invoiceData" ,invoiceData)
          // 🔹 Generate invoice PDF
          const invoicePath = await generateInvoicePDF(invoiceData);

          // 🔹 Save invoice details in DB
          await fullOrder.update({
            invoice_number: invoiceNumber,
            invoice_pdf_url: invoicePath
          });

          // 🔹 Send invoice email
          await sendInvoiceEmail(
            fullOrder.User.email,
            invoiceData,
            process.cwd() + "/src/public" + invoicePath
          );

          logger.info(`Invoice generated & emailed for order ${fullOrder.id}`);

        } catch (invoiceError) {
          logger.error(
            `Invoice generation failed for order ${order.id}:`,
            invoiceError
          );
        }

        try {
          // Send SMS (safe)
          const smsResponse = await sendSMS(
            user.phone,
            `Hi ${fullOrder.User.name}, your order ${fullOrder.id} has been placed successfully. Thank you for shopping with Stylekins!`
          );

          console.log("SMS Response for", smsResponse);
          if (smsResponse?.success || smsResponse?.data?.status === "success") {
            logger.info(`SMS sent successfully to ${user.phone} for order ${order.id}`);
          } else {
            logger.warn(
              `SMS API did not confirm success for ${user.phone} (order ${order.id}). Response:`,
              smsResponse
            );
          }
        } catch (smsError) {
          logger.error(`Failed to send SMS to ${user.phone} for order ${order.id}:`, smsError);
        }

        // Optional: create shipment, but do not affect DB transaction or throw to outer scope
        try {
          const createShipment = await createShiprocketOrder(fullOrder);
          logger.info(`Shiprocket shipment created for order ${createShipment.shipment_id}`);
        } catch (xbError) {
          logger.error(`Failed to create Shiprocket shipment for order ${order.id}:`, xbError);
        }
      }
    }
    return { status: true, data: { orderIds, razorpay_order_id, razorpay_payment_id } };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    logger.error(`verifyPaymentService error for user ${userId}:`, error);
    return { status: false, message: error.message };
  }
};


export const cancelPaymentService = async (userId, razorpayOrderId, orderIds) => {
  const transaction = await sequelize.transaction();
  try {
    for (const orderId of orderIds) {
      const order = await Order.findOne({
        where: { id: orderId, user_id: userId, payment_status: "pending" },
        transaction,
      });
      if (!order) {
        await transaction.rollback();
        return { status: false, message: `Order ${orderId} not found or not cancellable` };
      }
      await order.update(
        {
          payment_status: "failed",
          order_status: "cancelled",
          updated_at: new Date(),
        },
        { transaction }
      );
    }

    // Update payment status
    const payment = await Payment.findOne({
      where: { razorpay_order_id: razorpayOrderId, payment_status: "pending" },
      transaction,
    });
    if (!payment) {
      await transaction.rollback();
      return { status: false, message: "Payment record not found or not cancellable" };
    }
    await payment.update(
      {
        payment_status: "failed",
        failure_reason: "Payment cancelled by user",
        updated_at: new Date(),
      },
      { transaction }
    );

    // Restore product stock
    for (const orderId of orderIds) {
      const order = await Order.findByPk(orderId, { transaction });
      const product = await Product.findByPk(order.product_id, { transaction });
      await product.update(
        { stock: product.stock + order.quantity },
        { transaction }
      );
    }

    await transaction.commit();
    logger.info(`Payment cancelled for Razorpay order ${razorpayOrderId}`);
    return { status: true, message: "Payment and order cancelled successfully" };
  } catch (error) {
    await transaction.rollback();
    logger.error(`cancelPaymentService error for user ${userId}:`, error);
    return { status: false, message: error.message };
  }
};