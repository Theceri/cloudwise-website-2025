import 'server-only';

import QRCode from 'qrcode';

/**
 * A QR code as an SVG string, drawn on the server. Used on certificates, where
 * it opens the verification page, so a printed certificate can be checked with
 * a phone camera.
 */
export async function qrSvg(text) {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      margin: 0,
      errorCorrectionLevel: 'M',
      color: { dark: '#1B1D1B', light: '#FFFFFF' },
    });
  } catch (err) {
    console.error('[qr] not drawn:', err?.message);
    return null;
  }
}
