import React, { useState } from "react";
import axios from "axios";
import Image from "next/image"; // Import Image from next/image

const CreatePost = ({ onCreatePost }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e) => {
    setMedia([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("content", content);

    // Append media files to FormData
    Array.from(media).forEach((file) => {
      formData.append("media", file);
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Adjust based on your API response structure
      const newPost = {
        post_id: response.data.postId.post_id,
        user_id: response.data.postId.user_id,
        content: response.data.postId.content,
        media: response.data.postId.media || [],
        created_at: new Date().toISOString(),
        username: localStorage.getItem("username"),
      };

      onCreatePost(newPost); // Notify parent component of new post
      setSuccess("Post created successfully!");
      setContent(""); // Clear content input
      setMedia([]); // Clear media files input
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="font-bold text-lg mb-2">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          rows="4"
          value={content}
          onChange={handleContentChange}
          required
          placeholder="What's on your mind?"
        />
        <input
          type="file"
          multiple
          onChange={handleMediaChange}
          className="mt-2"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}

      {/* Preview section for content */}
      {content && (
        <div className="mt-4 p-2 border rounded-lg bg-gray-50">
          <h3 className="font-bold text-lg">Preview:</h3>
          <div className="mt-2" style={{ whiteSpace: "pre-line" }}>
            {content}
          </div>
        </div>
      )}

      {/* Media preview section */}
      {media.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-lg">Media Preview:</h3>
          <div className="flex flex-wrap mt-2">
            {Array.from(media).map((file, index) => (
              <div key={index} className="mr-2 mb-2">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)} // Use createObjectURL for local preview
                    alt={`Preview ${index}`}
                    width={128} // Set the width of the image
                    height={128} // Set the height of the image
                    className="object-cover rounded"
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-32 border rounded flex items-center justify-center text-gray-500">
                    Unsupported Format
                  </div>
                )}
                <p className="text-xs text-center">{file.name}</p>{" "}
                {/* Show file name */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
