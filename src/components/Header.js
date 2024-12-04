import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  Menu,
  MessageSquare,
  Home,
  Users,
  Calendar,
  Video,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import MenuPopup from "./MenuPopup"; // Adjust the path as necessary
import MessagesPopup from "./MessagesPopup"; // Adjust the path as necessary
import ProfilePopup from "./ProfilePopup"; // Adjust the path as necessary
import useUserData from "../hooks/useUserData"; // Adjust the path as necessary

const Header = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef(null);
  const messagesRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    setUserId(storedUserId);
    setUsername(storedUsername);
  }, []);

  // Use the custom hook to fetch user profile
  const { user, posts, loading, error } = useUserData(userId);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleMessages = () => setMessagesOpen((prev) => !prev);
  const toggleProfile = () => setProfileOpen((prev) => !prev);

  // Determine the image source
  const profileImageUrl = useMemo(() => {
    return user?.profile_picture
      ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profile_picture}`
      : "/default-profile.jpg";
  }, [user]);

  if (loading) return <div>Loading...</div>; // Handle loading state
  if (error) return <div>Error: {error}</div>; // Handle error state

  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-lg font-bold">
            <Link href="/" className="hover:text-blue-300">
              PhePha
            </Link>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="ml-4 p-2 rounded"
          />
        </div>

        <nav className="flex-grow text-center">
          <ul className="flex justify-center space-x-10">
            <li>
              <Link href="/" className="flex items-center hover:text-blue-300">
                <Home size={24} className="mr-1" />
              </Link>
            </li>
            <li>
              <Link
                href="/groups"
                className="flex items-center hover:text-blue-300"
              >
                <Users size={24} className="mr-1" />
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="flex items-center hover:text-blue-300"
              >
                <Calendar size={24} className="mr-1" />
              </Link>
            </li>
            <li>
              <Link
                href="/videos"
                className="flex items-center hover:text-blue-300"
              >
                <Video size={24} className="mr-1" />
              </Link>
            </li>
            <li>
              <Link
                href="/markets"
                className="flex items-center hover:text-blue-300"
              >
                <ShoppingCart size={24} className="mr-1" />
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="flex items-center hover:text-blue-300"
            ref={menuRef}
            aria-expanded={menuOpen}
            aria-controls="menu-popup"
          >
            <Menu size={24} className="mr-1" />
          </button>
          <button
            onClick={toggleMessages}
            className="flex items-center hover:text-blue-300"
            ref={messagesRef}
            aria-expanded={messagesOpen}
            aria-controls="messages-popup"
          >
            <MessageSquare size={24} className="mr-1" />
          </button>
          <button
            onClick={toggleProfile}
            className="flex items-center hover:text-blue-300"
            ref={profileRef}
            aria-expanded={profileOpen}
            aria-controls="profile-popup"
          >
            <Image
              src={profileImageUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              width={200}
              height={200}
            />
          </button>
        </div>
      </div>

      {menuOpen && <MenuPopup toggleMenu={toggleMenu} menuRef={menuRef} />}
      {messagesOpen && (
        <MessagesPopup
          toggleMessages={toggleMessages}
          messagesRef={messagesRef}
        />
      )}
      {profileOpen && (
        <ProfilePopup
          username={username}
          handleLogout={handleLogout}
          toggleProfile={toggleProfile}
          profileRef={profileRef}
        />
      )}
    </header>
  );
};

export default Header;
