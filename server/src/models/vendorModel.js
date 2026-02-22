import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

export const Vendor = sequelize.define(
  "Vendor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    business_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    business_type: {
      type: DataTypes.ENUM("restaurant","grocery","fashion","electronics","other"),
      defaultValue: "other",
      allowNull: true,
    },
    gst_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    pan_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    house_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    street_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    contact_person_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contact_person_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    account_number: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true,
    },
    ifsc_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    account_type: {
      type: DataTypes.ENUM("savings","current"),
      defaultValue: "savings",
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending","approved","rejected"),
      defaultValue: "pending",
      allowNull: true,
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "vendors",
    timestamps: false, // Sequelize ke automatic createdAt/updatedAt disable
  }
)