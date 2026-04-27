import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/client";
export default function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // لو ما في توكن، وقف مباشرة
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await api.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);

      } catch (err) {
        console.log(err?.response?.data || err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Profile</h1>

      {loading && <p>Loading...</p>}

      {!loading && !user && (
        <p className="text-red-500">No user data found</p>
      )}

      {user && (
        <div className="mt-4">
          <p><b>Name:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          onLogout?.();
        }}
        className="mt-4 bg-red-600 text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}