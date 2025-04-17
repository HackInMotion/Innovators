import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../apiClient/apiClient";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";

const getFullUrl = (url) => `${import.meta.env.VITE_BASE_IMAGE_URL}${url}`;

// Skeleton Loading Component
const SubcategorySkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="h-48 bg-gray-200 animate-pulse"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const AllSubCategories = () => {
  const { name } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/subcategories?name=${name}`);
        setSubcategories(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch subcategories");
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [name]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Subcategories for {name}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Show skeleton loading while data is being fetched
          Array(8).fill(0).map((_, index) => (
            <SubcategorySkeleton key={index} />
          ))
        ) : subcategories.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <p className="text-gray-500">No subcategories found for "{name}"</p>
          </div>
        ) : (
          subcategories.map((subcat) => (
            <div key={subcat._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={getFullUrl(subcat.subcategoryImage)}
                  alt={subcat.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{subcat.name}</h2>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors" onClick={()=>navigate(`/course/${subcat.name}`)}>
                  Explore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllSubCategories;