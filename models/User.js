import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  resetToken: String,
  resetTokenExpiry: Date
});

export default mongoose.model("User", userSchema);