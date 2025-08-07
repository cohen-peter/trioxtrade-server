import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const idCardStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "id_cards",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});

const uploadIdCard = multer({ storage: idCardStorage });
export default uploadIdCard;
