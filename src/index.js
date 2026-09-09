import dotenv from "dotenv";
import connectDB from "./db/index.js";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});

// 🔍 Add this line here to debug:
console.log("Your URI is:", process.env.MONGODB_URI);

connectDB();
