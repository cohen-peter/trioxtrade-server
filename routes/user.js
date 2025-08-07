import express from "express";
import { updateUserProfile, cancelUserPlan, uploadIdCardController } from "../controllers/user.js";
import upload from "../middleware/cloudinaryStorage.js";
import uploadIdCard from "../middleware/uploadIdCard.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/update/:id", verifyToken, upload.single("profilePicture"), updateUserProfile);
router.put("/upload-idcard/:id", verifyToken, uploadIdCard.single("idCard"), uploadIdCardController);
router.post("/cancelplan/:id", verifyToken, cancelUserPlan);

export default router;