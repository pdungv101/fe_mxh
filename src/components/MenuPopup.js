import React, { useRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick"; // Adjust the path as necessary

const MenuPopup = ({ toggleMenu, menuRef }) => {
  const popupRef = useRef();

  useOutsideClick(popupRef, toggleMenu);

  return (
    <div
      ref={popupRef}
      className="absolute bg-white text-black p-4 rounded shadow-md"
      style={{
        top: menuRef.current
          ? menuRef.current.getBoundingClientRect().bottom + window.scrollY
          : 0,
        left: menuRef.current
          ? menuRef.current.getBoundingClientRect().left
          : 0,
      }}
    >
      <p>Menu Item 1</p>
      <p>Menu Item 2</p>
      <button onClick={toggleMenu}>Close</button>
    </div>
  );
};

export default MenuPopup;
