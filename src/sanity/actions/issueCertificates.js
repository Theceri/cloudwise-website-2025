import { useState } from 'react';
import { useClient } from 'sanity';
import { useToast } from '@sanity/ui';
import { CheckmarkCircleIcon } from '@sanity/icons';

import { apiVersion } from '../env';

/**
 * Studio buttons on a training booking: "Issue certificate" for this person,
 * and "Issue certificates for this class" for every paid booking on the same
 * class and course.
 *
 * The Studio marks the bookings (certificateRequestedAt), then asks the site
 * to issue them. The site issues only for bookings marked in the last 30
 * minutes, so no secret is needed in the browser: only someone who can edit
 * bookings in the Studio can mark one. Issuing twice is safe; a booking that
 * already has a certificate is skipped.
 */

const CERTIFICATE_TRACKS = ['essentials', 'individual'];

function useIssue({ doc, onComplete, wholeClass }) {
  const client = useClient({ apiVersion });
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const bookings = wholeClass
        ? await client.fetch(
            `*[_type == "trainingRegistration" && cohortId == $cohortId && track == $track
               && status == "paid" && !(_id in path("drafts.**"))]{ _id, reference }`,
            { cohortId: doc.cohortId, track: doc.track }
          )
        : [{ _id: doc._id.replace(/^drafts\./, ''), reference: doc.reference }];

      if (!bookings.length) {
        toast.push({ status: 'warning', title: 'No paid bookings found for this class.' });
        return;
      }

      const now = new Date().toISOString();
      const tx = client.transaction();
      bookings.forEach((b) => tx.patch(b._id, (p) => p.set({ certificateRequestedAt: now })));
      await tx.commit();

      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ references: bookings.map((b) => b.reference) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `The site answered ${res.status}.`);

      const issued = data.results?.filter((r) => r.issued) || [];
      const skipped = data.results?.filter((r) => !r.issued) || [];
      toast.push({
        status: issued.length ? 'success' : 'info',
        title: `${issued.length} certificate${issued.length === 1 ? '' : 's'} issued and emailed`,
        description: skipped.length
          ? `Skipped ${skipped.length}: ${skipped.map((r) => `${r.reference} (${r.reason})`).join(', ')}`
          : undefined,
        duration: 10000,
      });
    } catch (err) {
      toast.push({ status: 'error', title: 'Certificates were not issued', description: err.message, duration: 10000 });
    } finally {
      setBusy(false);
      onComplete();
    }
  };

  return { busy, run };
}

function eligible(doc) {
  return doc && CERTIFICATE_TRACKS.includes(doc.track) && doc.status === 'paid';
}

export function IssueCertificateAction({ published, draft, onComplete }) {
  const doc = published || draft;
  const { busy, run } = useIssue({ doc, onComplete, wholeClass: false });
  if (!doc || !CERTIFICATE_TRACKS.includes(doc.track)) return null;
  return {
    label: busy ? 'Issuing…' : 'Issue certificate',
    icon: CheckmarkCircleIcon,
    disabled: busy || !eligible(doc),
    title: eligible(doc) ? 'Create the certificate and email it to this person' : 'Only paid bookings get a certificate',
    onHandle: run,
  };
}

export function IssueClassCertificatesAction({ published, draft, onComplete }) {
  const doc = published || draft;
  const [confirming, setConfirming] = useState(false);
  const { busy, run } = useIssue({ doc, onComplete, wholeClass: true });
  if (!doc || !CERTIFICATE_TRACKS.includes(doc.track) || !doc.cohortId) return null;
  return {
    label: busy ? 'Issuing…' : 'Issue certificates for this class',
    icon: CheckmarkCircleIcon,
    disabled: busy,
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: 'confirm',
      message: `Issue and email a certificate to every paid booking on this class (${doc.cohortLabel || doc.cohortId})? Bookings that already have one are skipped.`,
      onCancel: () => {
        setConfirming(false);
        onComplete();
      },
      onConfirm: () => {
        setConfirming(false);
        run();
      },
    },
  };
}
