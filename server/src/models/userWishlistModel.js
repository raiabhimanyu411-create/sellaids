import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Product } from "./productModel.js";
import { User } from "./userModel.js";

export const Wishlist = sequelize.define(
    "Wishlist",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: User, key: "id" },
            onDelete: "CASCADE",
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Product, key: "id" },
            onDelete: "CASCADE",
        },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { tableName: "wishlists", timestamps: false }
);

Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });