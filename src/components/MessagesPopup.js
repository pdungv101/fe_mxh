import React, { useRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick"; // Adjust the path as necessary

const MessagesPopup = ({ toggleMessages, messagesRef }) => {
  const popupRef = useRef();

  useOutsideClick(popupRef, toggleMessages);

  return (
    <div
      ref={popupRef}
      className="absolute bg-white text-black p-4 rounded shadow-md"
      style={{
        top: messagesRef.current
          ? messagesRef.current.getBoundingClientRect().bottom + window.scrollY
          : 0,
        left: messagesRef.current
          ? messagesRef.current.getBoundingClientRect().left
          : 0,
      }}
    >
      <p>No new messages</p>
      <button onClick={toggleMessages}>Close</button>
    </div>
  );
};

export default MessagesPopup;
