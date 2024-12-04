// hooks/usePostData.js

import { useState, useEffect } from "react";
import axios from "axios";

const usePostData = (post) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${post.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchCounts = async () => {
      try {
        const likeResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/postlikes/${post.post_id}`
        );
        setLikeCount(likeResponse.data.likeCount || 0);

        const commentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/count/${post.post_id}`
        );
        setCommentCount(commentResponse.data.count || 0);

        const followResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/follows/${post.user_id}/isFollowed`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFollowing(followResponse.data.isFollowed);

        const likedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/postlikes/${post.post_id}/isLiked`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLiked(likedResponse.data.isLiked);
      } catch (error) {
        console.error("Error fetching counts or follow status:", error);
      }
    };

    fetchUserDetails();
    fetchCounts();
  }, [post]);

  return {
    liked,
    likeCount,
    commentCount,
    isFollowing,
    userDetails,
    setLiked,
    setIsFollowing,
  };
};

export default usePostData;
