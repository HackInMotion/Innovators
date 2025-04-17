import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema(
  {
    forumId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Forum",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ThreadModel = mongoose.model("Thread", ThreadSchema);
export default ThreadModel;
