import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProductType = sequelize.define(
    "ProductType", 
{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
}, {
  tableName: "product_type",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});


export default ProductType;
