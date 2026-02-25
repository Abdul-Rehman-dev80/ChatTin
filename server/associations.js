import Call from "./src/Model/Call.js";
import Conversation from "./src/Model/Conversation.js";
import ConversationMember from "./src/Model/ConversationMember.js";
import Message from "./src/Model/Message.js";
import User from "./src/Model/User.js";

// --- Many-to-Many: User <-> Conversation ---
User.belongsToMany(Conversation, {
  through: ConversationMember,
  foreignKey: "userId",
  as: "conversations",
});

Conversation.belongsToMany(User, {
  through: ConversationMember,
  foreignKey: "conversationId",
  as: "users",
});

// --- Junction Table Links (Crucial for includes) ---
// This allows: Conversation.findAll({ include: "members" })
Conversation.hasMany(ConversationMember, { 
  foreignKey: "conversationId", 
  as: "members" 
});

ConversationMember.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

ConversationMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// --- Messages ---
Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

// --- Calls ---
Conversation.hasMany(Call, { foreignKey: "conversationId", as: "calls" });
User.hasMany(Call, { foreignKey: "callerUserId", as: "calls" });
Call.belongsTo(Conversation, { foreignKey: "conversationId", as: "conversation" });
Call.belongsTo(User, { foreignKey: "callerUserId", as: "caller" });
Call.belongsTo(User, { foreignKey: "calleeUserId", as: "callee" });