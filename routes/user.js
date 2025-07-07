import express from "express";
import { updateUserProfile, cancelUserPlan } from "../controllers/user.js";
import upload from "../middleware/cloudinaryStorage.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/update/:id", verifyToken, upload.single("profilePicture"), updateUserProfile);
router.post("/cancelplan/:id", verifyToken, cancelUserPlan);

export default router;