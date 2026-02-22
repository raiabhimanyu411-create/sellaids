import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Category = sequelize.define(
  "Category",
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
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      // unique: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "categories", key: "id" },
      onDelete: "CASCADE",
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group: {
      type: DataTypes.JSON, 
      allowNull: false,
      defaultValue: [] 
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "categories",
    timestamps: false,
    // hooks: {
    //   beforeValidate: (category) => {
    //     if (!category.slug && category.name) {
    //       category.slug = slugify(category.name, { lower: true });
    //     }
    //   },
    // },
  }
);

// Self-association for nested category hierarchy
Category.hasMany(Category, { as: "subCategories", foreignKey: "parent_id" });
Category.belongsTo(Category, { as: "parentCategory", foreignKey: "parent_id" });