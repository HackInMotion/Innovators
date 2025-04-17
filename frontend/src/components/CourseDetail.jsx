import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Star,
  BookOpen,
  Check,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../apiClient/apiClient";

const getFullUrl = (url) => `${import.meta.env.VITE_BASE_IMAGE_URL}${url}`;

const CourseDetail = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCourse = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const response = await apiClient.get(`/courses/${id}`);
        setCourse(response.data.data);

        // Prepare headers only if token exists
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Check enrollment
        const enrollmentResponse = await apiClient.get(
          `/enrollments/check?courseId=${id}`,
          { headers }
        );
        setIsEnrolled(enrollmentResponse.data.data.isEnrolled);
      } catch (err) {
        // setError(
        //   err.response?.data?.message || "Failed to fetch course details"
        // );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleModule = (moduleIndex) => {
    setExpandedModule(expandedModule === moduleIndex ? null : moduleIndex);
  };

  const handleEnrollment = async () => {
    if (isEnrolled) {
      navigate(`/learn/${id}/course`);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (course.price === 0) {
        await apiClient.post(`/enrollments/enroll-course?courseId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate(`/learn/${id}/course`);
        return;
      }

      // Paid course - create payment order
      const orderResponse = await apiClient.post(
        `/enrollments/create-order`,
        {
          courseId: id,
          totalAmount: course.course.price,
          paymentMethod: "BANK_TRANSFER",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.data.order.totalAmount * 100,
        currency: "INR",
        name: "Your Learning Platform",
        description: `Payment for ${course.title}`,
        order_id: orderResponse.data.data.razorpayOrderId,
        handler: async (response) => {
          try {
            await apiClient.post(`/enrollments/verify-payment`, {
              razorpay_order_id: orderResponse.data.data.razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              orderId: orderResponse.data.data.order._id,
              signature: response.razorpay_signature,
            });
            navigate(`/course/${id}/learn`);
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                className="h-full w-full object-cover"
                src={getFullUrl(course.course.coverImage)}
                alt={course.title}
                loading="lazy"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">
                {course.course.categoryId?.name}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.course.title}
              </h1>
              <p className="text-gray-600 mb-6">{course.course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="text-sm font-medium">
                    {course.course.rating || 0}
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
                    {course.course.modules?.length || 0} modules
                  </span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span className="text-sm">{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{course.totalDuration} mins</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <img
                  className="h-10 w-10 rounded-full mr-3"
                  src={getFullUrl(course.course.instructorId?.profilePicture)}
                  alt={course.course.instructorId?.fullname}
                />
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium">
                    {course.course.instructorId?.fullname}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ₹ {course.course.price?.toFixed(2) || "Free"}
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
            {course.course.whatLearn?.length > 0 && (
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
            )}

            {/* Requirements */}
            {course.course.requirements?.length > 0 && (
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
            )}

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Content
              </h2>
              <div className="space-y-4">
                {course.course.modules.map((module, moduleIndex) => (
                  <div
                    key={module._id}
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
                            key={lesson._id}
                            className="p-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <span className="text-gray-700">
                                {lessonIndex + 1}. {lesson.title}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {lesson.duration}
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
                {course.course.outcomes?.length > 0 && (
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
                )}

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
