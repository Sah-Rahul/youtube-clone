import mongoose from "mongoose";
import Video from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// PUBLISH A VIDEO
export const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  if (!req.file) {
    throw new ApiError(400, "Video file is required");
  }

  const localPath = req.file.path;

  try {
    // Upload video to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(localPath);
    if (!uploadedVideo?.secure_url) {
      throw new ApiError(500, "Video upload failed");
    }

    // Extract details from Cloudinary response
    const videoFile = uploadedVideo.secure_url;
    const thumbnail = uploadedVideo.thumbnail_url || uploadedVideo.secure_url; // fallback
    const duration = uploadedVideo.duration || 0;

    // Save to DB
    const video = await Video.create({
      title,
      description,
      videoFile, // ✅ matches schema
      thumbnail, // ✅ required
      duration, // ✅ required
      owner: req.user._id, // ✅ matches schema
    });

    return res
      .status(201)
      .json(new ApiResponse(201, video, "Video uploaded successfully"));
  } catch (error) {
    throw error;
  }
});

