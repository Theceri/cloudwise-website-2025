'use client';

import { Download } from 'lucide-react';

/**
 * Save or print the certificate. The browser's print dialog offers "Save as
 * PDF" on every phone and computer, and the print styles in globals.css leave
 * only the certificate on one A4 landscape page.
 */
export function PrintButton({ className = '' }) {
  return (
    <button type="button" onClick={() => window.print()} className={`btn-ember text-base ${className}`}>
      <Download size={18} /> Download or print (PDF)
    </button>
  );
}
