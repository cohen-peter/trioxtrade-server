import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

/* REGISTER A NEW USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      verified,
      walletAddress,
      location
    } = req.body;

    // store profilePicture path after uploading it to cloudinary
    const profilePicture = req.file?.path || "";
    const idCard = "";

    // Generate investor ID
    const investorId = "TRX" + Date.now().toString().slice(-6);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
      verified,
      idCard,
      walletAddress,
      location
    });
    
    const savedUser = await newUser.save();
    const returnUser = savedUser.toObject();
    delete returnUser.password;

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to TRIOXTRADE — Your Investor ID",
      html: `
        <p>Hi ${firstName},</p>
        <p>Welcome to <b>TRIOXTRADE</b> — we’re excited to have you on board!</p>
        <p>Thank you for signing up. Your account has been successfully created, and you are now part of a growing global community of smart crypto investors.</p>
        <p><b>🔐 Your Investor ID:</b> ${investorId}</p>
        <p>(Please keep this ID safe — it will be used for support, verification, and portfolio management.)</p>
        <p>At TRIOXTRADE, we are committed to helping you grow your crypto wealth securely, transparently, and consistently. Our expert-managed plans, real-time tracking, and investor-first approach are all designed to help you succeed.</p>
        <h4>What's Next?</h4>
        <ul>
          <li>✅ Explore investment plans tailored to your goals</li>
          <li>✅ Complete your KYC for higher-tier benefits</li>
          <li>✅ Start earning and tracking your profits in real-time</li>
        </ul>
        <p>If you have any questions or need assistance, our support team is just a message away.</p>
        <p>Let’s build your financial future — together.</p>
        <p>Warm regards,<br/>The TRIOXTRADE Team<br/>
        🌐 <a href="https://trioxtrade.com">https://trioxtrade.com</a><br/>
        ✉️ support@trioxtrade.com</p>
      `
    });

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

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send email
    const resetLink = `https://trioxtrade-client.vercel.app/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'TRIOXTRADE Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #095CE0;">Password Reset Request</h2>
        <p>Hi <strong>${user.firstName}</strong>,</p>
        <p>We received a request to reset your <strong>TRIOXTRADE</strong> account password.</p>
        <p>Click the button below to reset it. This link will expire in <strong>15 minutes</strong>.</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" 
            style="display: inline-block; padding: 12px 20px; background-color: #095CE0; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset My Password
          </a>
        </p>
        <p>If the button above doesn’t work, you can copy and paste this link into your browser:</p>
        <p><a href="${resetLink}" style="color: #095CE0;">${resetLink}</a></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p style="margin-top: 30px;">— The TRIOXTRADE Team</p>
       </div>
      `
    });

    res.json({ message: 'Password reset email sent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Check if token still valid
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword; // Hash will happen if you already have a pre-save middleware
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
