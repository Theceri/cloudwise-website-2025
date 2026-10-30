import { Cinzel, Cormorant_Garamond, Pinyon_Script } from 'next/font/google';

/**
 * The certificate's own typefaces. A classic certificate reads as one because
 * of its type: engraved capitals for the title, a book serif for the wording,
 * and a script for the name and the signature. They load only on the pages
 * that show a certificate.
 */
export const certTitle = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--cert-title',
});

export const certSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--cert-serif',
});

export const certScript = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--cert-script',
});

export const certFontVars = `${certTitle.variable} ${certSerif.variable} ${certScript.variable}`;
