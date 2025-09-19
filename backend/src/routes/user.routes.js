import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  changeCurrentPassword,
  getUserChannelProfile,
  getWatchHistory,
  // updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 2 },
  ]),
  registerUser
);

userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyJWT, logoutUser);
userRouter.get("/me", verifyJWT, getMyProfile);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.put("/change-password", verifyJWT, changeCurrentPassword);
userRouter.patch("/update-account", verifyJWT, updateAccountDetails);
userRouter.put("/avatar", upload.single("avatar"), verifyJWT, updateUserAvatar);
// userRouter.put("/cover-image", verifyJWT, upload.single("coverImage"),updateUserCoverImage
// );
userRouter.get("/getUser-Channel-Profile/:username",   verifyJWT, getUserChannelProfile);
userRouter.get("/get-Watch-History",  verifyJWT, getWatchHistory);

export default userRouter;
