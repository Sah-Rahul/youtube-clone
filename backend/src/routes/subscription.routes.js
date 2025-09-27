import { Router } from 'express';
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/channel/:channelId/toggle", toggleSubscription);

router.get("/channel/:channelId/subscribers", getUserChannelSubscribers);

router.get("/user/:subscriberId/channels", getSubscribedChannels);

export default router;
