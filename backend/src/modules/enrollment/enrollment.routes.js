import express from "express";
import {
  createOrder,
  verifyPayment,
  getOrder,
  getOrders,
  getPayment,
  getPayments,
  getEnrollmentStatus,
  createEnrollment,
} from "./enrollment.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const enrollmentRouter = express.Router();

enrollmentRouter.post(
  "/create-order",
  protectedRoutes,
  allowedTo("student"),
  createOrder
);

enrollmentRouter.post("/verify-payment", verifyPayment);
enrollmentRouter.post("/enroll-course", protectedRoutes, createEnrollment);

enrollmentRouter.get("/order/:id", protectedRoutes, getOrder);

enrollmentRouter.get("/orders", protectedRoutes, allowedTo("admin"), getOrders);

enrollmentRouter.get("/payment/:id", protectedRoutes, getPayment);
enrollmentRouter.get("/check", protectedRoutes, getEnrollmentStatus);

enrollmentRouter.get(
  "/payments",
  protectedRoutes,
  allowedTo("admin"),
  getPayments
);

export default enrollmentRouter;
