import { DataTypes } from "sequelize";
import { sequelize } from "../Config/dbConfig.js";

const ConversationMember = sequelize.define(
  "conversation_member",
  {
    conversationId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: "conversation",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: "member", // 'admin' | 'member'
    },
    lastReadAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // We are manually defining joinedAt, so we don't need default timestamps
    underscored: true,
  },
);

export default ConversationMember;
