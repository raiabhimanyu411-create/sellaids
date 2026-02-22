import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Order } from "./orderModel.js";
import { User } from "./userModel.js";
import { Vendor } from "./vendorModel.js";

export const Payment = sequelize.define(
  "Payment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vendor, // Reference Vendor model
        key: "id",
      },
      onDelete: "CASCADE",
    },
    payment_method: { type: DataTypes.STRING(50), defaultValue: "razorpay" },
    razorpay_order_id: { type: DataTypes.STRING(100), allowNull: true },
    razorpay_payment_id: { type: DataTypes.STRING(100), allowNull: true },
    razorpay_signature: { type: DataTypes.STRING(200), allowNull: true },
    transaction_id: { type: DataTypes.STRING(100), allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    admin_commission: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    vendor_earning: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    platform_fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 50.0 },
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 100.0,
    },
    currency: { type: DataTypes.STRING(10), defaultValue: "INR" },
    payment_status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
    },
    refund_status: { type: DataTypes.STRING(50), defaultValue: "none" },
    refund_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    failure_reason: { type: DataTypes.STRING(255), allowNull: true },
    payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    payment_info: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Payment.belongsTo(User, { foreignKey: "user_id", as: "user" });
Payment.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });
Order.hasOne(Payment, { foreignKey: "order_id", as: "payment" });
