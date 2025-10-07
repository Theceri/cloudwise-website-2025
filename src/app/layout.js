import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from 'sonner';
import { WhatsAppButton } from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cloudwise - Digital Solutions for Modern Businesses',
  description: 'Transform your business with cutting-edge digital solutions. We specialize in AI development, web applications, mobile apps, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-dot-pattern bg-dot-lg bg-brand-primary/5`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" />
        <WhatsAppButton phoneNumber="+254712658775" />
      </body>
    </html>
  );
}
