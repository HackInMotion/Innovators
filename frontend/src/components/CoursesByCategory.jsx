import React from "react";
import { Star, Clock, Users, BookOpen, ArrowRight } from "lucide-react";
import { GET_COURSES_BY_CATEGORY } from "../apiClient/Queries";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

const BASE_IMG_URL = "http://localhost:5000";

const getFullImageUrl = (url) => `${BASE_IMG_URL}${url}`;

const CoursesByCategory = () => {
  const params = useParams();
  const category = params.category;

  const { loading, error, data } = useQuery(GET_COURSES_BY_CATEGORY, {
    variables: { category },
  });

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category || "Unknown"} Courses
          </h1>
          <p className="text-lg text-gray-600">
            {category?.description || "No description available."}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data?.getCoursesByCategory?.map((course) => (
            <div
              key={course?.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Course Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                {course?.coverImage ? (
                  <img
                    src={getFullImageUrl(course?.coverImage)}
                    alt={course?.title || "Course Image"}
                    className="w-full h-full object-cover"
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
                  {course?.categoryName || "Uncategorized"}
                </span>

                {/* Course Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course?.title || "Untitled Course"}
                </h3>

                {/* Instructor */}
                <p className="text-gray-600 mb-4">
                  By {course?.instructorName || "Unknown Instructor"}
                </p>

                {/* Course Metadata */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="text-sm font-medium">
                      {course?.rating ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{course?.duration ?? "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {course?.enrolledStudents ?? "0"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {course?.countModules ?? 0} Modules
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {course?.countLessons ?? 0} Lessons
                    </span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      ₹ {course?.price?.toFixed(2) ?? "Free"}
                    </span>
                    {course?.price > 200 && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() =>
                      (window.location.href = `/course/${course.id}`)
                    }
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )) || <p>No courses available.</p>}
        </div>

        {/* Pagination (optional) */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-200 text-gray-700">
              2
            </button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-200 text-gray-700">
              3
            </button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-200 text-gray-700">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CoursesByCategory;
