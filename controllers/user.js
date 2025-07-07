import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

/* UPDATE USER PROFILE */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, walletAddress, phoneNumber, location, activePlan, planActivatedAt, nextPayout } = req.body;
    const profilePicture = req.file?.path; 

    // destroys old profile picture if a new one is given

    if (profilePicture){
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      if (user.profilePicture !== ""){
        const pictureId = user.profilePicture
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0]; // removes the extension and only get part to delete

          await cloudinary.uploader.destroy(pictureId);
      }
    }
    //check for what is provided to update
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (walletAddress) updates.walletAddress = walletAddress;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (location) updates.location = location;
    if (profilePicture) updates.profilePicture = profilePicture;
    if (activePlan) updates.activePlan = activePlan;
    if (planActivatedAt) updates.planActivatedAt = planActivatedAt;
    if (nextPayout) updates.nextPayout = nextPayout;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

// CANCELS THE ACTIVE USER PLAN
export const cancelUserPlan = async (req, res) => {
  try {
    const userId = req.params.id;

    //set everything related to the plan to zero
    const updates = {};
    updates.activePlan = null;
    updates.planActivatedAt = null;
    updates.nextPayout = null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};