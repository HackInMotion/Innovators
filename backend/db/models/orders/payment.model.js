import mongoose from "mongoose";

const paymentStatusEnum = ["PENDING", "COMPLETED", "FAILED"];
const paymentMethodEnum = ["BANK_TRANSFER", "CASH"];

const paymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: paymentMethodEnum,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: paymentStatusEnum,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    unique: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);

export default PaymentModel;
