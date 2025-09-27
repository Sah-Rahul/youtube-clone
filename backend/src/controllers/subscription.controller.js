import { Subscription } from "../models/subcription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;  

  if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid user or channel ID");
  }

  if (channelId.toString() === subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    // Unsubscribe
    await existingSubscription.deleteOne();
    return res.json(new ApiResponse(200, null, "Unsubscribed successfully"));
  } else {
    // Subscribe
    const subscription = new Subscription({
      subscriber: subscriberId,
      channel: channelId,
    });
    await subscription.save();
    return res.json(new ApiResponse(201, subscription, "Subscribed successfully"));
  }
});

export const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "username fullName avatar")   
    .lean();

  const subscriberUsers = subscribers.map(sub => sub.subscriber);

  res.json(new ApiResponse(200, subscriberUsers, "Subscribers fetched successfully"));
});

export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriptions = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "username fullName avatar")  
    .lean();

  const channels = subscriptions.map(sub => sub.channel);

  res.json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"));
});
