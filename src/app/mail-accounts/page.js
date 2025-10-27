"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { fetchMailAccounts } from "@/lib/api";

export default function MailAccountsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchMailAccounts(user.id);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  if (!user) return null;

  const connectUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?userId=${user.id}`;

  return (
    <RequireAuth>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Mail Accounts</h1>
          <div className="flex items-center gap-3">
            <a href={connectUrl} className="inline-block px-4 py-2 rounded-lg bg-black text-white hover:opacity-90">
              Connect Gmail
            </a>
            <button
              onClick={load}
              className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {!data || loading ? (
          <p>Loading...</p>
        ) : data.items.length === 0 ? (
          <p>No accounts</p>
        ) : (
          <div className="space-y-3">
            {data.items.map((acc) => (
              <div key={acc.email} className="p-4 rounded-lg border flex items-center justify-between">
                <div>
                  <div className="font-medium">{acc.email}</div>
                  <div className="text-sm text-gray-500">
                    {acc.provider} • connected {new Date(acc.connectedAt).toLocaleString()}
                  </div>
                  {acc.watchExpiration && (
                    <div className="text-xs text-gray-500 mt-1">
                      Watch expires: {new Date(acc.watchExpiration).toLocaleString()}
                    </div>
                  )}
                  {acc.lastHistoryId && (
                    <div className="text-xs text-gray-400">
                      lastHistoryId: {String(acc.lastHistoryId).slice(0, 12)}…
                    </div>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    acc.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {acc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}