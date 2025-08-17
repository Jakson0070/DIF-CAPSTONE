import { useEffect, useState } from 'react';

export function useAuthUser() {
  const [user, setUser] = useState<{
    _id?: string;
    username: string;
    displayName?: string;
    email: string;
    bio?: string;
    website?: string;
    isVerified?: boolean;
    isPrivate?: boolean;
    profileImage?: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && data.username) setUser({
          _id: data._id,
          username: data.username,
          displayName: data.displayName,
          email: data.email,
          bio: data.bio,
          website: data.website,
          isVerified: data.isVerified,
          isPrivate: data.isPrivate,
          profileImage: data.profilePicture,
        });
      });
  }, []);

  return user;
}
