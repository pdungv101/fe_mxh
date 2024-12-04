import axios from "axios";

export const handleLikeClick = async (
  liked,
  setLiked,
  setLikeCount,
  commentId
) => {
  try {
    await axios({
      method: liked ? "delete" : "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/commentlikes`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        commentId: commentId,
      },
    });
    setLiked((prev) => !prev);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  } catch (error) {
    console.error("Error liking comment:", error);
  }
};

export const handleReplySubmitted = (setShowReplyInput, fetchReplies) => {
  setShowReplyInput(false); // Hide the reply input after submission
  fetchReplies(); // Refetch replies after a new reply is submitted
};
