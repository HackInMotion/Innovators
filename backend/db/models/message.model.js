import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Thread",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: { type: String, required: true },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;
