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
        <p className="text-center mt-10">Loading dashboard...</p>
      ) : !stats ? (
        <p>No stats found</p>
      ) : (
        <div className="p-8 space-y-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 text-white">
              <h2 className="text-sm uppercase">Total Logs</h2>
              <p className="text-3xl font-bold">{stats.totalLogs}</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-white">
              <h2 className="text-sm uppercase">Success Rate</h2>
              <p className="text-3xl font-bold">{stats.successRate}%</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-rose-400 to-red-600 text-white">
              <h2 className="text-sm uppercase">Errors</h2>
              <p className="text-3xl font-bold">{stats.errorLogs}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Last 7 Days Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}