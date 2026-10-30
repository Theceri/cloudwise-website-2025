import { CERTIFICATE_ISSUER } from '@/lib/constants';
import {
  certificateCourse,
  certificateDate,
  certificateKindLabel,
  verifyUrlShort,
} from '@/lib/certificate-shared';

import { certFontVars } from './fonts';
import styles from './Certificate.module.css';

/**
 * The certificate itself, drawn as a classic printed certificate: cream paper
 * with a fine guilloche, a double frame, engraved capitals, the name in script,
 * a signature, a seal and the verification code with a QR code.
 *
 * Everything is sized in container units, so the same certificate is legible
 * on a phone, fills a laptop screen and prints on one A4 landscape page.
 *
 * `qrSvg` is the QR code as an SVG string, made on the server (see
 * src/lib/qr.js). `sample` adds a SAMPLE watermark for the marketing pages.
 */
export function Certificate({ certificate, qrSvg, sample = false, className = '' }) {
  const course = certificateCourse(certificate);
  const kind = certificateKindLabel(certificate.kind);
  const [kindLead, kindRest] = splitKind(kind);
  const date = certificateDate(certificate);

  return (
    <figure
      data-certificate
      className={`${styles.sheet} ${certFontVars} ${className}`}
      aria-label={`${kind}: ${course.name}, awarded to ${certificate.name}`}
    >
      <div className={styles.paper}>
        <div className={styles.frameOuter}>
          <div className={styles.frameInner}>
            <Corner className={`${styles.corner} ${styles.tl}`} />
            <Corner className={`${styles.corner} ${styles.tr}`} />
            <Corner className={`${styles.corner} ${styles.bl}`} />
            <Corner className={`${styles.corner} ${styles.br}`} />

            <div className={styles.content}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cloudwise-logo-light.png" alt="Cloudwise" className={styles.logo} />

              <p className={styles.title}>{kindLead}</p>
              <p className={styles.subtitle}>
                <span className={styles.rule} aria-hidden="true" />
                {kindRest}
                <span className={styles.rule} aria-hidden="true" />
              </p>

              <p className={styles.presented}>This is to certify that</p>
              <p className={styles.name}>{certificate.name}</p>
              <p className={styles.presented}>has successfully completed</p>
              <p className={styles.course}>{course.name}</p>
              {course.summary && (
                <p className={styles.summary}>
                  {capitalise(course.summary)}
                  {course.hours ? `. ${course.hours} hours of live, hands-on training.` : '.'}
                </p>
              )}

              <div className={styles.footer}>
                <div className={styles.sign}>
                  <span className={styles.signature}>Paul Theceri</span>
                  <span className={styles.line} />
                  <span className={styles.signName}>{CERTIFICATE_ISSUER.signatory}</span>
                  <span className={styles.signRole}>{CERTIFICATE_ISSUER.signatoryTitle}</span>
                </div>
                <Seal className={styles.seal} year={(certificate.classDate || '').slice(0, 4)} />
                <div className={styles.sign}>
                  <span className={styles.dateValue}>{date}</span>
                  <span className={styles.line} />
                  <span className={styles.signName}>Date of completion</span>
                  <span className={styles.signRole}>
                    {CERTIFICATE_ISSUER.name} · Nairobi, Kenya
                  </span>
                </div>
              </div>

              <div className={styles.meta}>
                <span>
                  Certificate ID <strong>{certificate.code}</strong>
                </span>
                <span className={styles.dot} aria-hidden="true">◆</span>
                <span>Verify at {verifyUrlShort(certificate.code)}</span>
              </div>
            </div>

            {qrSvg && (
              <div
                className={styles.qr}
                aria-label="QR code that opens this certificate's verification page"
                // The SVG is generated on the server from the certificate code only.
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            )}
          </div>
        </div>
        {sample && (
          <span className={styles.watermark} aria-hidden="true">
            Sample
          </span>
        )}
      </div>
    </figure>
  );
}

function splitKind(kind) {
  // "Certificate of Completion" → ["Certificate", "of Completion"]
  const [first, ...rest] = kind.split(' ');
  return [first, rest.join(' ')];
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** A flourish for each corner of the inner frame, drawn once and rotated by CSS. */
function Corner({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M3 117 V34 Q3 3 34 3 H117" fill="none" stroke="#447980" strokeWidth="2.4" />
      <path d="M11 117 V40 Q11 11 40 11 H117" fill="none" stroke="#FF3F1A" strokeWidth="1.2" />
      <path d="M19 92 V46 Q19 19 46 19 H92" fill="none" stroke="#447980" strokeWidth="0.8" strokeDasharray="2 3" />
      <path d="M26 74 C26 44 44 26 74 26 C56 33 47 41 42 50 C37 59 32 66 26 74 Z" fill="#97D6DF" opacity="0.7" />
      <path d="M30 58 C34 44 44 34 58 30" fill="none" stroke="#447980" strokeWidth="1" />
      <path d="M40 100 C40 86 32 80 26 80 M100 40 C86 40 80 32 80 26" fill="none" stroke="#447980" strokeWidth="1" />
      <rect x="6.5" y="6.5" width="9" height="9" transform="rotate(45 11 11)" fill="#FF3F1A" />
      <circle cx="11" cy="11" r="2" fill="#FBF7EE" />
      <circle cx="117" cy="11" r="2.2" fill="#FF3F1A" />
      <circle cx="11" cy="117" r="2.2" fill="#FF3F1A" />
    </svg>
  );
}

/** The seal: a scalloped ember rosette, an engraved ring of words and teal ribbons. */
function Seal({ className, year }) {
  const points = 48;
  const outer = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? 50 : 45.5;
    const a = (Math.PI * i) / points - Math.PI / 2;
    outer.push(`${(60 + r * Math.cos(a)).toFixed(2)},${(60 + r * Math.sin(a)).toFixed(2)}`);
  }

  return (
    <svg className={className} viewBox="0 0 120 150" role="img" aria-label="Cloudwise seal">
      <path d="M38 96 L26 146 L42 136 L50 150 L58 100 Z" fill="#447980" />
      <path d="M82 96 L94 146 L78 136 L70 150 L62 100 Z" fill="#2E565B" />
      <path d="M44 100 L36 136 M76 100 L84 136" stroke="#97D6DF" strokeWidth="1.4" />
      <polygon points={outer.join(' ')} fill="#FF3F1A" />
      <circle cx="60" cy="60" r="41" fill="#1B1D1B" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#97D6DF" strokeWidth="0.8" />
      <circle cx="60" cy="60" r="26" fill="none" stroke="#97D6DF" strokeWidth="0.8" />
      <defs>
        <path id="seal-ring" d="M60 60 m-32 0 a32 32 0 1 1 64 0 a32 32 0 1 1 -64 0" />
      </defs>
      <text fill="#FBF7EE" fontSize="7.4" letterSpacing="1.6" fontFamily="var(--cert-title), serif" fontWeight="700">
        <textPath href="#seal-ring" startOffset="0">
          CLOUDWISE TECHNOLOGIES ★ NAIROBI ★ VERIFIED ★
        </textPath>
      </text>
      <path
        d="M60 42 L64.6 54.4 L77.8 54.9 L67.4 63 L71 75.7 L60 68.3 L49 75.7 L52.6 63 L42.2 54.9 L55.4 54.4 Z"
        fill="#FF3F1A"
      />
      {year && (
        <text x="60" y="84" textAnchor="middle" fill="#97D6DF" fontSize="6.5" letterSpacing="1.2" fontFamily="var(--cert-title), serif">
          {year}
        </text>
      )}
    </svg>
  );
}
