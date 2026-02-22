import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Vendor } from "./vendorModel.js";
import { Category } from "./categoryModel.js";

export const Product = sequelize.define(
  "Product",
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    product_group: DataTypes.STRING(100),
    product_type: DataTypes.STRING(100),
    product_condition: {
      type: DataTypes.ENUM("new", "almost_new", "good", "hardly_ever_used", "satisfactory"),
      defaultValue: "new",
    },
    fit: {
      type: DataTypes.ENUM("Slim", "Regular", "Loose", "Oversized", "Tailored", "Modern", "Fitted", "Other"),
      defaultValue: "Regular",
    },
    size: {
      type: DataTypes.ENUM("XS", "S", "M", "L", "XL", "XXL", "XXXL", "4xl", "5xl", "6xl",
        "Kids-Upto 3 Months", "Kids-Upto 6 Months", "Kids- 6-9 Months", "Kids- 9-12 Months",
        "Kids- 1-2 Years", "Kids- 3-4 Years", "Kids- 5-6 Years", "Kids- 7-8 Years",
        "Kids- 9-10 Years", "Kids- 10-12 Years", "Kids- 13-14 Years", "K 15-16 Years", "Kids- 17-18 Years", "Other"),
      defaultValue: "M",
    },
    size_other: DataTypes.STRING(100),
    product_color: DataTypes.STRING(100),
    brand: DataTypes.STRING(100),
    model_name: DataTypes.STRING(100),
    invoice: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    invoice_photo: DataTypes.STRING(255),
    needs_repair: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    repair_photo: DataTypes.STRING(255),
    original_box: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    dust_bag: {
      type: DataTypes.ENUM("Yes", "No"),
      defaultValue: "No",
    },
    additional_items: DataTypes.TEXT,
    front_photo: DataTypes.TEXT,
    back_photo: DataTypes.TEXT,
    label_photo: DataTypes.TEXT,
    inside_photo: DataTypes.TEXT,
    button_photo: DataTypes.TEXT,
    wearing_photo: DataTypes.TEXT,
    more_images: DataTypes.JSON,
    purchase_price: DataTypes.INTEGER,
    selling_price: DataTypes.INTEGER,
    reason_to_sell: DataTypes.TEXT,
    purchase_year: DataTypes.INTEGER,
    purchase_place: DataTypes.STRING(100),
    product_link: DataTypes.STRING(255),
    additional_info: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    stock_status: {
      type: DataTypes.ENUM("in_stock", "out_of_stock"),
      defaultValue: "in_stock",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

// Associations
Product.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });