"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
// import { apiFetch } from "@/lib/api"; // Backend wiring placeholder (see below)

// Default labels we propose on first visit (names only)
const DEFAULT_TAGS = ["lead", "customer", "newsletter", "follow-up", "vip"];

// Fixed palette for Gmail-like label colors
const COLOR_OPTIONS_BG = [
  "#fce8e6", "#ffd8b1", "#fff2cc", "#e6f4ea", "#e8f0fe", "#ede7f6", "#fce7f3",
  "#f28b82", "#f6bf26", "#fdd663", "#81c995", "#8ab4f8", "#c6c9ff", "#f48fb1",
];
const COLOR_OPTIONS_TEXT = [
  "#a50e0e", "#8a3b00", "#7a5d00", "#0d652d", "#174ea6", "#3c2f8f", "#8e245b",
  "#5a0000", "#5c3b00", "#5b4b00", "#0b3d2c", "#0b3d91", "#2a2559", "#5b1a3b",
];

export default function MailAccountTagsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const emailParam = decodeURIComponent(params.email || "");

  // All labels for this account with Gmail-like structure
  // { name, colorBg, colorText, children: Array<{ name, colorBg, colorText }> }
  const [availableTags, setAvailableTags] = useState([]);
  // Chosen labels (by full path name: Parent or Parent/Child)
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [newTag, setNewTag] = useState("");
  const [newTagBg, setNewTagBg] = useState(COLOR_OPTIONS_BG[4]);
  const [newTagText, setNewTagText] = useState(COLOR_OPTIONS_TEXT[4]);
  const [newSubFor, setNewSubFor] = useState(""); // parent name for a sub-label
  const [newSubName, setNewSubName] = useState("");
  const [newSubBg, setNewSubBg] = useState(COLOR_OPTIONS_BG[3]);
  const [newSubText, setNewSubText] = useState(COLOR_OPTIONS_TEXT[3]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // open color picker state: null or { scope: 'label'|'sublabel'|'new'|'newSub', type: 'bg'|'text', name?: string, parent?: string }
  const [openPicker, setOpenPicker] = useState(null);

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
        // setAvailableTags((data.tags || [])); // [{ name, colorBg, colorText, children: [...] }]
        // setSelectedTags(new Set((data.selected || []))); // ["Parent", "Parent/Child"]

        // PLACEHOLDER: simulate a backend roundtrip and merge defaults with some mocked existing tags
        await new Promise((r) => setTimeout(r, 400));
        const mockedExisting = ["invoice", "ops"];
        const mergedNames = Array.from(new Set([...DEFAULT_TAGS, ...mockedExisting]));
        const tagObjects = mergedNames.map((name, idx) => ({
          name,
          colorBg: COLOR_OPTIONS_BG[idx % COLOR_OPTIONS_BG.length],
          colorText: COLOR_OPTIONS_TEXT[idx % COLOR_OPTIONS_TEXT.length],
          children: name === "customer" ? [
            { name: "vip", colorBg: COLOR_OPTIONS_BG[2], colorText: COLOR_OPTIONS_TEXT[2] },
            { name: "trial", colorBg: COLOR_OPTIONS_BG[10], colorText: COLOR_OPTIONS_TEXT[10] },
          ] : [],
        }));
        if (!cancelled) {
          setAvailableTags(tagObjects);
          setSelectedTags(new Set(["lead", "customer/vip"]));
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

  const toggleTag = (tagPath) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tagPath)) next.delete(tagPath);
      else next.add(tagPath);
      return next;
    });
  };

  const addTag = (e) => {
    e.preventDefault();
    const t = newTag.trim();
    if (!t) return;
    if (!availableTags.some((x) => x.name === t)) {
      setAvailableTags((arr) => [...arr, { name: t, colorBg: newTagBg, colorText: newTagText, children: [] }]);
    }
    setSelectedTags((set) => new Set([...Array.from(set), t]));
    setNewTag("");
    setNewTagBg(COLOR_OPTIONS_BG[4]);
    setNewTagText(COLOR_OPTIONS_TEXT[4]);
  };

  const setTagBg = (tagName, color) => {
    setAvailableTags((tags) => tags.map((t) => (t.name === tagName ? { ...t, colorBg: color } : t)));
  };

  const setTagText = (tagName, color) => {
    setAvailableTags((tags) => tags.map((t) => (t.name === tagName ? { ...t, colorText: color } : t)));
  };

  const setSubTagBg = (parentName, childName, color) => {
    setAvailableTags((tags) => tags.map((t) => {
      if (t.name !== parentName) return t;
      return {
        ...t,
        children: t.children.map((c) => c.name === childName ? { ...c, colorBg: color } : c)
      };
    }));
  };

  const setSubTagText = (parentName, childName, color) => {
    setAvailableTags((tags) => tags.map((t) => {
      if (t.name !== parentName) return t;
      return {
        ...t,
        children: t.children.map((c) => c.name === childName ? { ...c, colorText: color } : c)
      };
    }));
  };

  const addSubTag = (e) => {
    e.preventDefault();
    const parent = newSubFor.trim();
    const child = newSubName.trim();
    if (!parent || !child) return;
    setAvailableTags((tags) => tags.map((t) => {
      if (t.name !== parent) return t;
      if (t.children.some((c) => c.name === child)) return t;
      return {
        ...t,
        children: [...t.children, { name: child, colorBg: newSubBg, colorText: newSubText }]
      };
    }));
    setSelectedTags((set) => new Set([...Array.from(set), `${parent}/${child}`]));
    setNewSubName("");
    setNewSubFor("");
    setNewSubBg(COLOR_OPTIONS[3]);
    setNewSubText("#111827");
  };

  const removeTag = (tagName) => {
    // BACKEND WIRING (COMMENTED): remove a parent label and its sub-labels
    // await apiFetch(`/api/mail-accounts/${encodeURIComponent(emailParam)}/tags/${encodeURIComponent(tagName)}`, { method: "DELETE" });

    setAvailableTags((tags) => tags.filter((t) => t.name !== tagName));
    setSelectedTags((sel) => {
      const next = new Set(sel);
      next.delete(tagName);
      for (const path of Array.from(next)) {
        if (path.startsWith(`${tagName}/`)) next.delete(path);
      }
      return next;
    });
  };

  const removeSubTag = (parentName, childName) => {
    // BACKEND WIRING (COMMENTED): remove a specific sub-label
    // await apiFetch(`/api/mail-accounts/${encodeURIComponent(emailParam)}/tags/${encodeURIComponent(parentName)}/${encodeURIComponent(childName)}`, { method: "DELETE" });

    setAvailableTags((tags) => tags.map((t) => {
      if (t.name !== parentName) return t;
      return { ...t, children: t.children.filter((c) => c.name !== childName) };
    }));
    setSelectedTags((sel) => {
      const next = new Set(sel);
      next.delete(`${parentName}/${childName}`);
      return next;
    });
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        selected: Array.from(selectedTags), // ["Parent", "Parent/Child"]
        tags: availableTags, // [{ name, colorBg, colorText, children: [{ name, colorBg, colorText }] }]
      };
      // BACKEND WIRING (COMMENTED): send Gmail-like label structure with colors
      // await apiFetch(`/api/mail-accounts/${encodeURIComponent(emailParam)}/tags`, {
      //   method: "POST",
      //   body: payload,
      // });

      // PLACEHOLDER: do nothing after save for now
      await new Promise((r) => setTimeout(r, 400));
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
              <div className="space-y-3">
                {availableTags.map((tag) => {
                  const active = selectedTags.has(tag.name);
                  return (
                    <div key={tag.name} className="space-y-2">
                      <div
                        className="flex items-center justify-between rounded-lg px-3 py-2 border"
                        style={{ borderColor: 'var(--background)', backgroundColor: 'var(--accent)' }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleTag(tag.name)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                            {tag.name}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{ backgroundColor: tag.colorBg, color: tag.colorText }}
                          >
                            {tag.name}
                          </span>
                        </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>BG</span>
                            <button
                              onClick={() => setOpenPicker(openPicker && openPicker.scope==='label' && openPicker.name===tag.name && openPicker.type==='bg' ? null : { scope:'label', type:'bg', name: tag.name })}
                              className="h-7 px-2 rounded border text-xs font-semibold"
                              style={{ backgroundColor: tag.colorBg, color: tag.colorText, borderColor: 'var(--background)' }}
                              type="button"
                              aria-label={`Open ${tag.name} background color picker`}
                            >
                              BG
                            </button>
                            {openPicker && openPicker.scope==='label' && openPicker.name===tag.name && openPicker.type==='bg' && (
                              <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                                style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                              >
                                {COLOR_OPTIONS_BG.map((c) => (
                                  <button
                                    key={c}
                                    onClick={() => { setTagBg(tag.name, c); setOpenPicker(null); }}
                                    className={`h-5 w-5 rounded-full border ${c === tag.colorBg ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                                    style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                                    type="button"
                                    aria-label={`Set ${tag.name} background ${c}`}
                                  />
                                ))}
                              </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>Text</span>
                            <button
                              onClick={() => setOpenPicker(openPicker && openPicker.scope==='label' && openPicker.name===tag.name && openPicker.type==='text' ? null : { scope:'label', type:'text', name: tag.name })}
                              className="h-7 px-2 rounded border text-xs font-semibold"
                              style={{ backgroundColor: 'var(--background)', color: tag.colorText, borderColor: 'var(--background)' }}
                              type="button"
                              aria-label={`Open ${tag.name} text color picker`}
                            >
                              Text
                            </button>
                            {openPicker && openPicker.scope==='label' && openPicker.name===tag.name && openPicker.type==='text' && (
                              <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                                style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                              >
                                {COLOR_OPTIONS_TEXT.map((c) => (
                                  <button
                                    key={c}
                                    onClick={() => { setTagText(tag.name, c); setOpenPicker(null); }}
                                    className={`h-5 w-5 rounded-full border ${c === tag.colorText ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                                    style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                                    type="button"
                                    aria-label={`Set ${tag.name} text ${c}`}
                                  />
                                ))}
                              </div>
                            )}
                        </div>
                        <button
                          onClick={() => removeTag(tag.name)}
                          className="ml-2 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 border"
                          style={{ color: 'var(--error)', backgroundColor: 'transparent', borderColor: 'var(--background)' }}
                          type="button"
                          aria-label={`Remove label ${tag.name}`}
                          title="Remove"
                        >
                          ×
                        </button>
                        </div>
                      </div>

                      {tag.children && tag.children.length > 0 && (
                        <div className="pl-6 space-y-2">
                          {tag.children.map((child) => {
                            const childPath = `${tag.name}/${child.name}`;
                            const childActive = selectedTags.has(childPath);
                            return (
                              <div
                                key={child.name}
                                className="flex items-center justify-between rounded-lg px-3 py-2 border"
                                style={{ borderColor: 'var(--background)', backgroundColor: 'var(--accent)' }}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={childActive}
                                    onChange={() => toggleTag(childPath)}
                                    className="h-4 w-4"
                                  />
                                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                                    {tag.name}/{child.name}
                                  </span>
                                  <span
                                    className="px-2 py-0.5 rounded text-xs font-semibold"
                                    style={{ backgroundColor: child.colorBg, color: child.colorText }}
                                  >
                                    {child.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>BG</span>
                                    <button
                                      onClick={() => setOpenPicker(openPicker && openPicker.scope==='sublabel' && openPicker.parent===tag.name && openPicker.name===child.name && openPicker.type==='bg' ? null : { scope:'sublabel', parent: tag.name, name: child.name, type:'bg' })}
                                      className="h-7 px-2 rounded border text-xs font-semibold"
                                      style={{ backgroundColor: child.colorBg, color: child.colorText, borderColor: 'var(--background)' }}
                                      type="button"
                                      aria-label={`Open ${tag.name}/${child.name} background picker`}
                                    >
                                      BG
                                    </button>
                                    {openPicker && openPicker.scope==='sublabel' && openPicker.parent===tag.name && openPicker.name===child.name && openPicker.type==='bg' && (
                                      <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                                        style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                                      >
                                        {COLOR_OPTIONS_BG.map((c) => (
                                          <button
                                            key={c}
                                            onClick={() => { setSubTagBg(tag.name, child.name, c); setOpenPicker(null); }}
                                            className={`h-5 w-5 rounded-full border ${c === child.colorBg ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                                            style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                                            type="button"
                                            aria-label={`Set ${tag.name}/${child.name} background ${c}`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>Text</span>
                                    <button
                                      onClick={() => setOpenPicker(openPicker && openPicker.scope==='sublabel' && openPicker.parent===tag.name && openPicker.name===child.name && openPicker.type==='text' ? null : { scope:'sublabel', parent: tag.name, name: child.name, type:'text' })}
                                      className="h-7 px-2 rounded border text-xs font-semibold"
                                      style={{ backgroundColor: 'var(--background)', color: child.colorText, borderColor: 'var(--background)' }}
                                      type="button"
                                      aria-label={`Open ${tag.name}/${child.name} text picker`}
                                    >
                                      Text
                                    </button>
                                    {openPicker && openPicker.scope==='sublabel' && openPicker.parent===tag.name && openPicker.name===child.name && openPicker.type==='text' && (
                                      <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                                        style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                                      >
                                        {COLOR_OPTIONS_TEXT.map((c) => (
                                          <button
                                            key={c}
                                            onClick={() => { setSubTagText(tag.name, child.name, c); setOpenPicker(null); }}
                                            className={`h-5 w-5 rounded-full border ${c === child.colorText ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                                            style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                                            type="button"
                                            aria-label={`Set ${tag.name}/${child.name} text ${c}`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeSubTag(tag.name, child.name)}
                                    className="ml-2 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 border"
                                    style={{ color: 'var(--error)', backgroundColor: 'transparent', borderColor: 'var(--background)' }}
                                    type="button"
                                    aria-label={`Remove sub-label ${tag.name}/${child.name}`}
                                    title="Remove"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>BG</span>
                <button
                  onClick={() => setOpenPicker(openPicker && openPicker.scope==='new' && openPicker.type==='bg' ? null : { scope:'new', type:'bg' })}
                  className="h-7 px-2 rounded border text-xs font-semibold"
                  style={{ backgroundColor: newTagBg, color: newTagText, borderColor: 'var(--background)' }}
                  type="button"
                  aria-label="Open new label background picker"
                >
                  BG
                </button>
                {openPicker && openPicker.scope==='new' && openPicker.type==='bg' && (
                  <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                    style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                  >
                    {COLOR_OPTIONS_BG.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setNewTagBg(c); setOpenPicker(null); }}
                        className={`h-5 w-5 rounded-full border ${c === newTagBg ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                        style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                        type="button"
                        aria-label={`Set new label background ${c}`}
                      />
                    ))}
                  </div>
                )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>Text</span>
                <button
                  onClick={() => setOpenPicker(openPicker && openPicker.scope==='new' && openPicker.type==='text' ? null : { scope:'new', type:'text' })}
                  className="h-7 px-2 rounded border text-xs font-semibold"
                  style={{ backgroundColor: 'var(--background)', color: newTagText, borderColor: 'var(--background)' }}
                  type="button"
                  aria-label="Open new label text picker"
                >
                  Text
                </button>
                {openPicker && openPicker.scope==='new' && openPicker.type==='text' && (
                  <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                    style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                  >
                    {COLOR_OPTIONS_TEXT.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setNewTagText(c); setOpenPicker(null); }}
                        className={`h-5 w-5 rounded-full border ${c === newTagText ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                        style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                        type="button"
                        aria-label={`Set new label text ${c}`}
                      />
                    ))}
                  </div>
                )}
                </div>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  type="submit"
                >
                  Add
                </button>
              </div>
            </form>

            {/* Add sub-label */}
            <form onSubmit={addSubTag} className="space-y-3">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Add a sub-label (Gmail nested label)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  className="rounded-lg px-3 py-2 border"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--accent)' }}
                  value={newSubFor}
                  onChange={(e) => setNewSubFor(e.target.value)}
                >
                  <option value="">Select parent label</option>
                  {availableTags.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <input
                  className="flex-1 min-w-[180px] rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[color:var(--background)] border-2"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--foreground)' }}
                  placeholder="Sub-label name"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>BG</span>
                  <button
                    onClick={() => setOpenPicker(openPicker && openPicker.scope==='newSub' && openPicker.type==='bg' ? null : { scope:'newSub', type:'bg' })}
                    className="h-7 px-2 rounded border text-xs font-semibold"
                    style={{ backgroundColor: newSubBg, color: newSubText, borderColor: 'var(--background)' }}
                    type="button"
                    aria-label="Open new sub-label background picker"
                  >
                    BG
                  </button>
                  {openPicker && openPicker.scope==='newSub' && openPicker.type==='bg' && (
                    <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                      style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                    >
                      {COLOR_OPTIONS_BG.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setNewSubBg(c); setOpenPicker(null); }}
                          className={`h-5 w-5 rounded-full border ${c === newSubBg ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                          style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                          type="button"
                          aria-label={`Set new sub-label background ${c}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-80" style={{ color: 'var(--foreground)' }}>Text</span>
                  <button
                    onClick={() => setOpenPicker(openPicker && openPicker.scope==='newSub' && openPicker.type==='text' ? null : { scope:'newSub', type:'text' })}
                    className="h-7 px-2 rounded border text-xs font-semibold"
                    style={{ backgroundColor: 'var(--background)', color: newSubText, borderColor: 'var(--background)' }}
                    type="button"
                    aria-label="Open new sub-label text picker"
                  >
                    Text
                  </button>
                  {openPicker && openPicker.scope==='newSub' && openPicker.type==='text' && (
                    <div className="z-10 mt-1 p-2 rounded-lg shadow border flex flex-wrap gap-1"
                      style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--background)' }}
                    >
                      {COLOR_OPTIONS_TEXT.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setNewSubText(c); setOpenPicker(null); }}
                          className={`h-5 w-5 rounded-full border ${c === newSubText ? 'ring-2 ring-[color:var(--background)]' : ''}`}
                          style={{ backgroundColor: c, borderColor: 'var(--background)' }}
                          type="button"
                          aria-label={`Set new sub-label text ${c}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  type="submit"
                >
                  Add sub-label
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


