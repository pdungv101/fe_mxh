// useUserData.js
import { useEffect, useState } from "react";
import axios from "axios";

const useUserData = (id) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const source = axios.CancelToken.source(); // Create a cancel token

    const fetchUserData = async () => {
      try {
        const [userResponse, postsResponse, profileResponse] =
          await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              cancelToken: source.token,
            }),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/user/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              cancelToken: source.token,
            }),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userprofiles/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              cancelToken: source.token,
            }),
          ]);

        // Merge user data and profile data
        setUser({
          ...userResponse.data,
          ...profileResponse.data, // Assuming this contains `full_name` and `bio`
        });
        setPosts(postsResponse.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          setError(err.response?.data?.error || "Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      source.cancel("Operation canceled by the user."); // Cancel the request if unmounted
    };
  }, [id]);

  return {
    user,
    setUser,
    posts,
    loading,
    error,
    setError,
  };
};

export default useUserData;
