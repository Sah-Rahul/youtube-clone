import  { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
 
// Create new playlist
export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  if (!name) throw new ApiError(400, "Playlist name is required");

  const playlist = new Playlist({
    name,
    description,
    owner: userId,
    videos: [],
  });

  await playlist.save();

 res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));

});


// Get all playlists of a user
export const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID");

  const playlists = await Playlist.find({ owner: userId }).populate("videos");

  res.status(200).json(new ApiResponse(200, playlists, "User playlists fetched"));
});

// Get playlist by ID
export const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");

  const playlist = await Playlist.findById(playlistId).populate("videos");

  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.json(new ApiResponse(true, 200, "Playlist fetched", playlist));
});

// Add video to playlist
export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  // Avoid duplicates
  if (playlist.videos.includes(videoId))
    throw new ApiError(400, "Video already in playlist");

  playlist.videos.push(videoId);
  await playlist.save();

  res.json(new ApiResponse(true, 200, "Video added to playlist", playlist));
});

// Remove video from playlist
export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  // Remove video if present
  playlist.videos = playlist.videos.filter(
    (vid) => vid.toString() !== videoId
  );

  await playlist.save();

  res.json(new ApiResponse(true, 200, "Video removed from playlist", playlist));
});

// Delete playlist
export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.json(new ApiResponse(true, 200, "Playlist deleted", null));
});

// Update playlist (name, description)
export const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (name) playlist.name = name;
  if (description) playlist.description = description;

  await playlist.save();

  res.json(new ApiResponse(true, 200, "Playlist updated", playlist));
});

 