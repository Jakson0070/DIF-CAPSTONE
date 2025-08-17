// import { useState } from "react";
// import { useAuthUser } from "@/hooks/useAuthUser";

// export default function ProfileEditForm({ onSuccess }: { onSuccess?: () => void }) {
//   const user = useAuthUser();
//   const [form, setForm] = useState({
//     displayName: user?.displayName || "",
//     bio: user?.bio || "",
//     website: user?.website || "",
//     isVerified: user?.isVerified || false,
//     isPrivate: user?.isPrivate || false,
//     profileImage: user?.profileImage || "",
//     profileImageFile: null as File | null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
//     const { name, value, type } = e.target;
//     // Only access 'checked' if the target is an input element
//     if (type === "checkbox" && 'checked' in e.target) {
//       setForm((prev) => ({
//         ...prev,
//         [name]: (e.target as HTMLInputElement).checked,
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   }

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     if (e.target.files && e.target.files[0]) {
//       setForm((prev) => ({ ...prev, profileImageFile: e.target.files![0] }));
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess(false);
//     const token = localStorage.getItem("token");
//     const apiUrl = import.meta.env.VITE_API_URL;
//     const formData = new FormData();
//     formData.append("displayName", form.displayName);
//     formData.append("bio", form.bio);
//     formData.append("website", form.website);
//     formData.append("isVerified", String(form.isVerified));
//     formData.append("isPrivate", String(form.isPrivate));
//     if (form.profileImageFile) {
//       formData.append("profilePicture", form.profileImageFile);
//     }
//     try {
//       const res = await fetch(`${apiUrl}/api/auth/profile`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });
//       if (!res.ok) throw new Error("Failed to update profile");
//       setSuccess(true);
//       if (onSuccess) onSuccess();
//     } catch (err: any) {
//       setError(err.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex justify-center items-center min-h-[80vh] bg-background">
//       <form
//         className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 border border-zinc-200 dark:border-zinc-800"
//         onSubmit={handleSubmit}
//       >
//         <div className="flex flex-col items-center mb-4">
//           <div className="relative group">
//             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-md bg-zinc-100 flex items-center justify-center">
//               {form.profileImageFile ? (
//                 <img
//                   src={URL.createObjectURL(form.profileImageFile)}
//                   alt="Preview"
//                   className="object-cover w-full h-full"
//                 />
//               ) : form.profileImage ? (
//                 <img
//                   src={form.profileImage}
//                   alt="Profile"
//                   className="object-cover w-full h-full"
//                 />
//               ) : (
//                 <span className="text-3xl text-zinc-400">?</span>
//               )}
//             </div>
//             <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-primary/90 transition-all border-2 border-white dark:border-zinc-900">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l-1.5-1.5" />
//               </svg>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </label>
//           </div>
//           <span className="text-xs text-zinc-500 mt-2">Tap to change profile picture</span>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block font-medium mb-1">Display Name</label>
//             <input
//               name="displayName"
//               value={form.displayName}
//               onChange={handleChange}
//               className="input input-bordered border w-full rounded-lg focus:ring-2 focus:ring-primary"
//               placeholder="Your name"
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1">Website</label>
//             <input
//               name="website"
//               value={form.website}
//               onChange={handleChange}
//               className="input input-bordered border w-full rounded-lg focus:ring-2 focus:ring-primary"
//               placeholder="yourwebsite.com"
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Bio</label>
//           <textarea
//             name="bio"
//             value={form.bio}
//             onChange={handleChange}
//             className="textarea textarea-bordered border w-full rounded-lg focus:ring-2 focus:ring-primary min-h-[80px]"
//             placeholder="Tell us about yourself..."
//           />
//         </div>
//         <div className="flex gap-6 items-center justify-center">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               name="isVerified"
//               checked={form.isVerified}
//               onChange={handleChange}
//               className="checkbox checkbox-primary"
//             />
//             <span className="text-sm">Verified</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               name="isPrivate"
//               checked={form.isPrivate}
//               onChange={handleChange}
//               className="checkbox checkbox-primary"
//             />
//             <span className="text-sm">Private</span>
//           </label>
//         </div>
//         {error && <div className="text-red-500 text-center font-medium">{error}</div>}
//         {success && <div className="text-green-500 text-center font-medium">Profile updated!</div>}
//         <button
//           type="submit"
//           className="btn btn-primary w-full rounded-lg text-base font-semibold py-3 shadow-md hover:scale-[1.01] transition-transform"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function ProfileEditForm({ onSuccess }: { onSuccess?: () => void }) {
  const user = useAuthUser();
  const [form, setForm] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    website: user?.website || "",
    isVerified: user?.isVerified || false,
    isPrivate: user?.isPrivate || false,
    profileImage: user?.profileImage || "",
    profileImageFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox" && "checked" in e.target) {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, profileImageFile: e.target.files![0] }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;
    const formData = new FormData();
    formData.append("displayName", form.displayName);
    formData.append("bio", form.bio);
    formData.append("website", form.website);
    formData.append("isVerified", String(form.isVerified));
    formData.append("isPrivate", String(form.isPrivate));
    if (form.profileImageFile) {
      formData.append("profilePicture", form.profileImageFile);
    }
    try {
      const res = await fetch(`${apiUrl}/api/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-zinc-950 transition-colors duration-300">
      <form
        className="bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 w-full max-w-md sm:max-w-lg mx-4 sm:mx-0 space-y-6 border border-gray-200 dark:border-zinc-800"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 dark:border-indigo-400 shadow-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center transition-transform group-hover:scale-105">
              {form.profileImageFile ? (
                <img
                  src={URL.createObjectURL(form.profileImageFile)}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-4xl text-gray-400 dark:text-zinc-500">?</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-2.5 cursor-pointer shadow-md hover:bg-indigo-600 transition-colors border-2 border-white dark:border-zinc-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l-1.5-1.5" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <span className="text-sm text-gray-500 dark:text-zinc-400 mt-3 font-medium">
            Change profile picture
          </span>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-1.5">
              Display Name
            </label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-200"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-1.5">
              Website
            </label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-200"
              placeholder="yourwebsite.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-1.5">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 min-h-[100px] resize-y transition-all duration-200"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
        <div className="flex gap-6 items-center justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isVerified"
              checked={form.isVerified}
              onChange={handleChange}
              className="w-5 h-5 text-indigo-500 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-zinc-700 rounded-md bg-gray-50 dark:bg-zinc-800"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-200">
              Verified
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPrivate"
              checked={form.isPrivate}
              onChange={handleChange}
              className="w-5 h-5 text-indigo-500 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-zinc-700 rounded-md bg-gray-50 dark:bg-zinc-800"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-200">
              Private
            </span>
          </label>
        </div>
        {error && (
          <div className="text-red-500 dark:text-red-400 text-center text-sm font-medium animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 dark:text-green-400 text-center text-sm font-medium animate-pulse">
            Profile updated!
          </div>
        )}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-500 dark:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}