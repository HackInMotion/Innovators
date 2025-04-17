import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import authRouter from "./modules/auth/auth.routes.js";
import forumRouter from "./modules/forum/forum.routes.js";
import threadRouter from "./modules/thread/thread.routes.js";
import messageRouter from "./modules/message/message.routes.js";
import ChatGroupRouter from "./modules/chatgroup/chatgroup.routes.js";
import chatRouter from "./modules/chat/chat.routes.js"
import categoryRouter from "./modules/category/category.routes.js";
import subcategoryRouter from "./modules/subcategory/subcategory.routes.js";
import courseRouter from "./modules/courses/courses.routes.js";
import moduleRouter from "./modules/module/module.routes.js";
import lessonRouter from "./modules/lessons/lesson.routes.js";
import enrollmentRouter from "./modules/enrollment/enrollment.routes.js";

export function bootstrap(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subcategoryRouter);
  app.use("/api/v1/courses",courseRouter );
  app.use("/api/v1/modules", moduleRouter);
  app.use("/api/v1/lessons", lessonRouter);
  app.use("/api/v1/enrollments", enrollmentRouter);
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
