import express from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
 
const dashboardRouter = express.Router();

dashboardRouter.get("/stats/:channelId", getChannelStats);
dashboardRouter.get("/videos/:channelId", getChannelVideos);

export default dashboardRouter;
