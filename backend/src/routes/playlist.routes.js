import { Router } from 'express';
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const playlistRouter = Router();

playlistRouter.use(verifyJWT); 

playlistRouter.post("/", createPlaylist);

playlistRouter.get("/user/:userId", getUserPlaylists);

playlistRouter
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

playlistRouter.patch("/add/:videoId/:playlistId", addVideoToPlaylist);

playlistRouter.patch("/:playlistId/videos/:videoId/remove", removeVideoFromPlaylist);

export default playlistRouter;
