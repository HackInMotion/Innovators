import mongoose from "mongoose";

const ForumSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    description: { type: String },
    image: {
      type: String,
      default: null,
    },
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        direction: { type: String, enum: ["up", "down"] },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discussion" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ForumSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

const ForumModel = mongoose.model("Forum", ForumSchema);

export default ForumModel;
