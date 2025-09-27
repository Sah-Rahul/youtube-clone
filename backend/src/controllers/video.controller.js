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

// GET ALL VIDEOS
export const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  // Match filter
  const match = {};
  if (query) {
    match.title = { $regex: query, $options: "i" };
  }
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    match.owner = new mongoose.Types.ObjectId(userId);
  }

  const sortOptions = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };

  const videos = await Video.aggregate([
    { $match: match },
    { $sort: sortOptions },
    { $skip: (page - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        isPublished: 1,
        createdAt: 1,
        "owner.username": 1,
        "owner.email": 1,
      },
    },
  ]);

  const total = await Video.countDocuments(match);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { total, videos }, "Videos fetched successfully")
    );
});

// GET VIDEO BY ID
export const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate(
    "owner",
    "username email"
  );
  if (!video) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});
