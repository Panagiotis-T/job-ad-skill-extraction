import Link from "next/link";

const theme = {
  bg: "#f6f8fc",
  card: "#ffffff",
  text: "#1a1f36",
  muted: "#5d6475",
  border: "#dbe1f0",
  primary: "#0a2a78",     // deep blue
  primaryHover: "#143a97",
  accent: "#e2007a",      // magenta/pink
  accentHover: "#c50069",
  success: "#0f9d58",
  error: "#c62828",
  codeBg: "#0f1b3d",
  codeText: "#eaf0ff",
};

type AdMetadata = {
    location?: { name?: string };
    workType?: { name?: string };
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
  
  type AdDetailResponse =
    | { ok: true; item: Ad }
    | { ok: false; error: string };
  
  export default async function AdPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!base) {
      return <p>Missing NEXT_PUBLIC_BACKEND_URL</p>;
    }
  
    const res = await fetch(`${base}/ads/${id}`, { cache: "no-store" });
    const data = (await res.json()) as AdDetailResponse;
  
    if (!data.ok) {
      return <p>Error: {data.error}</p>;
    }
  
    const ad = data.item;
    const meta =
      typeof ad.metadata === "object" && ad.metadata
        ? (ad.metadata as AdMetadata)
        : null;
  
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
        <Link href="/" style={{ color: theme.primary }}>
          ← Back
        </Link>
        <h1 style={{ marginTop: 16, fontSize: 22, fontWeight: 700 }}>
          {ad.title}
        </h1>
        <p style={{ color: theme.muted }}>
          id: {ad.id}
          {meta?.location?.name ? ` • ${meta.location.name}` : ""}
          {meta?.workType?.name ? ` • ${meta.workType.name}` : ""}
        </p>
        <h2 style={{ marginTop: 24, fontSize: 16, fontWeight: 600 }}>
          Abstract
        </h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: theme.card,
            border: `1px solid ${theme.border}`,
            padding: 12,
            borderRadius: 8,
          }}
        >
          {ad.abstract}
        </pre>
          {ad.content_preview && (
          <>
            <h2 style={{ marginTop: 24, fontSize: 16, fontWeight: 600 }}>
              Summary
            </h2>
            <p style={{ color: theme.text, lineHeight: 1.5 }}>
              {ad.content_preview}
            </p>
          </>
          )}
      </main>
    );
  }