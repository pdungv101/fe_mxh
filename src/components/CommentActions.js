import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react"; // Import the EllipsisVertical icon

const CommentActions = ({ comment, onUpdate, onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);

  const handleUpdate = () => {
    onUpdate(comment.comment_id, newContent);
    setShowPopup(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="text-gray-600 hover:text-gray-900"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      {showPopup && (
        <div className="absolute bg-white shadow-md rounded-md p-4 mt-2 z-10">
          <h3 className="font-bold">Edit Comment</h3>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <div className="flex justify-between mt-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Update
            </button>
            <button
              onClick={() => {
                onDelete(comment.comment_id);
                setShowPopup(false);
              }}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentActions;
