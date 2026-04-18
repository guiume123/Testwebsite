const PLACEHOLDER_IMAGE = '/placeholder.jpg';

function isAllowedImagePath(path: string): boolean {
  return path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://');
}

export function toSafeImageUrl(value?: string | null): string {
  const raw = (value ?? '').trim();

  if (!raw || !isAllowedImagePath(raw)) {
    return PLACEHOLDER_IMAGE;
  }

  try {
    // Decode first to avoid double-encoding existing escaped URLs, then encode safely.
    return encodeURI(decodeURI(raw));
  } catch {
    try {
      return encodeURI(raw);
    } catch {
      return PLACEHOLDER_IMAGE;
    }
  }
}