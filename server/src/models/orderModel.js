import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./userModel.js";
import { Product } from "./productModel.js";
import { Vendor } from "./vendorModel.js";

export const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vendor,
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
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    shipment_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    invoice_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    invoice_pdf_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
    },
    order_status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(50),
    },
    transaction_id: {
      type: DataTypes.STRING(100),
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
Order.belongsTo(User, { foreignKey: "user_id" });
Order.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Order.belongsTo(Vendor, { foreignKey: "vendor_id" });