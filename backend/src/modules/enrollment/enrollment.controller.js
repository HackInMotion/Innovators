import EnrollmentModel from "../../../db/models/orders/enrollment.model.js";
import OrderModel from "../../../db/models/orders/order.model.js";
import PaymentModel from "../../../db/models/orders/payment.model.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import razorpayInstance from "../../../razorpay/config.js";
import ApiResponse from "../../utils/ApiResponse.js";
import AppError from "../../utils/AppError.js";
import crypto from "crypto";
import CourseProgressModel from "../../../db/models/courses/courseprogress.model.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res, next) => {
  const { courseId, totalAmount, paymentMethod } = req.body;
  const userId = req.user._id;

  const order = await OrderModel.create({
    userId,
    courseId,
    totalAmount,
    status: "PENDING",
  });

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: order._id.toString(),
  });

  const payment = await PaymentModel.create({
    orderId: order._id,
    paymentMethod,
    amount: totalAmount,
    status: "PENDING",
    razorpayOrderId: razorpayOrder.id,
    razorpayPaymentId: null,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { order, payment, razorpayOrderId: razorpayOrder.id },
        "Order created successfully!"
      )
    );
});

const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, orderId, razorpay_payment_id, signature } =
    req.body;

  const payment = await PaymentModel.findOne({ orderId }).populate("orderId");
  if (!payment) {
    return next(new AppError(404, "Payment not found"));
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== signature) {
    return next(new AppError(404, "Invalid payment signature"));
  }

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.status = "COMPLETED";
  payment.paymentDate = new Date();
  await payment.save();

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  order.status = "PAID";
  await order.save();

  const existingEnrollment = await EnrollmentModel.findOne({
    userId: payment.orderId.userId,
    courseId: payment.orderId.courseId,
  });

  if (!existingEnrollment) {
    await EnrollmentModel.create({
      userId: payment.orderId.userId,
      courseId: payment.orderId.courseId,
      status: "ENROLLED",
      orderId: orderId,
    });
  }

  const existingProgress = await CourseProgressModel.findOne({
    userId: payment.orderId.userId,
    courseId: payment.orderId.courseId,
  });

  if (!existingProgress) {
    const courseProgress = new CourseProgressModel({
      userId: payment.orderId.userId,
      courseId: payment.orderId.courseId,
      modulesCompleted: [],
      progressPercentage: 0,
      status: "NOT_STARTED",
    });

    await courseProgress.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Payment verified & enrollment created!"));
});

const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await OrderModel.findById(id)
    .populate("user")
    .populate("course");

  if (!order) return next(new AppError("Order not found", 404));

  return res.status(200).json(new ApiResponse(200, order));
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find().populate("user").populate("course");

  return res.status(200).json(new ApiResponse(200, orders));
});

const getPayment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const payment = await PaymentModel.findById(id).populate("order");

  if (!payment) return next(new AppError("Payment not found", 404));

  return res.status(200).json(new ApiResponse(200, payment));
});

const getPayments = asyncHandler(async (req, res) => {
  const payments = await PaymentModel.find().populate("order");
  return res.status(200).json(new ApiResponse(200, payments));
});

const getEnrollmentStatus = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  const userId = req.user._id;

  const enrollment = await EnrollmentModel.findOne({
    courseId,
    userId,
  }).select("_id createdAt");

  if (!enrollment) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isEnrolled: false,
          enrolledAt: null,
        },
        "User is not enrolled in this course"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isEnrolled: true,
        enrolledAt: enrollment.createdAt,
      },
      "User is enrolled in this course"
    )
  );
});

const createEnrollment = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  const userId = req.user._id;

  // Validate input
  if (!courseId) {
    return next(new AppError('Course ID is required', 400));
  }

  // Check if already enrolled
  const existingEnrollment = await EnrollmentModel.findOne({ userId, courseId });
  if (existingEnrollment) {
    return next(new AppError('User is already enrolled in this course', 400));
  }

  // Check if course exists
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  try {
    // Create enrollment
    const enrollment = await EnrollmentModel.create({
      userId,
      courseId,
      status: "ENROLLED",
      orderId: new mongoose.Types.ObjectId(),
    });

    const courseProgress = await CourseProgressModel.create({
      userId: userId,
      courseId: courseId,
      modulesCompleted: [],
      progressPercentage: 0,
      status: "NOT_STARTED",
    });

    await CourseModel.findByIdAndUpdate(courseId, {
      $inc: { enrolledStudents: 1 }
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          isEnrolled: true,
          enrolledAt: enrollment.createdAt,
          progressId: courseProgress._id
        },
        "Enrollment successful"
      )
    );

  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('Duplicate enrollment detected', 409));
    }
    return next(new AppError('Enrollment failed', 500));
  }
});

export {
  createOrder,
  verifyPayment,
  getOrder,
  getOrders,
  getPayment,
  getPayments,
  getEnrollmentStatus,
  createEnrollment,
};
