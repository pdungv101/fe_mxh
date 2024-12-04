import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Username:", username, "Password:", password);
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          username,
          password,
        }
      );

      console.log("Login Response:", response.data);

      if (response.data.token && response.data.user?.user_id) {
        // Store user information in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.user_id);
        localStorage.setItem("username", response.data.user.username);
        // Store the user's profile picture
        localStorage.setItem(
          "profilePicture",
          response.data.user.profile_picture || ""
        ); // Adjust if your backend returns a different field

        router.push("/");
      } else {
        alert("Login failed: Invalid response structure.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Có lỗi xảy ra";
      alert("Đăng nhập không thành công: " + errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Đăng Nhập</h1>
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md">
        <input
          type="text"
          placeholder="Tên Người Dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Mật Khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600"
        >
          Đăng Nhập
        </button>
      </form>

      <div className="mt-4">
        <span className="text-gray-600">Bạn chưa có tài khoản? </span>
        <Link href="/register" className="text-blue-500 hover:underline">
          Đăng Ký
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
