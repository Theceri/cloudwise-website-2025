import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { getCertificate } from '@/lib/certificates';
import {
  SAMPLE_CODE,
  certificateCourse,
  certificateDate,
  certificateKindLabel,
  sampleCertificate,
} from '@/lib/certificate-shared';
import { CERTIFICATE_ISSUER } from '@/lib/constants';

export const runtime = 'nodejs';
export const alt = 'A Cloudwise training certificate';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#1B1D1B';
const EMBER = '#FF3F1A';
const AQUA = '#97D6DF';
const TEAL = '#447980';
const CREAM = '#FBF7EE';

/**
 * The share card for a certificate page. When a holder posts their
 * certificate link on LinkedIn or WhatsApp, the preview is the certificate,
 * not a generic site banner.
 */
export default async function Image({ params }) {
  const code = String((await params).code || '').toUpperCase();
  const certificate =
    code === SAMPLE_CODE ? sampleCertificate() : await getCertificate(code).catch(() => null);
  const valid = certificate && !certificate.revoked;

  const logo = await readFile(join(process.cwd(), 'public', 'cloudwise-logo-light.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  const course = valid ? certificateCourse(certificate) : null;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: INK, padding: 18 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            background: CREAM,
            border: `3px solid ${EMBER}`,
            padding: 14,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: `2px solid ${TEAL}`,
              padding: '26px 60px 22px',
              position: 'relative',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={132} height={70} alt="" />
            {valid ? (
              <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginTop: 10, fontSize: 64, fontWeight: 700, letterSpacing: 10, color: INK }}>
                  CERTIFICATE
                </div>
                <div style={{ marginTop: 2, fontSize: 24, letterSpacing: 8, color: EMBER }}>
                  {certificateKindLabel(certificate.kind).replace(/^Certificate /, '').toUpperCase()}
                </div>
                <div style={{ marginTop: 18, fontSize: 22, fontStyle: 'italic', color: TEAL }}>awarded to</div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 60,
                    fontWeight: 700,
                    color: INK,
                    borderBottom: `2px solid ${TEAL}`,
                    padding: '0 30px 6px',
                  }}
                >
                  {certificate.name}
                </div>
                <div style={{ marginTop: 16, fontSize: 34, fontWeight: 700, color: INK }}>
                  {`${course.name}${course.hours ? ` · ${course.hours} hours` : ''}`}
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: TEAL }}>
                  <div
                    style={{
                      display: 'flex',
                      background: AQUA,
                      color: INK,
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 999,
                    }}
                  >
                    VERIFIED
                  </div>
                  <div style={{ display: 'flex' }}>
                    {`${CERTIFICATE_ISSUER.name} · ${certificateDate(certificate)} · ${certificate.code}`}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 60, fontSize: 52, fontWeight: 700, color: INK }}>Verify a certificate</div>
            )}
          </div>
        </div>
      </div>
    ),
    size
  );
}
