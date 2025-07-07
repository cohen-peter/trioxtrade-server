import express from "express";
import { login, register } from "../controllers/auth.js";
import upload from "../middleware/cloudinaryStorage.js";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);

export default router;