import { useState, useRef } from "react";
import { useAuth } from "../Contexts/AuthContext.jsx";
import { updateProfile, uploadAvatar } from "../Services/authService.js";
import { SERVER_URL } from "../Services/axiosInstance.js";
import { toast } from "react-toastify";

export default function Profile() {
  const { currentUser, setCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", about: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const avatar = currentUser?.pfp && currentUser.pfp !== "defaultPfp.png" ? `${SERVER_URL}/${currentUser.pfp}` : "/defaultPfp.png";

  const inputClass =
    "w-full bg-gray-700/80 text-white border border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-500";

  const handleEdit = () => {
    setFormData({
      username: currentUser?.username ?? "",
      about: currentUser?.about ?? "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateProfile(formData);
      setCurrentUser({ ...updated, authenticated: true });
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const updated = await uploadAvatar(file);
      setCurrentUser({ ...updated, authenticated: true });
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-full bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-gray-800/80 border border-gray-700/50 p-8 shadow-xl">
          <div className="flex flex-col items-center gap-2">
            <img
              className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-600"
              src={avatar}
              alt="Profile"
            />
            {isEditing && (
              <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                Change photo
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
            {isUploading && <span className="text-xs text-gray-400">Uploading...</span>}
          </div>
          <div className="w-full space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1.5">
                Username
              </label>
              <input
                className={inputClass}
                type="text"
                id="username"
                value={isEditing ? formData.username : (currentUser?.username ?? "—")}
                onChange={(e) => isEditing && setFormData((p) => ({ ...p, username: e.target.value }))}
                readOnly={!isEditing}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
                Email
              </label>
              <input
                className={inputClass}
                type="text"
                id="email"
                value={currentUser?.email ?? "—"}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1.5">
                Phone
              </label>
              <input
                className={inputClass}
                type="text"
                id="phone"
                value={currentUser?.phone ?? "—"}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-400 mb-1.5">
                About
              </label>
              <input
                className={inputClass}
                type="text"
                id="about"
                value={isEditing ? formData.about : (currentUser?.about ?? "")}
                onChange={(e) => isEditing && setFormData((p) => ({ ...p, about: e.target.value }))}
                placeholder="Status"
                readOnly={!isEditing}
                disabled={!isEditing}
              />
            </div>
          </div>
          {isEditing ? (
            <div className="flex gap-3 w-full">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
