"use client";

import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <RequireAuth>
      <div>
        <h2 className="text-2xl font-semibold mb-1">Settings</h2>
        <p className="text-gray-600 mb-6">Manage your account, plan and preferences.</p>

        <div className="bg-white border p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-800 font-medium">{user.name || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Plan</p>
            <p className="text-gray-800 font-medium">{user.plan || "Free"}</p>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}