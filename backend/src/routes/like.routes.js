import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const likeRouter = express.Router();
likeRouter.use(verifyJWT);

likeRouter.post("/video/:videoId", toggleVideoLike);

likeRouter.post("/comment/:commentId", toggleCommentLike);

likeRouter.post("/tweet/:tweetId", toggleTweetLike);

likeRouter.get("/videos", getLikedVideos);

export default likeRouter;
