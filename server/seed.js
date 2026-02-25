import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sequelize, dbConnectionCheck } from "./src/Config/dbConfig.js";
import "./src/Model/User.js";
import "./src/Model/Conversation.js";
import "./src/Model/ConversationMember.js";
import "./src/Model/Message.js";
import "./src/Model/Call.js";
import "./associations.js";
import User from "./src/Model/User.js";
import Conversation from "./src/Model/Conversation.js";
import ConversationMember from "./src/Model/ConversationMember.js";
import Message from "./src/Model/Message.js";
import Call from "./src/Model/Call.js";

dotenv.config();

// Dummy users data
const dummyUsers = [
  {
    username: "Alice Johnson",
    phone: "+1234567890",
    email: "alice@example.com",
    password: "password123",
    about: "Hey there! I'm Alice 👋",
    isOnline: true,
  },
  {
    username: "Bob Smith",
    phone: "+1234567891",
    email: "bob@example.com",
    password: "password123",
    about: "Software developer and coffee enthusiast ☕",
    isOnline: false,
  },
  {
    username: "Charlie Brown",
    phone: "+1234567892",
    email: "charlie@example.com",
    password: "password123",
    about: "Love coding and gaming 🎮",
    isOnline: true,
  },
  {
    username: "Diana Prince",
    phone: "+1234567893",
    email: "diana@example.com",
    password: "password123",
    about: "Designer and artist 🎨",
    isOnline: false,
  },
  {
    username: "Eve Wilson",
    phone: "+1234567894",
    email: "eve@example.com",
    password: "password123",
    about: "Travel enthusiast ✈️",
    isOnline: true,
  },
];

