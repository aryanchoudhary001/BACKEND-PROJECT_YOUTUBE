import { asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const registerUser = asyncHandler(async (req, res)=>{
   // Get User Details from frontend or request body
   //validation - not empty, email format, password strength
   //check if user already exists in database: user, email
   //check for images, check for avatar
   //upload them to cloudinary, check avatar
   // create user object and save to database
   //remove password and refresh token field from the response
   //check for the user creation success and send response to frontend


   const{fullname,email,username,password} = req.body;
   console.log("email",email);

   if (
    [fullname, email, username, password].some((field) => field?.trim()==="")
    )
    {
    throw new ApiError(400, "All fields are required")
    }

    const existedUser =User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path; 
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath || !coverImageLocalPath){
        throw new ApiError(400, "Avatar and Cover Image are required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar){
        throw new ApiError(400, "Avatar and Cover Image are required")
    }

    User.create({
        fullName,
        avatar: avatar.url
    })



})

export {
    registerUser,

}