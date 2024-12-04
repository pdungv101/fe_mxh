import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useComment = (comment) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replies, setReplies] = useState([]);
  const [profilePicture, setProfilePicture] = useState(""); // State for profile picture

  const defaultProfilePicture = "/default-profile.jpg"; // Ensure this path is correct

  // Fetch replies from the server
  const fetchReplies = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/replies/${comment.comment_id}`
      );
      setReplies(response.data || []); // Set replies directly from the API response
      console.log("Fetched replies:", response.data);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  }, [comment.comment_id]);

  // Effect to fetch likes, check if liked, and fetch user profile picture
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/commentlikes/${comment.comment_id}`
        );
        setLikeCount(response.data.likeCount || 0);
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };

    const checkIfLiked = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/commentlikes/${comment.comment_id}/isLiked`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLiked(response.data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    const fetchUserProfilePicture = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${comment.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const picture = response.data.profile_picture
          ? `${process.env.NEXT_PUBLIC_API_URL}/${response.data.profile_picture}`
          : defaultProfilePicture;

        setProfilePicture(picture);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfilePicture(defaultProfilePicture);
      }
    };

    fetchLikeCount();
    checkIfLiked();
    fetchReplies();
    fetchUserProfilePicture();
  }, [comment.comment_id, fetchReplies, comment.user_id]);

  return { liked, setLiked, likeCount, replies, setReplies, profilePicture };
};

export default useComment;
