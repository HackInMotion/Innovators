import mongoose from "mongoose";

const enrollmentStatusEnum = [ "ENROLLED", "COMPLETED"];

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  status: {
    type: String,
    enum: enrollmentStatusEnum,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    unique: true,
  },
});

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const EnrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

export default EnrollmentModel;
