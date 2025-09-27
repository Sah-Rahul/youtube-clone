import express from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";
 
const healthRouter = express.Router();

healthRouter.get("/", healthcheck);

export default healthRouter;
