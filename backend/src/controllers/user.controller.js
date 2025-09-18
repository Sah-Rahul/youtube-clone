import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// helper
const sendTokens = (user, res, message = "Success") => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return { accessToken, refreshToken, message };
};

// register
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (![fullName, username, email, password].every((f) => f?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  if (!req.files?.avatar?.length) {
    throw new ApiError(400, "Avatar is required");
  }

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarUrl = await uploadOnCloudinary(req.files.avatar[0].path);
  if (!avatarUrl) throw new ApiError(500, "Avatar upload failed");

  let coverImageUrl = "";
  if (req.files?.coverImage?.length) {
    coverImageUrl = await uploadOnCloudinary(req.files.coverImage[0].path);
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl || "",
  });

  const { accessToken } = sendTokens(user, res, "User registered successfully");

  return res.status(201).json(
    new ApiResponse(201, {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      coverImage: user.coverImage,
      watchHistory: user.watchHistory,
      accessToken,
    })
  );
});

// login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password required");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken } = sendTokens(user, res, "User logged in successfully");

  return res.status(200).json(
    new ApiResponse(200, {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      coverImage: user.coverImage,
      watchHistory: user.watchHistory,
      accessToken,
    })
  );
});

// logout
export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json(new ApiResponse(200, {}, "User logged out"));
});

// profile
export const getMyProfile = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "Profile fetched"));
});
