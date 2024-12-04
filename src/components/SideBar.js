import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home,
  Bell,
  MessageCircle,
  Star,
  UserPlus,
  User,
  MoreHorizontal,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  LogOut, // Import the LogOut icon
} from "lucide-react";
import { useRouter } from "next/router"; // Import useRouter for navigation

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isClient, setIsClient] = useState(false); // Track if we're on the client
  const router = useRouter(); // Initialize useRouter

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsClient(true); // Set to true on the client
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login"); // Redirect to login page
  };

  return (
    <div
      className={`flex flex-col ${
        isOpen ? "w-64" : "w-16"
      } bg-white text-blue-500 h-screen transition-width duration-300 ml-4 mt-4`}
    >
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center p-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded focus:outline-none"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
      <nav className="flex-grow mt-4">
        <ul className="space-y-2">
          {[
            { href: "/", label: "Home", icon: <Home size={20} /> },
            {
              href: "/notifications",
              label: "Notifications",
              icon: <Bell size={20} />,
            },
            {
              href: "/messages",
              label: "Messages",
              icon: <MessageCircle size={20} />,
            },
            {
              href: "/favorites",
              label: "Favorites",
              icon: <Star size={20} />,
            },
            {
              href: "/subscriptions",
              label: "Subscriptions",
              icon: <UserPlus size={20} />,
            },
            {
              href: "/add-card",
              label: "Add Card",
              icon: <CreditCard size={20} />,
            },
            {
              href: `/users/${userId}`,
              label: "My Profile",
              icon: <User size={20} />,
              show: isClient && userId,
            },
            {
              href: "/more",
              label: "More",
              icon: <MoreHorizontal size={20} />,
            },
          ].map(
            ({ href, label, icon, show = true }) =>
              show && (
                <li
                  key={label}
                  className="flex items-center justify-center p-4 hover:bg-gray-300 rounded transition-all duration-200"
                >
                  <Link
                    href={href}
                    className={`flex items-center ${
                      isOpen ? "space-x-3" : "space-x-0"
                    }`}
                  >
                    {icon}
                    {isOpen && <span className="text-blue-500">{label}</span>}
                  </Link>
                </li>
              )
          )}
          <li
            className="flex items-center justify-center p-4 hover:bg-gray-300 rounded transition-all duration-200 cursor-pointer"
            onClick={handleLogout} // Add onClick handler for logout
          >
            <div
              className={`flex items-center ${
                isOpen ? "space-x-3" : "space-x-0"
              }`}
            >
              <LogOut size={20} />
              {isOpen && <span className="text-blue-500">Logout</span>}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
