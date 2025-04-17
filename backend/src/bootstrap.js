import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import authRouter from "./modules/auth/auth.routes.js";
import forumRouter from "./modules/forum/forum.routes.js";
import threadRouter from "./modules/thread/thread.routes.js";
import messageRouter from "./modules/message/message.routes.js";
import ChatGroupRouter from "./modules/chatgroup/chatgroup.routes.js";
import chatRouter from "./modules/chat/chat.routes.js"

export function bootstrap(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/forums", forumRouter);
  app.use("/api/v1/threads", threadRouter);
  app.use("/api/v1/messages", messageRouter);
  app.use("/api/chats", chatRouter);
  app.use("/api/chats-groups", ChatGroupRouter);

  app.get("/", (req, res) => {
    res.send("Connected");
  });

  app.use(globalErrorHandling);
}
