import { useEffect, useState } from "react";
import { useParams, Navigate, Outlet } from "react-router-dom";
import apiClient from "../apiClient/apiClient";

const checkEnrollment = async (courseId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const enrollmentResponse = await apiClient.get(
      `/enrollments/check?courseId=${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return enrollmentResponse.data.data.isEnrolled;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Enrollment check failed");
  }
};

const UserEnrolledProtectedRoute = () => {
  const { courseId } = useParams();
  const [status, setStatus] = useState({
    loading: true,
    isEnrolled: false,
    error: null,
  });

  useEffect(() => {
    const verifyEnrollment = async () => {
      try {
        const isEnrolled = await checkEnrollment(courseId);
        setStatus({
          loading: false,
          isEnrolled,
          error: null,
        });
      } catch (error) {
        setStatus({
          loading: false,
          isEnrolled: false,
          error: error.message || "Failed to verify enrollment",
        });
      }
    };

    verifyEnrollment();
  }, [courseId]);

  if (status.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Checking enrollment status...</p>
        </div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Access Denied</h2>
          <p className="text-gray-600 text-center">{status.error}</p>
          <button
            onClick={() => window.location.href = `/course/detail/${courseId}`}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Back to Course Details
          </button>
        </div>
      </div>
    );
  }

  if (!status.isEnrolled) {
    return <Navigate to={`/course/detail/${courseId}`} replace />;
  }

  return <Outlet />;
};

export default UserEnrolledProtectedRoute;