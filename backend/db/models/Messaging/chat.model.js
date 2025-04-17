import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        editedAt: { type: Date },
        deleted: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("PrivateChat", ChatSchema);
export default ChatModel;
