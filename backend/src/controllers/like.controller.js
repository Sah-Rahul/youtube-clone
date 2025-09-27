import  { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
 
// Toggle like on video
export const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(
            new ApiResponse(200, null, "Video unliked successfully")
        );
    }

    await Like.create({
        video: videoId,
        likedBy: userId
    });

    return res.status(201).json(
        new ApiResponse(201, null, "Video liked successfully")
    );
});

// Toggle like on comment
export const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(
            new ApiResponse(200, null, "Comment unliked successfully")
        );
    }

    await Like.create({
        comment: commentId,
        likedBy: userId
    });

    return res.status(201).json(
        new ApiResponse(201, null, "Comment liked successfully")
    );
});

// Toggle like on tweet
export const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(
            new ApiResponse(200, null, "Tweet unliked successfully")
        );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: userId
    });

    return res.status(201).json(
        new ApiResponse(201, null, "Tweet liked successfully")
    );
});

// Get all liked videos by the logged-in user
export const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const likes = await Like.find({ likedBy: userId, video: { $ne: null } })
        .populate("video");

    const likedVideos = likes.map(like => like.video);

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

 