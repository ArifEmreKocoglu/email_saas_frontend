"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { tags } from "@/lib/api";

/* =======================
   Default Label Template
   ======================= */
const DEFAULT_LABEL_TEMPLATE = {
  allowed: [
    { path: "Finance", color: "#fad165" },
    { path: "Finance/Invoices", color: "#fad165" },
    { path: "Finance/Payments", color: "#fad165" },
    { path: "Security", color: "#ffad47" },
    { path: "Security/Spam", color: "#ffad47" },
    { path: "Security/Phishing", color: "#ffad47" },
    { path: "Marketing", color: "#fb4c2f" },
    { path: "Marketing/Newsletters", color: "#fb4c2f" },
    { path: "Marketing/Promotions", color: "#fb4c2f" },
    { path: "Commerce", color: "#16a766" },
    { path: "Commerce/Orders", color: "#16a766" },
    { path: "Commerce/Shipping", color: "#16a766" },
    { path: "Commerce/Returns", color: "#16a766" },
    { path: "Support", color: "#f691b3" },
    { path: "Support/Tickets", color: "#f691b3" },
    { path: "DevOps", color: "#f691b3" },
    { path: "DevOps/Tools", color: "#f691b3" },
    { path: "HR", color: "#43d692" },
    { path: "HR/Application", color: "#43d692" },
    { path: "Legal", color: "#43d692" },
    { path: "System", color: "#43d692" },
    { path: "Personal", color: "#a479e2" },
  ],
  awaiting: { path: "AwaitingReply", color: "#000000" },
  review: { path: "Review/Uncertain", color: "#4a86e8" },
};

const COLOR_OPTIONS = [
  "#f28b82", "#fbbc04", "#fff475", "#ccff90", "#a7ffeb",
  "#cbf0f8", "#aecbfa", "#d7aefb", "#fdcfe8", "#e6c9a8", "#e8eaed"
];

