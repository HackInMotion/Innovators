import mongoose from "mongoose";

const ChatGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["admin", "member"], default: "member" },
    },
  ],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      editedAt: { type: Date },
      deleted: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ChatGroupModel = mongoose.model("ChatGroup", ChatGroupSchema);
export default ChatGroupModel;
