// utils/urlHelpers.js
export function ensureAbsoluteUrl(url, base = process.env.NEXT_PUBLIC_SITE_URL) {
  if (!url) return base;
  
  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Relative URL - prepend base
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${cleanBase}${cleanUrl}`;
}