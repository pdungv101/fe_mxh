// components/MenuList.js
import React from "react";

const MenuList = ({ selectedMenu, setSelectedMenu }) => {
  const menuItems = [
    "Posts",
    "Information",
    "Followers",
    "Images",
    "Videos",
    "Voices",
    "Polls",
    "Check-in",
    "More",
  ];

  return (
    <nav className="bg-gray-200 p-2 mt-12">
      {" "}
      {/* Added mt-4 for margin top */}
      <ul className="flex space-x-6 text-lg">
        {menuItems.map((menuItem) => (
          <li
            key={menuItem}
            className={`cursor-pointer relative`}
            onClick={() => setSelectedMenu(menuItem)}
          >
            <span
              className={`${
                selectedMenu === menuItem
                  ? "text-blue-500 font-bold"
                  : "text-black"
              }`}
            >
              {menuItem}
            </span>
            {selectedMenu === menuItem && (
              <div className="absolute left-0 right-0 bottom-[-4px] h-[2px] bg-blue-500" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuList;
