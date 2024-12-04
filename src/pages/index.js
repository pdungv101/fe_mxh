import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // Import useRouter for navigation
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`
      );
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for token and redirect if it's not available
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login page
      return; // Stop further execution
    }

    fetchPosts();
  }, [router]);

  const handleCreatePost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostUpdate = async (postId, content) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPosts();
    } catch (error) {
      console.log("Error updating post:", error);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPosts();
    } catch (error) {
      console.log("Error deleting post:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <CreatePost onCreatePost={handleCreatePost} />
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : posts.length > 0 ? (
        <PostList
          posts={posts}
          onUpdate={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default HomePage;
