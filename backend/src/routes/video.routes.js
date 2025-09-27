import express from "express";
import {
  publishAVideo,
} from "../controllers/video.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const videoRouter = express.Router();

videoRouter.get("/", getAllVideos);

videoRouter.post("/publish", verifyJWT, upload.single("video"), publishAVideo);

videoRouter.get("/getVideoById/:videoId", getVideoById);

export default videoRouter;
