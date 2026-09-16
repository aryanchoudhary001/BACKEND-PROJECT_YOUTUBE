import dotenv from "dotenv";
import connectDB from "./db/index.js";
import path from "path";
import { app } from "./app.js"; // 1. Added missing app import statement

dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});

// 2. Properly handle the Async Promise returned by connectDB
connectDB()
.then(() => {
    // Open the server port only AFTER a successful database connection
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});
