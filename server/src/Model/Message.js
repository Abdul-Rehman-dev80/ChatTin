import { DataTypes } from "sequelize";
import { sequelize } from "../Config/dbConfig.js";

const Message = sequelize.define(
  "message",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    conversationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "conversation",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    senderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "user", // Name of the target table
        key: "id",
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true, // Nullable in case of image/file only messages
    },
    messageType: {
      type: DataTypes.STRING(20),
      defaultValue: "text",
      validate: {
        isIn: [["text", "image", "file", "system"]],
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false, // Messages are typically immutable, so we only need createdAt
    underscored: true,
  }
);

export default Message;