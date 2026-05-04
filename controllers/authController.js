import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// FORGOT PASSWORD CONTROLLER
export const forgotPassword = async (req, res) => {
  try {
    console.log("FORGOT PASSWORD API HIT");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        msg: "Email is required"
      });
    }

    // 1. Check user exists
    const user = await User.findOne({ email });

    // IMPORTANT: Always send same response (security practice)
    if (!user) {
      return res.status(200).json({
        msg: "If this email exists, reset link was sent"
      });
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Set expiry (1 hour)
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    // 4. Save token in DB
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    console.log("TOKEN GENERATED");

    // 5. Reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 6. SEND EMAIL (wrapped safely so it won't crash API)
    try {
      await sendEmail(
        email,
        "Password Reset",
        `Click here to reset your password: ${resetLink}`
      );
      console.log("EMAIL SENT");
    } catch (emailError) {
      console.log("EMAIL FAILED (IGNORED):", emailError.message);
      // IMPORTANT: We do NOT crash API if email fails
    }

    // 7. Response (ALWAYS RETURNS)
    return res.status(200).json({
      msg: "If this email exists, reset link was sent"
    });

  } catch (error) {
    console.log("FATAL ERROR:", error);

    return res.status(500).json({
      msg: "Server error"
    });
  }
};