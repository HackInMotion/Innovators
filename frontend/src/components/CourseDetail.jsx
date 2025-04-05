import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Star,
  BookOpen,
  Check,
  Award,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_COURSES_BY_ID, IS_USER_ENROLLED } from "../apiClient/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ORDER, VERIFY_PAYMENT } from "../apiClient/Mutations.js";

const BASE_IMG_URL = "http://localhost:5000";

const getFullImageUrl = (url) => `${BASE_IMG_URL}${url}`;

const CourseDetail = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const params = useParams();
  const id = params.id;
  // const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_COURSES_BY_ID, {
    variables: { id: parseInt(id) },
  });

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3NDM2NzIwMDksImV4cCI6MTc0MzY3NTYwOX0.ezj_gMbsR2ykVlzIHMK3lhDmyjKxtn6hBp7M3kQGxUg";

  const [createOrder] = useMutation(CREATE_ORDER);
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);
  const { data: isEnrollData } = useQuery(IS_USER_ENROLLED, {
    variables: {
      courseId: parseInt(id),
    },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const course = data.getCourseById;
  const toggleModule = (moduleIndex) => {
    setExpandedModule(expandedModule === moduleIndex ? null : moduleIndex);
  };

  const isEnrolled = isEnrollData?.isUserEnrolledInCourse.isEnrolled;
  const handleEnrollment = () => {
    if (isEnrolled) {
      window.location.href = `/enroll-course/${id}/coursePlayer`;
    } else {
      enrollCourse(course.course);
    }
  };
  const enrollCourse = async (course) => {
    try {
      const { data } = await createOrder({
        variables: {
          courseId: parseInt(course.id),
          totalAmount: course.price,
          paymentMethod: "BANK_TRANSFER",
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (!data || !data.createOrder) {
        throw new Error("Order creation failed");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.createOrder.totalAmount,
        currency: "INR",
        name: "OMEXO",
        description: "Web Development Course",
        order_id: data.createOrder.razorpayOrderId,
        handler: async function (response) {
          try {
            await verifyPayment({
              variables: {
                razorpay_order_id: response.razorpay_order_id,
                orderId: parseInt(data.createOrder.order.id),
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });
            alert("Payment verified successfully!");
            window.location.href = `/enroll-course/${id}/coursePlayer`;
          } catch (error) {
            console.error("Payment verification failed", error);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Enrollment failed", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                className="h-full w-full object-cover"
                src={getFullImageUrl(course.course.coverImage)}
                alt={course.course.title}
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">
                {course.course.category.name}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.course.title}
              </h1>
              <p className="text-gray-600 mb-6">{course.course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="text-sm font-medium">
                    {course.course.rating}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {course.enrolledStudentCount || 0} enrolled
                  </span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {course.course.modules.reduce(
                      (acc, mod) => acc + mod.lessons.length,
                      0
                    )}{" "}
                    lessons
                  </span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{course.totalDuration} mins</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <img
                  className="h-10 w-10 rounded-full mr-3"
                  src={getFullImageUrl(course.course.instructor.avatar)}
                  alt={course.course.instructor.name}
                />
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium">{course.course.instructor.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ${course.course.price.toFixed(2)}
                  </span>
                </div>
                <button
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                  onClick={handleEnrollment}
                >
                  {isEnrolled ? "Go to Course" : "Enroll Now"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="md:w-2/3">
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.course.whatLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <ul className="space-y-2">
                {course.course.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-700">• {item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Content
              </h2>
              <div className="space-y-4">
                {course.course.modules.map((module, moduleIndex) => (
                  <div
                    key={moduleIndex}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleModule(moduleIndex)}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{module.title}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {module.lessons.length} lessons
                        </span>
                      </div>
                      {expandedModule === moduleIndex ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {expandedModule === moduleIndex && (
                      <div className="divide-y divide-gray-200">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="p-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <span className="text-gray-700">
                                {lessonIndex + 1}. {lesson.title}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {lesson.duration} min
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8 p-6">
              <div className="space-y-6">
                {/* Course Highlights */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    Course Highlights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-blue-500 mr-3" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-500 mr-3" />
                      <span>{course.totalDuration} mins of content</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-blue-500 mr-3" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>

                {/* Includes */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    Includes
                  </h3>
                  <ul className="space-y-3">
                    {course.course.outcomes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Enroll */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 text-center">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
