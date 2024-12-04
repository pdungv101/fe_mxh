import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Post from "../../components/Post";
import CreateComment from "../../components/CreateComment";
import CommentList from "../../components/CommentList";

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`
      );
      setPost(response.data);
    } catch (err) {
      setError("Failed to fetch post. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`
      );
      setComments(response.data);
    } catch (err) {
      setError("Failed to fetch comments. Please try again later.");
    } finally {
      setLoadingComments(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id, fetchPost, fetchComments]);

  const handleCommentCreated = () => {
    fetchComments();
  };

  const handleCommentUpdate = async (commentId, content) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handlePostUpdate = async (postId, updatedContent) => {
    console.log("Updating post:", { postId, updatedContent });
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPost();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handlePostDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      router.push("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return <p className="text-center">Loading post...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!post) {
    return <p className="text-center">No post found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100">
      <Post
        post={post}
        onUpdate={handlePostUpdate}
        onDelete={handlePostDelete}
      />
      <CreateComment postId={id} onCommentCreated={handleCommentCreated} />
      {loadingComments ? (
        <p>Loading comments...</p>
      ) : (
        <CommentList
          comments={comments}
          onUpdate={handleCommentUpdate}
          onDelete={handleCommentDelete}
        />
      )}
    </div>
  );
};

export default PostDetail;
