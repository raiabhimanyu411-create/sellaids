import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

export const UserSupport = sequelize.define(
    "UserSupport",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "user_supports",
        timestamps: false,
    }
);