import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        username,
        email,
        password,
      });
      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      router.push("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Có lỗi xảy ra";
      console.error("Error registering:", errorMessage);
      alert("Đăng ký không thành công: " + errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Đăng Ký</h1>
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md"
      >
        <input
          type="text"
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2 mb-4 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <input
          type="password"
          placeholder="Xác Nhận Mật Khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600"
        >
          Đăng Ký
        </button>
      </form>

      <div className="mt-4">
        <span className="text-gray-600">Đã có tài khoản? </span>
        <Link href="/login" className="text-blue-500 hover:underline">
          Đăng Nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
