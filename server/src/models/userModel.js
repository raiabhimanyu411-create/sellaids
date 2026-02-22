import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

export const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,        // Integer type
            autoIncrement: true,            // Auto increment (primary key ke liye)
            primaryKey: true,               // Primary key
        },
        name: {
            type: DataTypes.STRING(100),    // VARCHAR(100)
            allowNull: false,               // Required field
        },
        email: {
            type: DataTypes.STRING(150),    // VARCHAR(150)
            allowNull: false,               // Required field
            unique: true,                   // Unique constraint
        },
        phone: {
            type: DataTypes.STRING(20),     // VARCHAR(20)
            allowNull: false,               // Required field
        },
        password: {
            type: DataTypes.STRING(255),    // VARCHAR(255)
            allowNull: false,               // Required
        },
        created_at: {
            type: DataTypes.DATE,           // DATETIME
            defaultValue: DataTypes.NOW,   // Default current timestamp
        },
        reset_token: {
            type: DataTypes.STRING(255),    // VARCHAR(255)
            allowNull: true,                // Optional
        },
        reset_token_expires: {
            type: DataTypes.DATE,           // DATETIME
            allowNull: true,                // Optional
        },
        address_line: {
            type: DataTypes.STRING(255),    // VARCHAR(255)
            allowNull: true,                // Optional
        },
        city: {
            type: DataTypes.STRING(100),    // VARCHAR(100)
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING(100),    // VARCHAR(100)
            allowNull: true,
        },
        pincode: {
            type: DataTypes.STRING(20),     // VARCHAR(20)
            allowNull: true,
        },
    },
    {
        tableName: "users",   // Table ka exact naam in DB
        timestamps: false,    // CreatedAt / UpdatedAt automatic nahi chahiye
    }
)