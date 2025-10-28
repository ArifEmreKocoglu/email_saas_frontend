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
        <h1 
          className="text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Logs
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div 
                className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <p style={{ color: 'var(--foreground)' }}>Loading logs...</p>
            </div>
          </div>
        ) : data.items.length === 0 ? (
          <div 
            className="text-center py-12 rounded-xl"
            style={{ 
              backgroundColor: 'rgba(220, 207, 192, 0.2)',
              color: 'var(--foreground)'
            }}
          >
            <p className="text-lg">No logs yet</p>
            <p className="text-sm opacity-70 mt-2">Logs will appear here once emails are processed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map((log) => (
              <div 
                key={log._id} 
                className="p-5 rounded-xl shadow-lg transition-all duration-300 hover:scale-102 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--accent)',
                  border: '1px solid rgba(220, 207, 192, 0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div 
                      className="font-semibold text-lg"
                      style={{ color: 'var(--background)' }}
                    >
                      {log.subject || "(no subject)"}
                    </div>
                    <div 
                      className="text-sm opacity-80"
                      style={{ color: 'var(--background)' }}
                    >
                      {log.email} • {log.workflowName} • {log.duration || "-"}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm`}
                    style={{
                      backgroundColor: log.status === "success" ? 'var(--accent)' : '#d1d5db',
                      color: log.status === "success" ? 'var(--foreground)' : '#6b7280'
                    }}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--background)',
              border: '1px solid rgba(220, 207, 192, 0.3)'
            }}
            disabled={data.page <= 1 || loading}
            onClick={() => load(data.page - 1)}
          >
            Prev
          </button>
          <span 
            className="text-sm font-medium px-4"
            style={{ color: 'var(--foreground)' }}
          >
            Page {data.page}
          </span>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--background)',
              border: '1px solid rgba(220, 207, 192, 0.3)'
            }}
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