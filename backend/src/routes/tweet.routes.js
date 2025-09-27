import express from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getAllTweets,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const tweetRouter = express.Router();

tweetRouter.use(verifyJWT);

tweetRouter.post("/", createTweet);

tweetRouter.get("/all-tweets", getAllTweets);

tweetRouter.get("/user/:userId", getUserTweets);

tweetRouter.patch("/:tweetId", updateTweet);

tweetRouter.delete("/:tweetId", deleteTweet);

export default tweetRouter;
