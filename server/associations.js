import Conversation from "./src/Model/Conversation.js";
import ConversationMember from "./src/Model/ConversationMember.js";
import Message from "./src/Model/Message.js";
import User from "./src/Model/User.js";

// A User can be in many Conversations
User.belongsToMany(Conversation, {
  through: ConversationMember,
  foreignKey: "userId",
  as: "conversations",
});

// A Conversation can have many Users
Conversation.belongsToMany(User, {
  through: ConversationMember,
  foreignKey: "conversationId",
  as: "users",
});

// ConversationMember belongs to Conversation (for includes)
ConversationMember.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

// ConversationMember belongs to User (for includes)
ConversationMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// A conversation has many messages
Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

// A user sends many messages
User.hasMany(Message, { foreignKey: "senderId" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
