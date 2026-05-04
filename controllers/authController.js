import User from "../models/User.js";
import bcrypt from "bcryptjs";

// FORGOT PASSWORD (you already have this, keep yours if working)

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    // 1. Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired token"
      });
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update password + clear reset fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return res.status(200).json({
      msg: "Password reset successful"
    });

  } catch (error) {
    console.log("RESET ERROR:", error);
    return res.status(500).json({
      msg: "Server error"
    });
  }
};