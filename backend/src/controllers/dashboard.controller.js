import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Video from "../models/video.model.js";
import { Subscription } from "../models/subcription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import { Like } from "../models/like.model.js";

export const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Find channel user
  const user = await User.findById(channelId);
  if (!user) {
    throw new ApiError(404, "Channel not found");
  }

  // Count subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  // Find all videos uploaded by channel
  const videos = await Video.find({ owner: channelId });

  // Total videos count
  const totalVideos = videos.length;

  // Sum total views
  const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);

  // Count total likes on all channel videos
  const videoIds = videos.map((video) => video._id);
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  // Build stats response
  const stats = {
    channelId: user._id,
    fullName: user.fullName,
    username: user.username,
    avatar: user.avatar,
    totalSubscribers,
    totalVideos,
    totalViews,
    totalLikes,
  };

  res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

export const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ owner: channelId })
    .populate("owner", "username avatar")
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});
