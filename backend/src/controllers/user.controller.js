import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to register a new user
export const registerUser = asyncHandler(async (req, res) => {
  // Destructure and sanitize input fields
  const { fullName, username, email, password } = req.body;

  // Validate presence of required fields
  if (![fullName, username, email, password].every((field) => field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate avatar upload presence
  if (!req.files?.avatar?.length) {
    throw new ApiError(400, "Avatar image is required");
  }

  // Check if email or username already exists
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // Upload avatar image to Cloudinary
  const avatarPath = req.files.avatar[0].path;
  const avatarUrl = await uploadOnCloudinary(avatarPath);

  if (!avatarUrl) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  // Upload cover image if provided, else null
  let coverImageUrl = null;
  if (req.files.coverImage?.length) {
    const coverImagePath = req.files.coverImage[0].path;
    coverImageUrl = await uploadOnCloudinary(coverImagePath);
    if (!coverImageUrl) {
      throw new ApiError(500, "Failed to upload cover image");
    }
  }

  // Create user
  const user = await User.create({
    fullName: fullName.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token in HTTP-only cookie for security
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Respond with user data and access token
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage,
        watchHistory: user.watchHistory,
        accessToken,
      },
      "User registered successfully"
    )
  );
});

export const loginUser = asyncHandler(async (req, res) => {});
export const logoutUser = asyncHandler(async (req, res) => {});
