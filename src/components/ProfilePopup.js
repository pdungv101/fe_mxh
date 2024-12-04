import React, { useRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick"; // Adjust the path as necessary

const ProfilePopup = ({
  username,
  handleLogout,
  toggleProfile,
  profileRef,
}) => {
  const popupRef = useRef();

  useOutsideClick(popupRef, toggleProfile);

  return (
    <div
      ref={popupRef}
      className="absolute bg-white text-black p-4 rounded shadow-md"
      style={{
        top: profileRef.current
          ? profileRef.current.getBoundingClientRect().bottom + window.scrollY
          : 0,
        left: profileRef.current
          ? profileRef.current.getBoundingClientRect().left
          : 0,
      }}
    >
      <p>Welcome, {username}!</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={toggleProfile}>Close</button>
    </div>
  );
};

export default ProfilePopup;
