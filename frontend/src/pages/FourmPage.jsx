import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  MessageSquare,
  Plus,
  User,
  Clock,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  X,
} from "lucide-react";
import apiClient from "../apiClient/apiClient.js";
import ForumComments from "./ForumComments.jsx";

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({
    title: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchForums = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/forums`);
      setForums(response.data.data);
    } catch (error) {
      console.error("Error fetching forums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", newForum.title);
      formData.append("description", newForum.description);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await apiClient.post("/forums", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const createdForum = response.data.data;
      setForums([createdForum, ...forums]);
      setNewForum({ title: "", description: "" });
      setSelectedImage(null);
      setPreviewImage(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating forum:", error);
    }
  };

  const handleVote = async (forumId, direction) => {
    const token = localStorage.getItem("token");

    try {
      setForums(
        forums.map((forum) =>
          forum._id === forumId
            ? { ...forum, votes: forum.votes + (direction === "up" ? 1 : -1) }
            : forum
        )
      );

      await apiClient.post(
        `/forums/${forumId}/vote`,
        { direction },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchForums();
    } catch (error) {
      console.error("Error voting:", error);
      setForums(
        forums.map((forum) =>
          forum._id === forumId
            ? {
                ...forum,
                votes: [
                  ...forum.votes,
                  { direction, createdBy: { _id: userId } },
                ],
              }
            : forum
        )
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discussions</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> New Discussion
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Discussion</h2>
          <form onSubmit={handleCreateForum}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title*
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newForum.title}
                onChange={(e) =>
                  setNewForum({ ...newForum, title: e.target.value })
                }
                required
                placeholder="What's your question or topic?"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Details (optional)
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newForum.description}
                onChange={(e) =>
                  setNewForum({ ...newForum, description: e.target.value })
                }
                placeholder="Add more details about your question or topic..."
              />
            </div>

            {/* Image upload section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Image (optional)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ImageIcon size={16} /> Choose Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                    >
                      <X size={14} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  removeImage();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Post Discussion
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : forums.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No discussions yet
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to start a discussion about this course
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} /> Start a Discussion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {forums.map((forum) => (
            <div
              key={forum._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-5">
                <div className="flex gap-4">
                  {/* Voting controls */}
                  <div className="flex flex-col items-center">
                    {(() => {
                      let userVote = null;
                      let hasUpvoted = false;
                      let hasDownvoted = false;

                      userVote = Array.isArray(forum?.votes)
                        ? forum.votes.find((v) => v?.createdBy?._id === userId)
                        : null;

                      hasUpvoted = userVote?.direction === "up";
                      hasDownvoted = userVote?.direction === "down";

                      return (
                        <>
                          <button
                            onClick={() => handleVote(forum._id, "up")}
                            className={`p-2 rounded ${
                              hasUpvoted
                                ? "text-blue-600 bg-blue-100"
                                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            <ChevronUp size={20} />
                          </button>
                          <span className="text-sm font-medium my-1">
                            {forum.votes.length || 0}
                          </span>

                          <button
                            onClick={() => handleVote(forum._id, "down")}
                            className={`p-2 rounded ${
                              hasDownvoted
                                ? "text-blue-600 bg-blue-100"
                                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            <ChevronDown size={20} />
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  {/* Forum content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-blue-600 cursor-pointer">
                      {forum.title}
                    </h3>
                    {forum.description && (
                      <p className="text-gray-600 mb-3">{forum.description}</p>
                    )}

                    {/* Display forum image if it exists */}
                    {forum.image && (
                      <div className="mb-3">
                        <img
                          src={`http://localhost:4000/uploads/forum/${forum.image}`}
                          alt="Forum content"
                          className="max-w-full h-auto max-h-80 rounded-md object-contain border border-gray-200"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{forum.createdBy?.username || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          {new Date(forum.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ForumComments forum={forum} setForums={setForums} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="bg-gray-50 px-5 py-3 flex justify-between border-t border-gray-200">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                    <Bookmark size={16} /> Save
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                    <Share2 size={16} /> Share
                  </button>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumPage;
