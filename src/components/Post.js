import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Heart,
  MessageCircle,
  Bookmark,
  UserPlus,
  UserCheck,
} from "lucide-react";
import usePostData from "../hooks/usePostData"; // Import the custom hook
import {
  handleLikeClick,
  handleCommentClick,
  handleBookmarkClick,
  handleFollowClick,
} from "../utils/postHandlers"; // Import the utility functions
import PostActions from "./PostActions"; // Assuming this includes edit, delete actions
import Link from "next/link";

const Post = ({ post, onUpdate, onDelete }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    liked,
    likeCount,
    commentCount,
    isFollowing,
    userDetails,
    setLiked,
    setIsFollowing,
  } = usePostData(post); // Use the custom hook

  const currentUserId = localStorage.getItem("userId");
  const [showAll, setShowAll] = useState(false); // State to manage showing full content

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const displayedContent = showAll
    ? post.content
    : post.content.substring(0, 500);
  const isContentLong = post.content.length > 500;

  return (
    <div className="border p-4 mb-4 rounded-md shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {userDetails && userDetails.profile_picture && (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${userDetails.profile_picture}`}
              alt={`${userDetails.username}'s profile picture`}
              width={2560}
              height={2560}
              className="rounded-full mr-2 w-12 h-12 object-cover"
            />
          )}
          <div className="flex flex-col">
            <Link href={`/users/${post.user_id}`} className="font-bold">
              {userDetails ? userDetails.username : "Loading..."}
            </Link>
            <p className="text-gray-500 text-sm">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {String(currentUserId) === String(post.user_id) ? (
          <PostActions post={post} onUpdate={onUpdate} onDelete={onDelete} />
        ) : (
          <button
            onClick={() => handleFollowClick(isFollowing, post, setIsFollowing)}
            className={`ml-2 px-2 py-1 rounded flex items-center ${
              isFollowing ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? (
              <UserCheck className="mr-1" />
            ) : (
              <UserPlus className="mr-1" />
            )}
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <p className="mt-2 text-gray-800 whitespace-pre-wrap">
        {displayedContent}
        {isContentLong && (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={toggleShowAll}
          >
            {showAll ? " Show less" : " Show all"}
          </span>
        )}
      </p>

      {Array.isArray(post.media) && post.media.length > 0 && (
        <div className="mt-2 relative">
          <div className="overflow-hidden">
            <div
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`,
                transition: "transform 0.3s ease",
                display: "flex",
              }}
            >
              {post.media.map((mediaUrl, index) => (
                <div key={index} className="w-full flex-shrink-0 p-1">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${mediaUrl}`}
                    alt={`Media from post by ${
                      userDetails ? userDetails.username : "user"
                    }`}
                    width={500}
                    height={300}
                    priority={true}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Centered Navigation Buttons */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 p-2">
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
              }
              disabled={currentImageIndex === 0}
              className="bg-white rounded-full shadow p-1 opacity-75 hover:opacity-100"
            >
              &lt;
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  Math.min(prev + 1, post.media.length - 1)
                )
              }
              disabled={currentImageIndex === post.media.length - 1}
              className="bg-white rounded-full shadow p-1 opacity-75 hover:opacity-100"
            >
              &gt;
            </button>
          </div>

          {/* Dots for Pagination */}
          <div className="flex justify-center mt-2">
            {post.media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  currentImageIndex === index ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handleLikeClick(liked, post, setLiked)}
          className="flex items-center text-blue-500"
        >
          <Heart
            fill={liked ? "blue" : "none"}
            className="mr-1 text-blue-500"
          />
          Like {likeCount}
        </button>
        <button
          onClick={() => handleCommentClick(router, post.post_id)}
          className="flex items-center text-blue-500"
        >
          <MessageCircle className="mr-1" />
          Comment {commentCount}
        </button>
        <button
          onClick={() => handleBookmarkClick(post.post_id)}
          className="flex items-center text-blue-500"
        >
          <Bookmark className="mr-1" />
          Bookmark
        </button>
      </div>
    </div>
  );
};

export default Post;
