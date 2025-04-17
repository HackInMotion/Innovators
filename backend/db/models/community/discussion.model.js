import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    forum: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Forum",
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const DiscussionModel = mongoose.model("Discussion", discussionSchema);

export default DiscussionModel;
