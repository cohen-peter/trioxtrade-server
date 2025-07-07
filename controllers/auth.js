import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* REGISTER A NEW USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      walletAddress,
      location
    } = req.body;

    // store profilePicture path after uploading it to cloudinary
    const profilePicture = req.file?.path || "";

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
      walletAddress,
      location
    });
    
    const savedUser = await newUser.save();
    const returnUser = savedUser.toObject();
    delete returnUser.password;

    res.status(201).json(returnUser);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ msg: "Acccount with email already exists"});
    }
    res.status(500).json({ error: err.message })
  }
}


/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist "});

    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials "});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
    delete user.password;
    res.status(200).json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};