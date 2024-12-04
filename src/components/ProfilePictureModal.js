import React from "react";

const ProfilePictureModal = ({
  showModal,
  setShowModal,
  handleUploadProfilePicture,
  handleRemoveProfilePicture,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
        <h3 className="text-lg font-semibold mb-4">Upload Profile Picture</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadProfilePicture}
          className="mb-4"
        />
        <div className="flex justify-between">
          <div className="flex flex-col">
            <button
              onClick={handleRemoveProfilePicture}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove Profile Picture
            </button>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
