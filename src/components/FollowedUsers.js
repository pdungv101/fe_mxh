import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";

const FollowedUsers = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setCurrentUserId(id);
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      if (currentUserId) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/follows/${currentUserId}/followed`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setFollowedUsers(response.data.followedUsers || []);
          console.log("Followed Users:", response.data.followedUsers); // Log followed users for debugging
        } catch (error) {
          console.error(
            "Error fetching followed users:",
            error.response ? error.response.data : error.message
          );
        }
      }
    };

    fetchFollowedUsers();
  }, [currentUserId]);

  const toggleUsersList = () => {
    setIsOpen((prev) => !prev);
  };

  const handleUserClick = (userId) => {
    console.log("User ID clicked:", userId);
    router.push(`/messages/${userId}`);
  };

  return (
    <div
      className={`flex flex-col bg-white text-blue-500 h-screen transition-width duration-300 p-4 shadow-md ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <button
        onClick={toggleUsersList}
        className="flex items-center justify-center mb-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded p-2 focus:outline-none"
      >
        {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>
      {isOpen && (
        <div>
          <h2 className="font-bold text-lg mb-2">Followed Users</h2>
          <ul>
            {followedUsers.length > 0 ? (
              followedUsers.map((user) => {
                const profilePicture = user.profile_picture
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profile_picture}`
                  : "/default-profile.jpg";

                return (
                  <li
                    key={`${user.id}-${user.username}`}
                    className="flex items-center mb-2 p-2 border rounded cursor-pointer hover:bg-gray-300"
                    onClick={() => handleUserClick(user.user_id)}
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src={profilePicture}
                        alt={`${user.username}'s profile`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <span className="text-blue-500 ml-3">{user.username}</span>{" "}
                    {/* Adjusted margin for spacing */}
                  </li>
                );
              })
            ) : (
              <li className="text-gray-500">No followed users</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FollowedUsers;
