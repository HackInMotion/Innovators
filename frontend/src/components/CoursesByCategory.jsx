import React, { useState, useEffect } from "react";
import { Star, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../apiClient/apiClient";

const getFullUrl = (url) => `${import.meta.env.VITE_BASE_IMAGE_URL}${url}`;

const CoursesByCategory = () => {
  const { category } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });
  const navigate = useNavigate()

  const fetchCourses = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/courses/category?name=${category}&page=${page}&limit=${pagination.limit}`
      );
      
      setCourses(response.data.data.courses);
      setPagination({
        ...pagination,
        page,
        totalPages: response.data.data.pagination.totalPages,
        totalItems: response.data.data.pagination.totalItems
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCourses(newPage);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 text-lg">{error}</div>
          <button 
            onClick={() => fetchCourses()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category || "Unknown"} Courses
          </h1>
          <p className="text-lg text-gray-600">
            Browse all courses in this category
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses available in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Course Image */}
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {course.coverImage ? (
                      <img
                        src={getFullUrl(course.coverImage)}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No Image Available
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                      {course.categoryName || "Uncategorized"}
                    </span>

                    {/* Course Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    <p className="text-gray-600 mb-4">
                      By {course.instructorName || "Unknown Instructor"}
                    </p>

                    {/* Course Metadata */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span className="text-sm font-medium">
                          {course.rating || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {course.countModules || 0} Modules
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {course.countLessons || 0} Lessons
                        </span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          {course.price ? `₹${course.price.toFixed(2)}` : "Free"}
                        </span>
                        {course.price > 200 && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <button
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => navigate(`/course/detail/${course.id}`)}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-1 rounded-md ${pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md ${pagination.page === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-3 py-1 rounded-md ${pagination.page === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesByCategory;