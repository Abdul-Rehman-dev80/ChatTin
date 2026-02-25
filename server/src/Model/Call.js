import { sequelize } from "../Config/dbConfig.js";
import { DataTypes } from "sequelize";

const Call = sequelize.define(
  "call",
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
    },
    callerUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    calleeUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("initiated", "accepted", "rejected", "ended"),
      defaultValue: "initiated",
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  },
);

export default Call;
