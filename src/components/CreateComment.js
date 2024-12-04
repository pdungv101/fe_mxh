import React, { useState } from "react";
import axios from "axios";

const CreateComment = ({ postId, userId, onCommentCreated }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          postId,
          content,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setSuccess(true);
        setContent(""); // Clear the input
        onCommentCreated(); // Notify the parent to refresh comments
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : "An error occurred");
    }
  };

  // New function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter key
      handleSubmit(e); // Trigger form submission
    }
  };

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="font-bold text-lg mb-2">Add a Comment</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown} // Attach onKeyDown event
          required
          placeholder="Write your comment here..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && (
        <p className="text-green-500 mt-2">Comment created successfully!</p>
      )}
    </div>
  );
};

export default CreateComment;
