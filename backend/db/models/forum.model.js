import mongoose from "mongoose";

const ForumSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const ForumModel = mongoose.model("Forum", ForumSchema);

export default ForumModel;
