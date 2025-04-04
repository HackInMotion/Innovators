import { useState, useEffect, useRef } from "react";
import { MessageSquare, Edit, Trash2, Image as ImageIcon, X } from "lucide-react";
import apiClient from "../apiClient/apiClient";

const ForumComments = ({ forum, setForums }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch comments when forum or showComments changes
  useEffect(() => {
    if (showComments && forum?._id) {
      fetchComments();
    }
  }, [showComments, forum?._id]);

  const fetchForums = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/forums");
      setForums(response.data.data);
    } catch (error) {
      console.error("Error fetching forums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/comments/forum/${forum._id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

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

  const handleAddComment = async () => {
    if (!content.trim() && !selectedImage) return;

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("forumId", forum._id);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await apiClient.post("/comments", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setComments([response.data, ...comments]);
      setContent("");
      setSelectedImage(null);
      setPreviewImage(null);
      fetchForums();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim() && !selectedImage) return;

    try {
      const formData = new FormData();
      formData.append("content", editContent);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await apiClient.put(`/comments/${commentId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setComments(
        comments.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
      setEditingCommentId(null);
      setEditContent("");
      setSelectedImage(null);
      setPreviewImage(null);
      fetchForums();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setComments(comments.filter((comment) => comment._id !== commentId));
      fetchForums();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    if (comment.image) {
      setPreviewImage(comment.image);
    }
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
    setSelectedImage(null);
    setPreviewImage(null);
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
      >
        <MessageSquare size={14} />
        <span>{forum?.comments?.length || 0} comments</span>
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {/* Add Comment Form */}
          <div className="flex flex-col gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="p-2 border rounded-md"
              rows={3}
            />
            
            {/* Image upload for new comment */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="p-1 text-gray-500 hover:text-blue-500"
                title="Add image"
              >
                <ImageIcon size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {previewImage && !editingCommentId && (
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
            
            <button
              onClick={handleAddComment}
              disabled={isLoading}
              className="self-end px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments &&
              comments.map((comment) => (
                <div key={comment._id} className="p-3 border rounded-md">
                  {editingCommentId === comment._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                      />
                      
                      {/* Image upload for editing */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="p-1 text-gray-500 hover:text-blue-500"
                          title="Change image"
                        >
                          <ImageIcon size={18} />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        {(previewImage || comment.image) && (
                          <div className="relative">
                            <img
                              src={previewImage || comment.image}
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
                      
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment._id)}
                          disabled={isLoading}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
                        >
                          {isLoading ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {comment?.createdBy?.username || "Anonymous"}
                          </p>
                          <p className="text-gray-700">{comment?.content}</p>
                          {comment.image && (
                            <div className="mt-2">
                              <img
                                src={`http://localhost:4000/uploads/forum/${comment.image}`}
                                alt="Comment attachment"
                                className="max-w-full h-auto max-h-60 rounded-md"
                              />
                            </div>
                          )}
                        </div>
                        {/* Show edit/delete buttons only if user is the creator */}
                        {comment.createdBy?._id === userId && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(comment)}
                              className="text-gray-500 hover:text-blue-500"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment?.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumComments;