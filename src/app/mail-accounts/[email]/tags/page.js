"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
// import { apiFetch } from "@/lib/api"; // Backend wiring placeholder (see below)

// Default tags we propose on first visit
const DEFAULT_TAGS = [
  "lead",
  "customer",
  "newsletter",
  "follow-up",
  "vip",
];

export default function MailAccountTagsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const emailParam = decodeURIComponent(params.email || "");

  const [availableTags, setAvailableTags] = useState([]); // all tags for this account
  const [selectedTags, setSelectedTags] = useState(new Set()); // chosen tags
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Derived: pretty title
  const titleEmail = useMemo(() => emailParam, [emailParam]);

  useEffect(() => {
    if (!user || !emailParam) return;

    let cancelled = false;

    async function initAndFetch() {
      setLoading(true);
      setError("");
      try {
        // BACKEND WIRING (COMMENTED):
        // 1) Send initial default tags to backend so it can create/merge for this account
        // await apiFetch(`/api/mail-accounts/${encodeURIComponent(emailParam)}/tags/init`, {
        //   method: "POST",
        //   body: { initial: DEFAULT_TAGS },
        // });
        // 2) Then fetch the full tag list the backend returns for this account
        // const data = await apiFetch(`/api/mail-accounts/${encodeURIComponent(emailParam)}/tags`);
        // setAvailableTags(data.tags || []);
        // setSelectedTags(new Set(data.selected || []));

        // PLACEHOLDER: simulate a backend roundtrip and merge defaults with some mocked existing tags
        await new Promise((r) => setTimeout(r, 400));
        const mockedExisting = ["invoice", "ops"];
        const merged = Array.from(new Set([...DEFAULT_TAGS, ...mockedExisting]));
        if (!cancelled) {
          setAvailableTags(merged);
          setSelectedTags(new Set(["lead", "ops"]));
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load tags");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initAndFetch();
    return () => {
      cancelled = true;
    };
  }, [user, emailParam]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const addTag = (e) => {
    e.preventDefault();
    const t = newTag.trim();
    if (!t) return;
    if (!availableTags.includes(t)) {
      setAvailableTags((arr) => [...arr, t]);
    }
    setSelectedTags((set) => new Set([...Array.from(set), t]));
    setNewTag("");
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        selected: Array.from(selectedTags),
        available: availableTags,
      };
      // BACKEND WIRING (COMMENTED):
      // await apiFetch(`/api/mail-accounts/${encodeURIComponent(emailParam)}/tags`, {
      //   method: "POST",
      //   body: payload,
      // });

      // PLACEHOLDER: mock a save
      await new Promise((r) => setTimeout(r, 400));
      router.push("/mail-accounts");
    } catch (e) {
      setError(e?.message || "Failed to save tags");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAuth>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-3xl font-semibold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Manage Tags
            </h1>
            <p className="opacity-80" style={{ color: 'var(--foreground)' }}>
              {titleEmail}
            </p>
          </div>
        </div>

        {error && (
          <div 
            className="p-3 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)', border: '1px solid var(--error-border)' }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div 
                className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <p style={{ color: 'var(--foreground)' }}>Loading tags...</p>
            </div>
          </div>
        ) : (
          <div 
            className="rounded-xl p-6 shadow-lg space-y-6"
            style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--accent-light)' }}
          >
            <div>
              <h2 
                className="text-lg font-semibold mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Available Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const active = selectedTags.has(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border"
                      style={{
                        backgroundColor: active ? 'var(--background)' : 'transparent',
                        color: 'var(--foreground)',
                        borderColor: 'var(--background)'
                      }}
                      type="button"
                    >
                      {active ? '✓ ' : ''}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={addTag} className="space-y-3">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Add a new tag (only for this account)
              </h3>
              <div className="flex items-center gap-3">
                <input
                  id="newTag"
                  className="flex-1 rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[color:var(--background)] border-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--accent)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="e.g. onboarding"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  type="submit"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 border"
                style={{ backgroundColor: 'transparent', color: 'var(--foreground)', borderColor: 'var(--background)' }}
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                disabled={saving}
                type="button"
              >
                {saving ? 'Saving...' : 'Save' }
              </button>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}


