"use client";

import { useState } from "react";

const theme = {
  bg: "#f6f8fc",
  card: "#ffffff",
  text: "#1a1f36",
  muted: "#5d6475",
  border: "#dbe1f0",
  primary: "#0a2a78",     // deep blue
  primaryHover: "#143a97",
  accent: "#6f42c1",      // purple
  accentHover: "#5a32a3",
  success: "#0f9d58",
  error: "#c62828",
  codeBg: "#0f1b3d",
  codeText: "#eaf0ff",
};

// Types for the /health endpoint
// Types for the /skills endpoint
type Skill = {
  id: number;
  name: string;
  category: string;
};

// Types for the /ads endpoint
type AdMetadata = {
  location?: { name?: string };
  classification?: { name?: string };
  subClassification?: { name?: string };
  workType?: { name?: string };
  // allow unknown extra fields from the backend
  [key: string]: unknown;
};

type Ad = {
  id: number;
  title: string;
  abstract: string;
  content: string;
  content_preview?: string;
  metadata: AdMetadata | string | null;
};

type AdsResponse =
  | { ok: true; items: Ad[]; count: number }
  | { ok: false; error: string };

export default function Home() {
  // State for /skills
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skillsLoading, setSkillsLoading] = useState(false);

  // State for /ads
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [adsError, setAdsError] = useState<string | null>(null);
  const [adsLoading, setAdsLoading] = useState(false);

  // Base URL of the Python backend, from .env.local
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL;

  // --- Actions that call the backend ---

  async function loadSkills() {
    setSkillsLoading(true);
    setSkills(null);
    setSkillsError(null);

    if (!backendBase) {
      setSkillsError("NEXT_PUBLIC_BACKEND_URL is not set");
      setSkillsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendBase}/skills`);
      if (!res.ok) {
        setSkillsError(`HTTP ${res.status} ${res.statusText}`);
        return;
      }
      const data = (await res.json()) as Skill[];
      setSkills(data);
    } catch (e) {
      setSkillsError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSkillsLoading(false);
    }
  }

  async function loadAds() {
    setAdsLoading(true);
    setAds(null);
    setAdsError(null);

    if (!backendBase) {
      setAdsError("NEXT_PUBLIC_BACKEND_URL is not set");
      setAdsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendBase}/ads?limit=5`);
      if (!res.ok) {
        setAdsError(`HTTP ${res.status} ${res.statusText}`);
        return;
      }
      const data = (await res.json()) as AdsResponse;
      if (!data.ok) {
        setAdsError(data.error);
        return;
      }
      setAds(data.items);
    } catch (e) {
      setAdsError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setAdsLoading(false);
    }
  }

  // --- UI layout: three sections using the actions above ---

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        background: theme.bg,
        minHeight: "100vh",
        color: theme.text,
      }}
    >
      <div
        style={{
          background: theme.primary,
          color: "white",
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 16,
          fontWeight: 600,
          letterSpacing: 0.2,
        }}
      >
        Job Ad Skill Extraction Dashboard
      </div>

      {/* Skills section */}
      <section
        style={{
          marginTop: 24,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Skills from backend</h2>

        <button
          onClick={loadSkills}
          disabled={skillsLoading}
          style={{
            marginTop: 8,
            padding: "8px 12px",
            border: "none",
            borderRadius: 8,
            background: skillsLoading ? theme.accentHover : theme.accent,
            color: "white",
            cursor: skillsLoading ? "not-allowed" : "pointer",
            opacity: skillsLoading ? 0.8 : 1,
          }}
        >
          {skillsLoading ? "Loading..." : "Load skills"}
        </button>

        {skillsError && (
          <p style={{ marginTop: 8, color: theme.error }}>Error: {skillsError}</p>
        )}

        {skills && (
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {skills.map((skill) => (
              <li key={skill.id}>
                <strong>{skill.name}</strong>{" "}
                <span style={{ color: theme.muted }}>({skill.category})</span>
              </li>
            ))}
          </ul>
        )}

        {!skills && !skillsError && !skillsLoading && (
          <p style={{ marginTop: 8, color: theme.muted }}>
            Click &quot;Load skills&quot; to fetch data from the backend.
          </p>
        )}
      </section>

      {/* Ads section */}
      <section
        style={{
          marginTop: 32,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Sample job ads</h2>

        <button
          onClick={loadAds}
          disabled={adsLoading}
          style={{
            marginTop: 8,
            padding: "8px 12px",
            border: "none",
            borderRadius: 8,
            background: adsLoading ? theme.accentHover : theme.accent,
            color: "white",
            cursor: adsLoading ? "not-allowed" : "pointer",
            opacity: adsLoading ? 0.8 : 1,
          }}
        >
          {adsLoading ? "Loading..." : "Load 5 ads"}
        </button>

        {adsError && (
          <p style={{ marginTop: 8, color: theme.error }}>Error: {adsError}</p>
        )}

        {ads && (
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {ads.map((ad) => {
              const meta =
                typeof ad.metadata === "object" && ad.metadata
                  ? (ad.metadata as AdMetadata)
                  : null;
              const location = meta?.location?.name;
              const workType = meta?.workType?.name;

              return (
                <li key={ad.id} style={{ marginBottom: 10 }}>
                  <a
                    href={`/ads/${ad.id}`}
                    style={{ fontWeight: 600, color: theme.primary, textDecoration: "none" }}
                  >
                    {ad.title}
                  </a>
                  <div style={{ color: theme.muted }}>
                    id: {ad.id}
                    {location ? ` • ${location}` : ""}
                    {workType ? ` • ${workType}` : ""}
                  </div>
                  {ad.content_preview && (
                    <p style={{ marginTop: 4, color: theme.text, fontSize: 14 }}>
                      {ad.content_preview}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {!ads && !adsError && !adsLoading && (
          <p style={{ marginTop: 8, color: theme.muted }}>
            Click &quot;Load 5 ads&quot; to preview real data from{" "}
            <code>sampled_100_ads.csv</code>.
          </p>
        )}
      </section>
    </main>
  );
}