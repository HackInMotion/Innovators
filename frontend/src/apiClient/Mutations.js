import { gql } from "@apollo/client";

const CREATE_ORDER = gql`
  mutation (
    $courseId: Int!
    $totalAmount: Float!
    $paymentMethod: PaymentMethod!
  ) {
    createOrder(
      courseId: $courseId
      totalAmount: $totalAmount
      paymentMethod: $paymentMethod
    ) {
      razorpayOrderId
      order {
        id
      }
    }
  }
`;

const VERIFY_PAYMENT = gql`
  mutation ($razorpay_order_id: String!, $orderId: Int!,$razorpayPaymentId: String!,$signature: String!) {
    verifyPayment(
      razorpay_order_id: $razorpay_order_id
      orderId: $orderId
      razorpayPaymentId: $razorpayPaymentId
      signature: $signature
    ) {
      success
      message
    }
  }
`;

export { CREATE_ORDER, VERIFY_PAYMENT };
