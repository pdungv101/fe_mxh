import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const EditProfile = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    full_name: "",
    bio: "",
    location: "",
    website: "",
    date_of_birth: "",
  });

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setUser(response.data);
          setFormValues({
            username: response.data.username,
            email: response.data.email,
            full_name: response.data.full_name,
            bio: response.data.bio,
            location: response.data.location,
            website: response.data.website,
            date_of_birth: response.data.date_of_birth
              ? response.data.date_of_birth.split("T")[0]
              : "",
          });
        } catch (err) {
          setError(err.response?.data?.error || "Failed to load user data.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/userprofiles/${id}`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      router.push(`/users/${id}`); // Redirect to user profile after save
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">
            Username
            <input
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            Email
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            Full Name
            <input
              type="text"
              name="full_name"
              value={formValues.full_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            Date of Birth
            <input
              type="date"
              name="date_of_birth"
              value={formValues.date_of_birth}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            Bio
            <textarea
              name="bio"
              value={formValues.bio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            Location
            <input
              type="text"
              name="location"
              value={formValues.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            Website
            <input
              type="url"
              name="website"
              value={formValues.website}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
