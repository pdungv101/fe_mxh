// utils/postHandlers.js

import axios from "axios";

export const handleLikeClick = async (liked, post, setLiked) => {
  try {
    const response = await axios({
      method: liked ? "delete" : "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/postlikes`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        postId: post.post_id,
      },
    });

    if (response.status === 200) {
      setLiked((prev) => !prev);
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

export const handleCommentClick = (router, postId) => {
  router.push(`/post/${postId}`);
};

export const handleBookmarkClick = (postId) => {
  console.log("Bookmarked post:", postId);
};

export const handleFollowClick = async (isFollowing, post, setIsFollowing) => {
  try {
    const response = await axios({
      method: isFollowing ? "delete" : "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/follows`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        followedId: post.user_id,
      },
    });

    if (response.status === 200) {
      setIsFollowing((prev) => !prev);
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
  }
};
