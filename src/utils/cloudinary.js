import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // 1. ADDED 'await' and assigned it to the 'response' variable
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // 2. Safely logs the URL now that response is defined
        console.log("File has been uploaded on cloudinary successfully", response.url);
        
        // 3. Delete the local temporary file after successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        return response;
    } catch (error) {
        // Log the exact error to your terminal so you can see if credentials fail
        console.error("Cloudinary upload utility error:", error);

        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export { uploadOnCloudinary };
