import { SITE_URL } from '@/lib/constants';

/**
 * The origin payment providers should call back on.
 *
 * In production this is the live site. In development Daraja, Paystack and
 * SasaPay cannot reach localhost, so you run a tunnel (ngrok / cloudflared) and
 * set PUBLIC_BASE_URL to its https address — every callback URL we build
 * follows automatically.
 */
export function publicBaseUrl() {
  const explicit = process.env.PUBLIC_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  // Vercel sets this on preview deployments, where there is no custom domain.
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return SITE_URL;
}

export function callbackUrl(path) {
  return `${publicBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}
