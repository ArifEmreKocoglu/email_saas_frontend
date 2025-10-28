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
              style={{ borderColor: '#B3C8CF', borderTopColor: 'transparent' }}
            />
            <p style={{ color: '#F1F0E8' }}>Loading dashboard...</p>
          </div>
        </div>
      ) : !stats ? (
        <p style={{ color: '#F1F0E8' }}>No stats found</p>
      ) : (
        <div className="p-8 space-y-8">
          <h1 
            className="text-3xl font-semibold tracking-tight"
            style={{ color: '#F1F0E8' }}
          >
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: '#B3C8CF' }}
            >
              <h2 
                className="text-xs uppercase tracking-wider font-semibold mb-2 opacity-80"
                style={{ color: '#89A8B2' }}
              >
                Total Logs
              </h2>
              <p 
                className="text-4xl font-bold"
                style={{ color: '#F1F0E8' }}
              >
                {stats.totalLogs}
              </p>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: '#E5E1DA' }}
            >
              <h2 
                className="text-xs uppercase tracking-wider font-semibold mb-2 opacity-80"
                style={{ color: '#89A8B2' }}
              >
                Success Rate
              </h2>
              <p 
                className="text-4xl font-bold"
                style={{ color: '#89A8B2' }}
              >
                {stats.successRate}%
              </p>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: '#B3C8CF' }}
            >
              <h2 
                className="text-xs uppercase tracking-wider font-semibold mb-2 opacity-80"
                style={{ color: '#89A8B2' }}
              >
                Errors
              </h2>
              <p 
                className="text-4xl font-bold"
                style={{ color: '#F1F0E8' }}
              >
                {stats.errorLogs}
              </p>
            </div>
          </div>

          <div 
            className="rounded-xl p-6 shadow-lg"
            style={{ backgroundColor: '#E5E1DA' }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: '#89A8B2' }}
            >
              Last 7 Days Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B3C8CF" opacity={0.3} />
                <XAxis 
                  dataKey="_id" 
                  stroke="#89A8B2"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#89A8B2"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#89A8B2',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F1F0E8'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#89A8B2" 
                  strokeWidth={3}
                  dot={{ fill: '#B3C8CF', r: 4 }}
                  activeDot={{ r: 6, fill: '#E5E1DA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}