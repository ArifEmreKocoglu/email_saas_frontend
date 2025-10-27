"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
      <h1 className="text-lg font-semibold text-gray-800">Entrfy Dashboard</h1>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">
              Hello, <b>{user.name || user.email}</b> 👋
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-black border border-gray-300 rounded-md px-3 py-1"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-500">Not signed in</span>
        )}
      </div>
    </header>
  );
}