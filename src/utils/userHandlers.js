import axios from "axios";

export const handleUploadProfilePicture = async (
  event,
  id,
  setUser,
  setError,
  setShowModal
) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profile_picture", file);

  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/userpictures/${id}/upload-profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data);
  } catch (err) {
    console.error("Uploads error:", err);
    setError(err.response?.data?.error || "Failed to upload photo.");
  } finally {
    setShowModal(false);
  }
};

export const handleRemoveProfilePicture = async (
  id,
  setUser,
  setError,
  setShowModal
) => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/userpictures/${id}/remove-profile-picture`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data);
  } catch (err) {
    setError(err.response?.data?.error || "Failed to remove photo.");
  } finally {
    setShowModal(false);
  }
};

export const handleUploadProfileCover = async (
  event,
  id,
  setUser,
  setError,
  setShowModal
) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("cover_picture", file);

  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/usercovers/${id}/upload-cover-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Fetch updated user data after upload
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Log the updated user object
    console.log("User after upload:", response.data);
    // Update user state
    setUser(response.data); // This should contain the updated cover_picture
  } catch (err) {
    setError(err.response?.data?.error || "Failed to upload cover picture.");
  } finally {
    setShowModal(false);
  }
};

export const handleRemoveProfileCover = async (
  id,
  setUser,
  setError,
  setShowModal
) => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/usercovers/${id}/remove-cover-picture`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data);
  } catch (err) {
    setError(err.response?.data?.error || "Failed to remove cover picture.");
  } finally {
    setShowModal(false);
  }
};

export const handleEditProfile = (router, id) => {
  router.push(`/edit-profile/${id}`);
};
