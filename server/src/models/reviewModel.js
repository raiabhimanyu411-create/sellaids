// models/reviewModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./userModel.js";
import { Product } from "./productModel.js";

export const Review = sequelize.define(
  "Review",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Product, key: "id" },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    review_text: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Review.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });
Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });