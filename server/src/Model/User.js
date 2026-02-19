import { DataTypes } from "sequelize";
import { sequelize } from "../Config/dbConfig.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/, // Simple regex for international phone numbers
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pfp: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "defaultPfp.png",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    about: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  },
);

export default User;
