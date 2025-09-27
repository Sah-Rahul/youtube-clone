import express from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const videoRouter = express.Router();

videoRouter.get("/", getAllVideos);

videoRouter.post("/publish", verifyJWT, upload.single("video"), publishAVideo);

videoRouter.get("/getVideoById/:videoId", getVideoById);

videoRouter.put("/update-video/:videoId", verifyJWT, updateVideo);

videoRouter.delete("/delete-video/:videoId", verifyJWT, deleteVideo);

videoRouter.patch("/toggle-publish/:videoId", verifyJWT, togglePublishStatus);


export default videoRouter;
