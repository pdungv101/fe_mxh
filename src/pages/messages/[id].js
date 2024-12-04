import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { io } from "socket.io-client";
import Image from "next/image";

const MessagePage = () => {
  const router = useRouter();
  const { id } = router.query; // The ID of the receiver or chat partner
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null); // Ref for scrolling to the end

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);

    // Establish the socket connection
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      newSocket.emit("register_user", userId);
    });

    // Listen for incoming messages
    newSocket.on("receive_message", (data) => {
      if (data.receiver_id === userId || data.sender_id === userId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    // Cleanup on unmount
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (id && currentUserId) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/messages/messages/${currentUserId}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const fetchedMessages = response.data.data || [];
          const messagesWithSenderData = await Promise.all(
            fetchedMessages.map(async (message) => {
              const senderData = await fetchSenderData(message.sender_id);
              return {
                ...message,
                sender_profile_picture:
                  senderData.profile_picture || "/default-profile.jpg",
                sender_username: senderData.username || "Unknown",
              };
            })
          );
          setMessages(messagesWithSenderData);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages(); // Fetch messages when the component mounts and id changes
  }, [currentUserId, id]);

  const fetchSenderData = async (senderId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${senderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const profilePicture = response.data.profile_picture
        ? `${process.env.NEXT_PUBLIC_API_URL}/${response.data.profile_picture}`
        : "/default-profile.jpg"; // Use a default image path if none

      return {
        ...response.data,
        profile_picture: profilePicture,
      };
    } catch (error) {
      console.error("Error fetching sender data:", error);
      return { profile_picture: "/default-profile.jpg" }; // Return default on error
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") {
      console.error("Message cannot be empty.");
      return; // Don't allow empty messages to be sent
    }

    const messageData = {
      sender_id: currentUserId,
      receiver_id: id,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...messageData,
        sender_username: localStorage.getItem("username"),
        sender_profile_picture: localStorage.getItem("profile_picture"),
      },
    ]);
    setNewMessage(""); // Clear the input after sending
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent adding a new line
      sendMessage(); // Send the message
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.message_id}
              className={`mb-2 flex ${
                String(message.sender_id) === String(currentUserId)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {String(message.sender_id) !== String(currentUserId) && (
                <div className="relative w-10 h-10 mr-2 self-center">
                  <Image
                    src={
                      message.sender_profile_picture || "/default-profile.jpg"
                    }
                    alt={`${message.sender_username}'s profile`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                  String(message.sender_id) === String(currentUserId)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {/* Render message content with line breaks */}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <p className="text-gray-500 text-xs">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages available.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-2 p-4">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg p-2"
          rows={1}
          onKeyPress={handleKeyPress}
          style={{ overflow: "hidden" }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagePage;
