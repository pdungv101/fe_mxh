import PostList from "./PostList";
import { MapPin, Globe } from "lucide-react";

const UserProfileContent = ({ user, posts, setShowModal }) => {
  // Retrieve the current user's ID from local storage
  const localUserId = localStorage.getItem("userId"); // Ensure this matches your local storage key

  // Convert localUserId to a number for comparison
  const localUserIdNumber = Number(localUserId);

  return (
    <div className="flex max-w-7xl mx-auto p-4">
      <div className="w-1/3 p-4 rounded-lg bg-white">
        <div className="mb-4">
          <h2 className="font-bold text-lg">User Information</h2>
          <p className="flex flex-col items-center mb-4">
            <span className="text-center pb-4">
              {user.bio || "Not provided"}
            </span>
            <span className="border-b border-gray-300 w-full" />
          </p>

          {/* Conditionally render the Edit Bio button */}
          {user.user_id === localUserIdNumber && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">
              Edit Bio
            </button>
          )}

          <div className="mt-4 mb-4">
            <p className="flex items-center mb-2">
              <MapPin className="mr-2 w-5 h-5" />
              <span>{user.location || "Not provided"}</span>
            </p>
            <p className="flex items-center mb-2">
              <Globe className="mr-2 w-5 h-5" />
              <span>{user.website || "Not provided"}</span>
            </p>

            {/* Conditionally render the Edit Details button */}
            {user.user_id === localUserIdNumber && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">
                Edit Details
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-bold text-lg">Picture Gallery</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">
            Show All
          </button>
        </div>

        <div className="mb-8">
          <h2 className="font-bold text-lg">Life&apos;s Events</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">
            Show All
          </button>
        </div>

        {/* Conditionally render the Add Highlight Content button */}
        {user.user_id === localUserIdNumber && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
            Add Highlight Content
          </button>
        )}
      </div>

      <div className="w-2/3 p-4">
        <h2 className="font-bold text-lg">Posts</h2>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p>No posts available for this user.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfileContent;
