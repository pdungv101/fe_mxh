import React, { useState } from "react";
import { useRouter } from "next/router";
import CommentActions from "./CommentActions";
import CreateReply from "./CreateReply";
import { Heart, MessageCircle } from "lucide-react";
import useComment from "../hooks/useComment"; // Adjust path if needed
import {
  handleLikeClick,
  handleReplySubmitted,
} from "../utils/commentHandlers"; // Adjust path if needed
import Image from "next/image";

const Comment = ({ comment, onUpdate, onDelete }) => {
  const router = useRouter();
  const [showReplyInput, setShowReplyInput] = useState(false);

  // Use the custom hook
  const { liked, setLiked, likeCount, replies, setReplies, profilePicture } =
    useComment(comment);

  return (
    <div className="border-b py-2 flex flex-col bg-white rounded-lg shadow-md mb-4 p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {profilePicture && (
            <Image
              src={profilePicture}
              alt={`${comment.username}'s profile`}
              height={2560}
              width={2560}
              className="w-10 h-10 rounded-full mr-2 object-cover"
            />
          )}
          <div className="flex-1">
            <p className="font-bold">{comment.username}</p>
            <div className="whitespace-pre-wrap">{comment.content}</div>
            <p className="text-gray-500 text-xs">
              Comment ID: {comment.comment_id}
            </p>
            <p className="text-gray-500 text-xs">
              Parent ID: {comment.parent_id}
            </p>
            <p className="text-gray-500 text-sm">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() =>
              handleLikeClick(liked, setLiked, setReplies, comment.comment_id)
            }
            className="flex items-center text-blue-500"
          >
            <Heart fill={liked ? "blue" : "none"} className="text-blue-500" />
            <span className="ml-2">{likeCount}</span>
          </button>
          <CommentActions
            comment={comment}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      </div>

      <button
        onClick={() => setShowReplyInput((prev) => !prev)}
        className="text-blue-500 mt-2"
      >
        <MessageCircle className="mr-2" />
      </button>

      {showReplyInput && (
        <CreateReply
          commentId={comment.comment_id}
          onReplySubmitted={() =>
            handleReplySubmitted(setShowReplyInput, () => setReplies([]))
          }
        />
      )}

      {replies.length > 0 ? (
        <div className="mt-2 ml-4">
          {replies.map((reply) => (
            <div
              key={reply.comment_id}
              className="border-t py-2 rounded-lg border-gray-300 p-4"
            >
              <p className="font-bold">
                {reply.username || `User ${reply.user_id}`}
              </p>
              <div className="whitespace-pre-wrap">{reply.content}</div>
              <p className="text-gray-500 text-sm">
                {new Date(reply.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm ml-4">No replies yet.</p>
      )}
    </div>
  );
};

export default Comment;
