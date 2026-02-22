import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

export const VendorSupport = sequelize.define(
    "VendorSupport",
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
                model: "vendors",
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
        tableName: "vendor_supports",
        timestamps: false,
    }
);