export default function ManageTagsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const emailParam = decodeURIComponent(params.email || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState(null); // full label config object
  const [openColor, setOpenColor] = useState(null);

  const titleEmail = useMemo(() => emailParam, [emailParam]);
  

  useEffect(() => {
    if (!user || !emailParam) return;
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {

        const data = await tags.get(emailParam);
        if (!data) {
          await tags.init(emailParam, DEFAULT_LABEL_TEMPLATE.allowed.map(a => a.path));
          setConfig(DEFAULT_LABEL_TEMPLATE);
        } else {
          setConfig(data);
        }

        await tags.save(emailParam, config);

        // init (ilk kurulumda):
        await tags.init(emailParam, DEFAULT_LABEL_TEMPLATE.allowed.map(a => a.path));

        // In production, fetch from backend:
        // const data = await apiFetch(`/api/mail-accounts/${emailParam}/tags`);
        // setConfig(data);

        await new Promise(r => setTimeout(r, 300));
        if (!cancelled) {
          // Simulate user config merge with default
          setConfig({
            ...DEFAULT_LABEL_TEMPLATE,
            allowed: DEFAULT_LABEL_TEMPLATE.allowed,
            awaiting: DEFAULT_LABEL_TEMPLATE.awaiting,
            review: DEFAULT_LABEL_TEMPLATE.review,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load label config");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [user, emailParam]);

  const updateColor = (path, color) => {
    setConfig(cfg => ({
      ...cfg,
      allowed: cfg.allowed.map(a => a.path === path ? { ...a, color } : a)
    }));
  };

  const addLabel = (parent, child, color) => {
    const path = parent ? `${parent}/${child}` : child;
    setConfig(cfg => ({
      ...cfg,
      allowed: [...cfg.allowed, { path, color }],
    }));
  };

  const removeLabel = (path) => {
    setConfig(cfg => ({
      ...cfg,
      allowed: cfg.allowed.filter(a => a.path !== path),
    }));
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      // await apiFetch(`/api/mail-accounts/${emailParam}/tags`, {
      //   method: "POST",
      //   body: config,
      // });
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAuth>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold" style={{ color: "var(--foreground)" }}>Manage Label Configuration</h1>
            <p className="opacity-80" style={{ color: "var(--foreground)" }}>{titleEmail}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-sm font-medium"
               style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)', border: '1px solid var(--error-border)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 mb-2 rounded-full border-4 border-t-transparent animate-spin"
                   style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <p style={{ color: 'var(--foreground)' }}>Loading configuration...</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-6 shadow-lg space-y-6"
               style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--accent-light)' }}>
            
            {/* Allowed Labels */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Allowed Labels</h2>
              <div className="space-y-2">
              {config?.allowed?.map((label) => (
                  <div key={label.path}
                       className="flex items-center justify-between px-3 py-2 rounded-lg border"
                       style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{label.path}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{ backgroundColor: label.color, color: '#000' }}>{label.path.split('/').pop()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOpenColor(openColor === label.path ? null : label.path)}
                        className="h-7 px-2 rounded border text-xs font-semibold"
                        style={{ backgroundColor: label.color, borderColor: 'var(--border)' }}
                        type="button">
                        Color
                      </button>
                      {openColor === label.path && (
                        <div className="absolute mt-8 p-2 rounded-lg shadow-lg flex flex-wrap gap-1 z-10"
                             style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
                          {COLOR_OPTIONS.map((c) => (
                            <button
                              key={c}
                              onClick={() => { updateColor(label.path, c); setOpenColor(null); }}
                              className={`h-5 w-5 rounded-full border ${label.color === c ? 'ring-2 ring-[color:var(--foreground)]' : ''}`}
                              style={{ backgroundColor: c, borderColor: 'var(--border)' }}
                              type="button"
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => removeLabel(label.path)}
                        className="h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold hover:scale-110 transition-transform"
                        style={{ color: 'var(--error)', border: '1px solid var(--border)' }}
                        title="Remove label">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Special Labels */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Special Labels</h2>
              <div className="space-y-2">
                {["awaiting", "review"].map((k) => (
                  <div key={k}
                       className="flex items-center justify-between px-3 py-2 rounded-lg border"
                       style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium capitalize" style={{ color: 'var(--foreground)' }}>
                      {config?.[k]?.path}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{ backgroundColor: config?.[k]?.color, color: '#000' }}>
                        {k}
                      </span>
                    </div>
                    <button
                      onClick={() => setOpenColor(openColor === config?.[k]?.path ? null : config?.[k]?.path)}
                      className="h-7 px-2 rounded border text-xs font-semibold"
                      style={{ backgroundColor: config?.[k]?.color, borderColor: 'var(--border)' }}
                      type="button">
                      Color
                    </button>
                    {openColor === config?.[k]?.path && (
                      <div className="absolute mt-8 p-2 rounded-lg shadow-lg flex flex-wrap gap-1 z-10"
                           style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
                        {COLOR_OPTIONS.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setConfig(cfg => ({ ...cfg, [k]: { ...cfg[k], color: c } }));
                              setOpenColor(null);
                            }}
                            className={`h-5 w-5 rounded-full border ${config?.[k]?.color === c ? 'ring-2 ring-[color:var(--foreground)]' : ''}`}
                            style={{ backgroundColor: c, borderColor: 'var(--border)' }}
                            type="button"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Add New Label */}
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Add Label</h2>
              <AddLabelForm onAdd={addLabel} />
            </section>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-lg border font-medium hover:scale-105 transition-all"
                style={{ backgroundColor: 'transparent', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

/* Add Label Form Component */
function AddLabelForm({ onAdd }) {
  const [parent, setParent] = useState("");
  const [child, setChild] = useState("");
  const [color, setColor] = useState("#aecbfa");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        className="rounded-lg px-3 py-2 border flex-1 min-w-[200px]"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
        placeholder="Parent label (optional)"
        value={parent}
        onChange={(e) => setParent(e.target.value)}
      />
      <input
        className="rounded-lg px-3 py-2 border flex-1 min-w-[200px]"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
        placeholder="Label name"
        value={child}
        onChange={(e) => setChild(e.target.value)}
      />
      <button
        onClick={() => setOpen(!open)}
        className="h-7 px-2 rounded border text-xs font-semibold"
        style={{ backgroundColor: color, borderColor: 'var(--border)' }}
        type="button">
        Color
      </button>
      {open && (
        <div className="absolute mt-12 p-2 rounded-lg shadow-lg flex flex-wrap gap-1 z-10"
             style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
          {COLOR_OPTIONS.map((c) => (
            <button key={c} onClick={() => { setColor(c); setOpen(false); }}
                    className={`h-5 w-5 rounded-full border ${color === c ? 'ring-2 ring-[color:var(--foreground)]' : ''}`}
                    style={{ backgroundColor: c, borderColor: 'var(--border)' }} />
          ))}
        </div>
      )}
      <button
        onClick={() => { if (child.trim()) onAdd(parent.trim(), child.trim(), color); setParent(""); setChild(""); }}
        className="px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
        type="button">
        Add
      </button>
    </div>
  );
}