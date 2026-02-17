import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
);

async function dbConnectionCheck() {
  try {
    // Check if required environment variables are set
    if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
      throw new Error("Missing required database environment variables");
    }
    
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    throw error; // Re-throw to stop server startup if DB connection fails
  }
}

export { sequelize, dbConnectionCheck };
