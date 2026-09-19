import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs"; // Imported to clean up local files

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from request body
    const { fullName, email, username, password } = req.body;

    // 2. Validation - check for empty fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // 4. Check for images (Avatar is required, Cover Image is optional)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath); // Clean up cover image if avatar is missing
        throw new ApiError(400, "Avatar file is required");
    }

    // 5. Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage = null;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar to cloud storage");
    }

    // 6. Create user object and save to database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password, // Ensure your User model hashes this password before saving!
        username: username.toLowerCase()
    });

    // 7. Remove password and refresh token field from the response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 8. Send success response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered Successfully")
    );
});

const loginUser = asyncHandler(async (req,res) =>{
    
})

export { registerUser };
