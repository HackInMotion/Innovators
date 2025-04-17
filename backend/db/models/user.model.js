import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    role: {
      type: String,
      enum: ["student", "admin", "teacher"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
