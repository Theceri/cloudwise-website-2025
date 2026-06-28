// Shared helpers for Portable Text rendering + table of contents.

export function slugifyHeading(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Extract the plain text of a block's children.
export function blockText(block) {
  if (!block?.children) return '';
  return block.children.map((c) => c.text || '').join('');
}

// Build a flat list of h2/h3 headings for the table of contents.
export function extractHeadings(body = []) {
  return body
    .filter((b) => b._type === 'block' && (b.style === 'h2' || b.style === 'h3'))
    .map((b) => {
      const text = blockText(b);
      return { text, id: slugifyHeading(text), level: b.style === 'h2' ? 2 : 3 };
    })
    .filter((h) => h.text);
}

// Convert a YouTube URL to an embed URL.
export function youTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
