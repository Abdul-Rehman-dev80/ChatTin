import { DataTypes } from "sequelize";
import { sequelize } from "../Config/dbConfig.js";

const Conversation = sequelize.define(
  "conversation",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM("direct", "group"),
      allowNull: false,
      validate: {
        isIn: [["direct", "group"]],
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true, // Ensures Sequelize looks for 'created_at' instead of 'createdAt' in the DB
  }
);

export default Conversation;