import React from "react";
import { useQuery } from "@apollo/client";
import { getCategories } from "../apiClient/Queries.js";
import { useNavigate } from "react-router-dom";

const BASE_IMG_URL = "http://localhost:5000";

// Skeleton Loader Component
const CategorySkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const Categories = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(getCategories);

  if (loading) return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Skeleton Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-8 py-2 bg-gray-200 rounded-full mb-4 w-32 mx-auto"></div>
          <div className="h-12 bg-gray-200 rounded-full max-w-md mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-full max-w-xl mx-auto"></div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
        </div>

        {/* Skeleton CTA */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded-full max-w-xl mx-auto mb-6"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="py-16 text-center">
      <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error loading categories</h3>
        <p className="mt-2 text-red-600">Please try refreshing the page</p>
      </div>
    </div>
  );

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full mb-4">
            Learning Paths
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover knowledge across diverse fields tailored to your interests and career goals.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data?.getCategories?.map((category) => (
            <div
              key={category.category.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              onClick={() => navigate(`/category/${category?.category?.name}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-shadow duration-300 z-10">
                    <img
                      src={`${BASE_IMG_URL}${category.category.categoryImage}`}
                      alt={category.category.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div className="z-10">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category.category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.countCourses} {category.countCourses === 1 ? 'Course' : 'Courses'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center px-3 py-2 bg-gray-50 group-hover:bg-blue-50 rounded-lg transition-colors duration-300">
                    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                      Explore
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to start learning?
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of students advancing their careers with our courses.
          </p>
          <button 
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => navigate('/categories')}
          >
            Browse All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;