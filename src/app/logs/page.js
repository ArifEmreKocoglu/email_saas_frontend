"use client";

import { useEffect, useState, useMemo } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { fetchLogs } from "@/lib/api";

const DATE_RANGES = [
  { id: "24h", label: "Last 24h" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
  { id: "custom", label: "Custom range" },
];

export default function LogsPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ items: [], page: 1, limit: 50, hasMore: false });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [awaitingFilter, setAwaitingFilter] = useState("all"); // "all" | "yes" | "no"

  // Date filters
  const [dateRange, setDateRange] = useState("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchLogs(page, data.limit);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  useEffect(() => {
    if (user) load(1);
  }, [user]);

  const getLogDate = (log) => {
    const raw = log.timestamp || log.createdAt || log.updatedAt;
    if (!raw) return null;
    const dt = new Date(raw);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const formatDate = (log) => {
    const dt = getLogDate(log);
    if (!dt) return "-";
    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isInDateRange = (log) => {
    const dt = getLogDate(log);
    if (!dt) return true;

    const ts = dt.getTime();
    const now = Date.now();

    if (dateRange === "24h") return ts >= now - 24 * 60 * 60 * 1000;
    if (dateRange === "7d") return ts >= now - 7 * 24 * 60 * 60 * 1000;
    if (dateRange === "30d") return ts >= now - 30 * 24 * 60 * 60 * 1000;
    if (dateRange === "all") return true;

    if (dateRange === "custom") {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart).getTime();
      const end = new Date(customEnd).getTime();
      return ts >= start && ts <= end;
    }

    return true;
  };

  // Tags dynamic list
  const availableTags = useMemo(() => {
    const set = new Set();
    data.items.forEach((i) => {
      if (i.tag) set.add(i.tag);
    });
    return Array.from(set);
  }, [data.items]);

  const filteredItems = useMemo(() => {
    return data.items.filter((log) => {
      const text = search.toLowerCase();

      const matchText =
        !text ||
        log.email?.toLowerCase().includes(text) ||
        log.subject?.toLowerCase().includes(text) ||
        log.workflowName?.toLowerCase().includes(text);

      const matchStatus = statusFilter === "all" || log.status === statusFilter;
      const matchTag = tagFilter === "all" || log.tag === tagFilter;

      const matchAwaiting =
        awaitingFilter === "all" ||
        (awaitingFilter === "yes" && log.awaitingReply) ||
        (awaitingFilter === "no" && !log.awaitingReply);

      return matchText && matchStatus && matchTag && matchAwaiting && isInDateRange(log);
    });
  }, [
    data.items,
    search,
    statusFilter,
    tagFilter,
    awaitingFilter,
    dateRange,
    customStart,
    customEnd,
  ]);

  return (
    <RequireAuth>
      <div className="p-8 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
              Activity Logs
            </h1>
            <p className="text-sm opacity-70 mt-1" style={{ color: "var(--foreground)" }}>
              Monitor your email workflow activity.
            </p>
          </div>
          <div className="text-xs opacity-60">Page {data.page} • {data.items.length} records</div>
        </div>

        {/* FILTERS */}
        <div
          className="rounded-2xl border shadow-sm p-5 flex flex-col gap-5"
          style={{ backgroundColor: "var(--background)", borderColor: "var(--accent-hover)" }}
        >
          {/* Search + Status + Tag + Awaiting */}
          <div className="grid md:grid-cols-4 gap-4">

            {/* Search */}
            <div className="col-span-2">
              <label className="text-xs uppercase opacity-60 mb-1 block">Search</label>
              <input
                type="text"
                placeholder="Search email, subject, workflow..."
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--accent-hover)",
                  borderColor: "var(--accent-light)",
                  color: "var(--foreground)",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-xs uppercase opacity-60 mb-1 block">Status</label>
              <select
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: "var(--accent-hover)", borderColor: "var(--accent-light)", color: "var(--foreground)" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-xs uppercase opacity-60 mb-1 block">Tag</label>
              <select
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: "var(--accent-hover)", borderColor: "var(--accent-light)", color: "var(--foreground)" }}
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="all">All</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Awaiting Reply Filter */}
            <div>
              <label className="text-xs uppercase opacity-60 mb-1 block">Awaiting Reply</label>
              <select
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: "var(--accent-hover)", borderColor: "var(--accent-light)", color: "var(--foreground)" }}
                value={awaitingFilter}
                onChange={(e) => setAwaitingFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="yes">Awaiting</option>
                <option value="no">Not Awaiting</option>
              </select>
            </div>
          </div>

          {/* DATE RANGE */}
          <div>
            <label className="text-xs uppercase opacity-60 mb-1 block">Date Range</label>
            <div className="flex gap-2 flex-wrap">
              {DATE_RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setDateRange(r.id)}
                  className="px-3 py-1.5 rounded-full text-xs border transition"
                  style={{
                    backgroundColor: dateRange === r.id ? "var(--accent)" : "transparent",
                    borderColor: "var(--accent-hover)",
                    color: "var(--foreground)",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Custom Date Select */}
            {dateRange === "custom" && (
              <div className="flex gap-4 mt-3">
                <input type="date"
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--accent-hover)", borderColor: "var(--accent-light)", color: "var(--foreground)" }}
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <input type="date"
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: "var(--accent-hover)", borderColor: "var(--accent-light)", color: "var(--foreground)" }}
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div
                className="inline-block w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3"
                style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
              />
              <p className="opacity-80">Loading logs…</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-14 rounded-2xl border border-dashed"
            style={{ borderColor: "var(--accent-hover)" }}>
            <p className="text-lg font-medium">No logs match your filters</p>
            <p className="text-sm opacity-70 mt-1">Try changing filters.</p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-2xl border shadow-sm">
                <table className="min-w-full text-sm">
                  
                  <thead
                    className="text-xs uppercase tracking-wide"
                    style={{ backgroundColor: "var(--accent-hover)" }}
                  >
                    <tr>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Tag</th>
                      <th className="px-4 py-3 text-left">Awaiting</th>
                      <th className="px-4 py-3 text-left">Subject</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Workflow</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Error</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((log, idx) => (
                      <tr key={log._id || idx}
                        className="border-t"
                        style={{ borderColor: "var(--accent-hover)" }}
                      >
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                log.status === "success" ? "#16a34a33" : "#dc262633",
                              color: log.status === "success" ? "#16a34a" : "#dc2626",
                            }}
                          >
                            {log.status?.toUpperCase()}
                          </span>
                        </td>

                        {/* TAG */}
                        <td className="px-4 py-3">
                          {log.tag ? (
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium text-white shadow-md"
                              style={{
                                backgroundColor: log.tagColor || "#555",
                              }}
                            >
                              {log.tag}
                            </span>
                          ) : (
                            <span className="opacity-40 text-xs">-</span>
                          )}
                        </td>

                        {/* AWAITING REPLY */}
                        <td className="px-4 py-3">
                          {log.awaitingReply ? (
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium text-white shadow-md"
                              style={{
                                backgroundColor: log.awaitingColor || "#000",
                              }}
                            >
                              Awaiting
                            </span>
                          ) : (
                            <span className="opacity-40 text-xs">No</span>
                          )}
                        </td>

                        <td className="px-4 py-3 font-medium">{log.subject}</td>

                        <td className="px-4 py-3 opacity-80">{log.email}</td>

                        <td className="px-4 py-3 opacity-80">{log.workflowName}</td>

                        <td className="px-4 py-3 opacity-70">{formatDate(log)}</td>

                        <td className="px-4 py-3 text-xs opacity-80">
                          {log.status === "error" ? log.errorMessage : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-3">
              {filteredItems.map((log, idx) => (
                <div
                  key={log._id || idx}
                  className="rounded-2xl border p-4 shadow-sm"
                  style={{ borderColor: "var(--accent-hover)" }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          log.status === "success" ? "#16a34a33" : "#dc262633",
                        color: log.status === "success" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {log.status?.toUpperCase()}
                    </span>
                    <span className="text-xs opacity-70">{formatDate(log)}</span>
                  </div>

                  {log.tag && (
                    <div
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white mb-2"
                      style={{ backgroundColor: log.tagColor || "#555" }}
                    >
                      {log.tag}
                    </div>
                  )}

                  {log.awaitingReply && (
                    <div
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white mb-2"
                      style={{ backgroundColor: log.awaitingColor || "#000" }}
                    >
                      Awaiting Reply
                    </div>
                  )}

                  <div className="font-medium mb-1">{log.subject}</div>
                  <div className="text-xs opacity-80">{log.email}</div>
                  <div className="text-xs opacity-60">{log.workflowName}</div>

                  {log.status === "error" && (
                    <div className="text-xs text-red-500 mt-2">⚠ {log.errorMessage}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            className="px-4 py-2 rounded-lg text-sm border transition disabled:opacity-40"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--accent-hover)",
              color: "var(--foreground)",
            }}
            disabled={data.page <= 1 || loading}
            onClick={() => load(data.page - 1)}
          >
            Prev
          </button>

          <span className="text-xs opacity-70">Page {data.page}</span>

          <button
            className="px-4 py-2 rounded-lg text-sm border transition disabled:opacity-40"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--accent-hover)",
              color: "var(--foreground)",
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