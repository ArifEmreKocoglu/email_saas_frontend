"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { tags } from "@/lib/api";

const COLOR_OPTIONS = [
  "#fad165", // Finance
  "#ffad47", // Security
  "#fb4c2f", // Marketing
  "#16a766", // Commerce
  "#f691b3", // Support / DevOps
  "#43d692", // HR / Legal / System
  "#a479e2", // Personal
  "#000000", // AwaitingReply
  "#4a86e8"  // Review (default)
];

export default function ManageTagsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState(null);
  const [openColorPicker, setOpenColorPicker] = useState(null);

  // ------------------------------
  // Load configuration from backend
  // ------------------------------
  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      try {
        const data = await tags.get(email);
        setConfig(data.tagsConfig);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [email, user]);

  // ------------------------------
  // Update label color
  // ------------------------------
  const updateColor = (path, newColor) => {
    setConfig((prev) => ({
      ...prev,
      allowed: prev.allowed.map((item) =>
        item.path === path ? { ...item, color: newColor } : item
      ),
    }));
  };

  // ------------------------------
  // Update special labels
  // ------------------------------
  const updateSpecialColor = (key, newColor) => {
    setConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], color: newColor },
    }));
  };

  // ------------------------------
  // Add new label
  // ------------------------------
  const addLabel = (parent, child, color) => {
    const path = parent ? `${parent}/${child}` : child;
    setConfig((prev) => ({
      ...prev,
      allowed: [...prev.allowed, { path, color }],
    }));
  };

  // ------------------------------
  // Remove label
  // ------------------------------
  const removeLabel = (path) => {
    setConfig((prev) => ({
      ...prev,
      allowed: prev.allowed.filter((l) => l.path !== path),
    }));
  };

  // ------------------------------
  // Save changes to backend
  // ------------------------------
  const onSave = async () => {
    setSaving(true);
    setError("");

    try {
      await tags.save(email, config);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // UI Rendering
  // ------------------------------
  return (
    <RequireAuth>
      <div className="p-8 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            Label Settings
          </h1>
          <p className="text-sm opacity-80" style={{ color: "var(--foreground)" }}>
            Manage automatic LLM labels for: <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div
            className="p-3 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "var(--error-bg)",
              color: "var(--error)",
              border: "1px solid var(--error-border)",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div
                className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                style={{
                  borderColor: "var(--accent)",
                  borderTopColor: "transparent",
                }}
              />
              <p className="mt-3" style={{ color: "var(--foreground)" }}>
                Loading labels...
              </p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl p-6 shadow-lg space-y-8"
            style={{
              backgroundColor: "var(--accent)",
              border: "1px solid var(--accent-light)",
            }}
          >
            {/* Allowed Labels */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
                Allowed Labels
              </h2>

              <div className="space-y-3">
                {config.allowed.map((label) => (
                  <div
                    key={label.path}
                    className="relative flex items-center justify-between p-3 rounded-lg border"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{label.path}</span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.path.split("/").pop()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        className="h-7 px-3 rounded border text-xs"
                        style={{ backgroundColor: label.color }}
                        onClick={() =>
                          setOpenColorPicker(
                            openColorPicker === label.path ? null : label.path
                          )
                        }
                      >
                        Color
                      </button>

                      {openColorPicker === label.path && (
                        <div
                          className="absolute left-0 right-0 mt-10 p-2 rounded-lg shadow-lg flex flex-wrap gap-2 z-40"
                          style={{
                            backgroundColor: "var(--accent)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {COLOR_OPTIONS.map((c) => (
                            <button
                              key={c}
                              className={`w-6 h-6 rounded-full border ${
                                label.color === c ? "ring-2 ring-blue-500" : ""
                              }`}
                              style={{ backgroundColor: c }}
                              onClick={() => {
                                updateColor(label.path, c);
                                setOpenColorPicker(null);
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => removeLabel(label.path)}
                        className="text-red-500 text-lg font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Special Labels */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
                Special Labels
              </h2>

              {["awaiting", "review"].map((key) => (
                <div
                  key={key}
                  className="relative flex items-center justify-between p-3 rounded-lg border mb-3"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{config[key].path}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: config[key].color }}
                    >
                      {key}
                    </span>
                  </div>

                  <button
                    className="h-7 px-3 rounded border text-xs"
                    style={{ backgroundColor: config[key].color }}
                    onClick={() =>
                      setOpenColorPicker(
                        openColorPicker === config[key].path
                          ? null
                          : config[key].path
                      )
                    }
                  >
                    Color
                  </button>

                  {openColorPicker === config[key].path && (
                    <div
                      className="absolute mt-10 left-0 right-0 p-2 rounded-lg shadow-lg flex flex-wrap gap-2 z-40"
                      style={{
                        backgroundColor: "var(--accent)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c}
                          className={`w-6 h-6 rounded-full border ${
                            config[key].color === c
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          style={{ backgroundColor: c }}
                          onClick={() => {
                            updateSpecialColor(key, c);
                            setOpenColorPicker(null);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Add Label */}
            <AddLabelForm onAdd={addLabel} />

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={onSave}
                disabled={saving}
                className="px-6 py-3 rounded-lg font-semibold shadow transition-all disabled:opacity-50"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

/* -------------------------------
   Add Label Component
-------------------------------- */
function AddLabelForm({ onAdd }) {
  const [parent, setParent] = useState("");
  const [child, setChild] = useState("");
  const [color, setColor] = useState("#aecbfa");
  const [open, setOpen] = useState(false);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
        Add new label
      </h2>

      <div className="flex flex-wrap items-center gap-3 relative">
        <input
          className="px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          placeholder="Parent (optional)"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
        />

        <input
          className="px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          placeholder="Label name"
          value={child}
          onChange={(e) => setChild(e.target.value)}
        />

        <button
          className="h-8 px-3 rounded border text-xs"
          style={{ backgroundColor: color }}
          onClick={() => setOpen(!open)}
        >
          Color
        </button>

        {open && (
          <div
            className="absolute mt-12 p-2 rounded-lg shadow-lg flex flex-wrap gap-2 z-40"
            style={{
              backgroundColor: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full border ${
                  color === c ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => {
                  setColor(c);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => {
            if (!child.trim()) return;
            onAdd(parent.trim(), child.trim(), color);
            setParent("");
            setChild("");
          }}
          className="px-4 py-2 rounded-lg font-medium"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          Add
        </button>
      </div>
    </section>
  );
}