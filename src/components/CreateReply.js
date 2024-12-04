import React, { useState } from "react";
import axios from "axios";

const CreateReply = ({ commentId, onReplySubmitted }) => {
  const [replyContent, setReplyContent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/replies`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setReplyContent(""); // Clear input after successful submission
        onReplySubmitted(); // Notify the parent to refresh replies
      }
    } catch (err) {
      setError(
        err.response ? err.response.data.error : "Failed to submit reply."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter key
      handleReplySubmit(e); // Trigger form submission
    }
  };

  return (
    <div className="mt-2 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="font-bold text-lg mb-2">Add a Reply</h2>
      <form onSubmit={handleReplySubmit}>
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          rows="3"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          onKeyDown={handleKeyDown} // Attach onKeyDown event
          required
          placeholder="Write your reply here..."
        />
        <button
          type="submit"
          className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Reply"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && (
        <p className="text-green-500 mt-2">Reply submitted successfully!</p>
      )}
    </div>
  );
};

export default CreateReply;