// Dummy conversations (will be created between users)
const createDummyData = async () => {
  try {
    console.log("🌱 Starting seed process...");

    // Check database connection
    await dbConnectionCheck();
    console.log("✅ Database connected");

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    await Message.destroy({ where: {}, force: true });
    await ConversationMember.destroy({ where: {}, force: true });
    await Call.destroy({ where: {}, force: true });
    await Conversation.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    console.log("✅ Existing data cleared");

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = [];
    for (const userData of dummyUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.username} (ID: ${user.id})`);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create conversations between users
    console.log("💬 Creating conversations...");
    const conversations = [];

    // Conversation 1: Alice <-> Bob
    const conv1 = await Conversation.create({
      type: "direct",
      createdBy: createdUsers[0].id, // Alice
    });
    await ConversationMember.bulkCreate([
      { conversationId: conv1.id, userId: createdUsers[0].id }, // Alice
      { conversationId: conv1.id, userId: createdUsers[1].id }, // Bob
    ]);
    conversations.push(conv1);
    console.log(`   ✓ Created conversation between Alice and Bob`);

    // Conversation 2: Alice <-> Charlie
    const conv2 = await Conversation.create({
      type: "direct",
      createdBy: createdUsers[0].id, // Alice
    });
    await ConversationMember.bulkCreate([
      { conversationId: conv2.id, userId: createdUsers[0].id }, // Alice
      { conversationId: conv2.id, userId: createdUsers[2].id }, // Charlie
    ]);
    conversations.push(conv2);
    console.log(`   ✓ Created conversation between Alice and Charlie`);

    // Conversation 3: Bob <-> Diana
    const conv3 = await Conversation.create({
      type: "direct",
      createdBy: createdUsers[1].id, // Bob
    });
    await ConversationMember.bulkCreate([
      { conversationId: conv3.id, userId: createdUsers[1].id }, // Bob
      { conversationId: conv3.id, userId: createdUsers[3].id }, // Diana
    ]);
    conversations.push(conv3);
    console.log(`   ✓ Created conversation between Bob and Diana`);

    // Conversation 4: Charlie <-> Eve
    const conv4 = await Conversation.create({
      type: "direct",
      createdBy: createdUsers[2].id, // Charlie
    });
    await ConversationMember.bulkCreate([
      { conversationId: conv4.id, userId: createdUsers[2].id }, // Charlie
      { conversationId: conv4.id, userId: createdUsers[4].id }, // Eve
    ]);
    conversations.push(conv4);
    console.log(`   ✓ Created conversation between Charlie and Eve`);

    // Conversation 5: Alice <-> Diana
    const conv5 = await Conversation.create({
      type: "direct",
      createdBy: createdUsers[0].id, // Alice
    });
    await ConversationMember.bulkCreate([
      { conversationId: conv5.id, userId: createdUsers[0].id }, // Alice
      { conversationId: conv5.id, userId: createdUsers[3].id }, // Diana
    ]);
    conversations.push(conv5);
    console.log(`   ✓ Created conversation between Alice and Diana`);

    console.log(`✅ Created ${conversations.length} conversations`);

    // Create some dummy messages
    console.log("📨 Creating messages...");
    const messages = [
      {
        conversationId: conv1.id,
        senderId: createdUsers[0].id, // Alice
        body: "Hey Bob! How are you doing?",
        messageType: "text",
      },
      {
        conversationId: conv1.id,
        senderId: createdUsers[1].id, // Bob
        body: "Hi Alice! I'm doing great, thanks for asking!",
        messageType: "text",
      },
      {
        conversationId: conv1.id,
        senderId: createdUsers[0].id, // Alice
        body: "That's awesome! Want to grab coffee sometime?",
        messageType: "text",
      },
      {
        conversationId: conv2.id,
        senderId: createdUsers[2].id, // Charlie
        body: "Hey Alice! Are you free this weekend?",
        messageType: "text",
      },
      {
        conversationId: conv2.id,
        senderId: createdUsers[0].id, // Alice
        body: "Yes, I am! What's up?",
        messageType: "text",
      },
      {
        conversationId: conv3.id,
        senderId: createdUsers[1].id, // Bob
        body: "Hi Diana! I saw your latest design work, it's amazing!",
        messageType: "text",
      },
      {
        conversationId: conv4.id,
        senderId: createdUsers[4].id, // Eve
        body: "Hey Charlie! How's the coding going?",
        messageType: "text",
      },
      {
        conversationId: conv5.id,
        senderId: createdUsers[3].id, // Diana
        body: "Hi Alice! Thanks for connecting!",
        messageType: "text",
      },
    ];

    for (const msgData of messages) {
      await Message.create(msgData);
    }
    console.log(`✅ Created ${messages.length} messages`);

    // Create call logs (between existing users in their conversations)
    console.log("📞 Creating call logs...");
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const callLogs = [
      {
        conversationId: conv1.id,
        callerUserId: createdUsers[0].id, // Alice
        calleeUserId: createdUsers[1].id, // Bob
        status: "ended",
        startedAt: oneHourAgo,
        endedAt: new Date(oneHourAgo.getTime() + 5 * 60 * 1000), // 5 min call
      },
      {
        conversationId: conv2.id,
        callerUserId: createdUsers[0].id, // Alice
        calleeUserId: createdUsers[2].id, // Charlie
        status: "rejected",
        startedAt: yesterday,
        endedAt: yesterday,
      },
      {
        conversationId: conv3.id,
        callerUserId: createdUsers[1].id, // Bob
        calleeUserId: createdUsers[3].id, // Diana
        status: "ended",
        startedAt: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000),
        endedAt: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000 + 12 * 60 * 1000), // 12 min
      },
      {
        conversationId: conv4.id,
        callerUserId: createdUsers[2].id, // Charlie
        calleeUserId: createdUsers[4].id, // Eve
        status: "ended",
        startedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
        endedAt: new Date(now.getTime() - 25 * 60 * 1000), // 5 min call
      },
      {
        conversationId: conv5.id,
        callerUserId: createdUsers[3].id, // Diana
        calleeUserId: createdUsers[0].id, // Alice
        status: "rejected",
        startedAt: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000),
        endedAt: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000),
      },
    ];

    for (const callData of callLogs) {
      await Call.create(callData);
    }
    console.log(`✅ Created ${callLogs.length} call logs`);

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Conversations: ${conversations.length}`);
    console.log(`   - Messages: ${messages.length}`);
    console.log(`   - Call logs: ${callLogs.length}`);
    console.log("\n💡 You can now login with any of these accounts:");
    console.log("   Phone: +1234567890, Password: password123 (Alice)");
    console.log("   Phone: +1234567891, Password: password123 (Bob)");
    console.log("   Phone: +1234567892, Password: password123 (Charlie)");
    console.log("   Phone: +1234567893, Password: password123 (Diana)");
    console.log("   Phone: +1234567894, Password: password123 (Eve)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
createDummyData();
