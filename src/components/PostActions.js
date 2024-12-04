import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";

const PostActions = ({ post, onUpdate, onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [newContent, setNewContent] = useState(post.content);

  const handleUpdate = () => {
    onUpdate(post.post_id, newContent);
    setShowPopup(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup((prev) => !prev)}
        className="text-gray-600 hover:text-gray-900"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      {showPopup && (
        <div className="absolute bg-white shadow-md rounded-md p-4 mt-2 z-10">
          <h3 className="font-bold">Edit Post</h3>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="border rounded p-2 w-full"
            rows="4"
          />
          <div className="flex justify-between mt-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={() => {
                onDelete(post.post_id);
                setShowPopup(false);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostActions;
