"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");

  async function submit() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pastes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Create Paste</h1>

      <textarea
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div>
        <input
          placeholder="TTL seconds"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
        <input
          placeholder="Max views"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />
      </div>

      <button onClick={submit}>Create</button>

      {url && (
        <p>
          Share URL: <a href={url}>{url}</a>
        </p>
      )}
    </main>
  );
}
