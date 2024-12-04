import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import UserProfileContent from "../../components/UserProfileContent"; // Adjust the path as needed
import ProfilePictureModal from "../../components/ProfilePictureModal"; // Adjust the path as needed
import CoverPictureModal from "../../components/CoverPictureModal"; // New import
import MenuList from "../../components/MenuList"; // New import
import {
  handleUploadProfilePicture,
  handleRemoveProfilePicture,
  handleUploadProfileCover,
  handleRemoveProfileCover,
  handleEditProfile,
} from "../../utils/userHandlers";
import useUserData from "../../hooks/useUserData";

// Utility function to capitalize the first letter of each word
const capitalizeName = (name) => {
  if (!name) return "Not provided";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;

  const [showModal, setShowModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const { user, setUser, posts, loading, error, setError } = useUserData(id);

  const [selectedMenu, setSelectedMenu] = useState("Posts");

  const handleUploadPhoto = (event) => {
    handleUploadProfilePicture(event, id, setUser, setError, setShowModal);
  };

  const removePhoto = () => {
    handleRemoveProfilePicture(id, setUser, setError, setShowModal);
  };

  const handleUploadCover = (event) => {
    handleUploadProfileCover(event, id, setUser, setError, setShowCoverModal);
  };

  const removeCover = () => {
    handleRemoveProfileCover(id, setUser, setError, setShowCoverModal);
  };

  const editProfile = () => {
    handleEditProfile(router, id);
  };

  const renderMainContent = () => {
    switch (selectedMenu) {
      case "Posts":
        return (
          <UserProfileContent
            user={user}
            posts={posts}
            setShowModal={setShowModal}
          />
        );
      case "Information":
        return <div>User Information Content</div>; // Replace with actual content
      case "Followers":
        return <div>Followers Content</div>; // Replace with actual content
      case "Images":
        return <div>Images Content</div>; // Replace with actual content
      case "Videos":
        return <div>Videos Content</div>; // Replace with actual content
      case "Voices":
        return <div>Voices Content</div>; // Replace with actual content
      case "Polls":
        return <div>Polls Content</div>; // Replace with actual content
      case "Check-in":
        return <div>Check-in Content</div>; // Replace with actual content
      case "More":
        return <div>More Content</div>; // Replace with actual content
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const coverImageUrl = user.cover_picture
    ? `${process.env.NEXT_PUBLIC_API_URL}/${user.cover_picture}`
    : "/default-cover.jpg";

  const profileImageUrl = user.profile_picture
    ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profile_picture}`
    : "/default-profile.jpg";

  // Check if the current user is the profile owner (convert localStorage userId to number)
  const isProfileOwner =
    user.user_id === Number(localStorage.getItem("userId"));

  return (
    <main className="rounded-lg bg-gray-100">
      {/* Header Section */}
      <header className="relative">
        <Image
          src={coverImageUrl}
          alt={user.username}
          width={4000}
          height={4000}
          className="object-cover w-full h-60"
        />

        {/* Add margin-top to move down the profile section */}
        <div className="absolute left-4 top-56 flex items-center">
          <Image
            src={profileImageUrl}
            alt={user.username}
            width={2560}
            height={2560}
            className="w-32 h-32 rounded-full object-cover border-4 border-white cursor-pointer"
            onClick={() => isProfileOwner && setShowModal(true)} // Show modal only for profile owner
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">
              {capitalizeName(user.full_name) || "N/A"}
            </h1>
            <p className="text-lg">@{user.username}</p>
            <div className="flex items-center mt-2">
              <span>{user.followers_count || 0} Followers</span>
            </div>
          </div>
        </div>

        {/* Add margin-top to the button container */}
        <div className="flex justify-end p-4 mt-4">
          {isProfileOwner && (
            <>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Add Story
              </button>
              <button
                onClick={editProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Add Cover Picture Button at the top left of the cover image */}
        {isProfileOwner && (
          <button
            onClick={() => setShowCoverModal(true)}
            className="absolute top-4 left-4 bg-gray-100 text-black px-4 py-2 rounded"
          >
            Add Cover Picture
          </button>
        )}
      </header>

      {/* Menu List */}
      <MenuList selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      {/* Main Content */}
      {renderMainContent()}
      {/* Modal for Uploading Profile Picture */}
      <ProfilePictureModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleUploadProfilePicture={handleUploadPhoto}
        handleRemoveProfilePicture={removePhoto}
      />
      {/* Modal for Uploading Cover Picture */}
      <CoverPictureModal
        showModal={showCoverModal}
        setShowModal={setShowCoverModal}
        handleUploadCover={handleUploadCover}
        handleRemoveCover={removeCover}
      />
    </main>
  );
};

export default UserProfile;
