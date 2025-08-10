import express from "express";
import { login, register, forgotPassword, resetPassword } from "../controllers/auth.js";
import upload from "../middleware/cloudinaryStorage.js";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;