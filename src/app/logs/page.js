"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { fetchLogs } from "@/lib/api";

export default function LogsPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, limit: 50, hasMore: false });
  const [loading, setLoading] = useState(true);

  const load = async (page = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchLogs(user.id, page, data.limit);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) load(1); }, [user]);

  return (
    <RequireAuth>
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-semibold">Logs</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.items.length === 0 ? (
          <p>No logs yet</p>
        ) : (
          <div className="space-y-3">
            {data.items.map((log) => (
              <div key={log._id} className="p-4 rounded-lg border flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{log.subject || "(no subject)"}</div>
                  <div className="text-sm text-gray-600">
                    {log.email} • {log.workflowName} • {log.duration || "-"}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    log.status === "success"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            disabled={data.page <= 1 || loading}
            onClick={() => load(data.page - 1)}
          >
            Prev
          </button>
          <span className="text-sm">Page {data.page}</span>
          <button
            className="px-3 py-2 rounded border disabled:opacity-50"
            disabled={!data.hasMore || loading}
            onClick={() => load(data.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </RequireAuth>
  );
}