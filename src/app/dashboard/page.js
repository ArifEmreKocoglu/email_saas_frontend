"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { fetchDashboardStats } from "@/lib/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await fetchDashboardStats(user.id);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <RequireAuth>
      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <div className="text-center">
            <div 
              className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
            <p style={{ color: 'var(--foreground)' }}>Loading dashboard...</p>
          </div>
        </div>
      ) : !stats ? (
        <p style={{ color: 'var(--foreground)' }}>No stats found</p>
      ) : (
        <div className="p-8 space-y-8">
          <h1 
            className="text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <h2 
                className="text-xs uppercase tracking-wider font-semibold mb-2 opacity-80"
                style={{ color: 'var(--background)' }}
              >
                Total Logs
              </h2>
              <p 
                className="text-4xl font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                {stats.totalLogs}
              </p>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <h2 
                className="text-xs uppercase tracking-wider font-semibold mb-2 opacity-80"
                style={{ color: 'var(--background)' }}
              >
                Success Rate
              </h2>
              <p 
                className="text-4xl font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                {stats.successRate}%
              </p>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <h2 
                className="text-xs uppercase tracking-wider font-semibold mb-2 opacity-80"
                style={{ color: 'var(--background)' }}
              >
                Errors
              </h2>
              <p 
                className="text-4xl font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                {stats.errorLogs}
              </p>
            </div>
          </div>

          <div 
            className="rounded-xl p-6 shadow-lg"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--background)' }}
            >
              Last 7 Days Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--accent)" opacity={0.3} />
                <XAxis 
                  dataKey="_id" 
                  stroke="var(--background)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--background)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--background)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--accent)', r: 4 }}
                  activeDot={{ r: 6, fill: 'var(--accent)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}