import express from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const commentRouter = express.Router();


commentRouter.get("/video/:videoId", getVideoComments);

commentRouter.post("/video/:videoId", verifyJWT, addComment);

commentRouter.put("/:commentId", verifyJWT, updateComment);

commentRouter.delete("/:commentId", verifyJWT, deleteComment);

export default commentRouter;
