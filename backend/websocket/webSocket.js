import { Server } from "socket.io";

let io;
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
    methods: ["GET", "POST"],
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Join Chat Room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    // Leave Chat Room
    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
      console.log(`User left chat: ${chatId}`);
    });

    socket.on("sendChatMessage", async ({ chatId, content }) => {
      try {
        const chat = await ChatModel.findById(chatId);
        if (!chat) {
          return socket.emit("error", { message: "Chat not found" });
        }

        const newMessage = {
          sender: socket.userId,
          content,
          createdAt: new Date(),
          editedAt: null,
          isDeleted: false,
        };

        chat.messages.push(newMessage);
        await chat.save();

        const populatedMessage = await ChatModel.populate(newMessage, {
          path: "sender",
          select: "name email avatar",
        });

        io.to(chatId).emit("newChatMessage", {
          chatId,
          message: populatedMessage,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Listen for message edits
    socket.on("editChatMessage", async ({ chatId, messageId, newContent }) => {
      try {
        const chat = await ChatModel.findById(chatId);
        if (!chat) return socket.emit("error", { message: "Chat not found" });

        const message = chat.messages.id(messageId);
        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        if (message.sender.toString() !== socket.userId) {
          return socket.emit("error", { message: "Unauthorized action" });
        }

        message.content = newContent;
        message.editedAt = new Date();
        await chat.save();

        io.to(chatId).emit("chatMessageEdited", {
          chatId,
          messageId,
          newContent,
          editedAt: message.editedAt,
        });
      } catch (error) {
        console.error("Error editing message:", error);
        socket.emit("error", { message: "Failed to edit message" });
      }
    });

    // Listen for message deletions
    socket.on("deleteChatMessage", async ({ chatId, messageId }) => {
      try {
        const chat = await ChatModel.findById(chatId);
        if (!chat) return socket.emit("error", { message: "Chat not found" });

        const message = chat.messages.id(messageId);
        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        if (message.sender.toString() !== socket.userId) {
          return socket.emit("error", { message: "Unauthorized action" });
        }

        message.isDeleted = true;
        await chat.save();

        io.to(chatId).emit("chatMessageDeleted", {
          chatId,
          messageId,
          deletedBy: socket.userId,
          deletedAt: new Date(),
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("error", { message: "Failed to delete message" });
      }
    });

    // Typing indicators
    socket.on("typing", ({ chatId, isTyping }) => {
      socket.to(chatId).emit("typing", {
        userId: socket.userId,
        isTyping,
      });
    });

    // Group Management Events
    socket.on("joinGroup", async (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.userId} joined group: ${groupId}`);

      // Notify others in group about new member
      socket.to(groupId).emit("groupMemberJoined", {
        groupId,
        userId: socket.userId,
        joinedAt: new Date(),
      });
    });

    socket.on("leaveGroup", (groupId) => {
      socket.leave(groupId);
      console.log(`User ${socket.userId} left group: ${groupId}`);

      // Notify others in group
      socket.to(groupId).emit("groupMemberLeft", {
        groupId,
        userId: socket.userId,
        leftAt: new Date(),
      });
    });

    // Message Events
    socket.on("sendGroupMessage", async ({ groupId, content }) => {
      try {
        const group = await ChatGroupModel.findById(groupId);
        if (!group) {
          return socket.emit("error", { message: "Group not found" });
        }

        const newMessage = {
          sender: socket.userId,
          content,
          createdAt: new Date(),
          editedAt: null,
          isDeleted: false,
        };

        group.messages.push(newMessage);
        await group.save();

        const populatedMessage = await ChatGroupModel.populate(newMessage, {
          path: "sender",
          select: "username email",
        });

        io.to(groupId).emit("newGroupMessage", {
          groupId,
          message: populatedMessage,
        });
      } catch (error) {
        console.error("Error sending group message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on(
      "editGroupMessage",
      async ({ groupId, messageId, newContent }) => {
        try {
          const group = await ChatGroupModel.findById(groupId);
          if (!group)
            return socket.emit("error", { message: "Group not found" });

          const message = group.messages.id(messageId);
          if (!message) {
            return socket.emit("error", { message: "Message not found" });
          }

          if (message.sender.toString() !== socket.userId.toString()) {
            return socket.emit("error", { message: "Unauthorized action" });
          }

          message.content = newContent;
          message.editedAt = new Date();
          await group.save();

          io.to(groupId).emit("groupMessageEdited", {
            groupId,
            messageId,
            newContent,
            editedAt: message.editedAt,
          });
        } catch (error) {
          console.error("Error editing message:", error);
          socket.emit("error", { message: "Failed to edit message" });
        }
      }
    );

    socket.on("deleteGroupMessage", async ({ groupId, messageId }) => {
      try {
        const group = await ChatGroupModel.findById(groupId);
        if (!group) return socket.emit("error", { message: "Group not found" });

        const message = group.messages.id(messageId);
        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        if (message.sender.toString() !== socket.userId.toString()) {
          return socket.emit("error", { message: "Unauthorized action" });
        }

        message.isDeleted = true;
        await group.save();

        io.to(groupId).emit("groupMessageDeleted", {
          groupId,
          messageId,
          deletedBy: socket.userId,
          deletedAt: new Date(),
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("error", { message: "Failed to delete message" });
      }
    });

    // Group Management Events
    socket.on("groupCreated", (group) => {
      // Notify all members about the new group
      group.members.forEach((member) => {
        io.to(member.user.toString()).emit("newGroup", group);
      });
    });

    socket.on("groupMemberAdded", ({ groupId, userId }) => {
      io.to(userId).emit("addedToGroup", { groupId });
      io.to(groupId).emit("groupMemberListUpdated", { groupId });
    });

    socket.on("groupMemberRemoved", ({ groupId, userId }) => {
      io.to(userId).emit("removedFromGroup", { groupId });
      io.to(groupId).emit("groupMemberListUpdated", { groupId });
    });

    socket.on("groupAdminChanged", ({ groupId, newAdminId }) => {
      io.to(groupId).emit("groupAdminUpdated", {
        groupId,
        newAdminId,
      });
    });

    // Typing Indicators
    socket.on("typingInGroup", ({ groupId, isTyping }) => {
      socket.to(groupId).emit("groupTyping", {
        userId: socket.userId,
        isTyping,
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: Token is required"));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user details to socket instance
    socket.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    next(); // Proceed to next middleware/handler
  } catch (error) {
    console.error("Socket authentication failed:", error);
    next(new Error("Authentication error: Invalid token"));
  }
};

// Get the initialized io instance
const getIo = () => io;

// Middleware to pass Socket.io to routes
const socketIoMiddleware = (io) => {
  return (req, res, next) => {
    if (!io) {
      return res.status(500).json({ error: "Socket.io is not initialized" });
    }
    req.io = io;
    next();
  };
};

export { initializeSocket, io, getIo, socketIoMiddleware };
