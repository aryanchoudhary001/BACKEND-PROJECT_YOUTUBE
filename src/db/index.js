import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; //  Right
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);


const connectDB = async () => {
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST :${connectionInstance.connection.host}`);

    }catch (error) {
        console.log("Error connecting to MongoDB:",error);
        process.exit(1)
    }
}

export default connectDB;