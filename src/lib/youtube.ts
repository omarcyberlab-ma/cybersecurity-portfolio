export function parseYouTubeId(url?: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.searchParams.has('v')) return u.searchParams.get('v');
    const match = url.match(/(?:embed|shorts)\/([A-Za-z0-9_-]{6,12})/);
    return match ? match[1] : null;
  } catch (e) { return null; }
}

export function youtubeEmbedUrl(url?: string | null) {
  const id = parseYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
