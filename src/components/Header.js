'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/ContactForm';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm"
    >
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo1.png"
            alt="Cloudwise Logo"
            width={150}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <Link href="/services" className="text-[#1B1D1B] hover:text-[#FF3F1A] transition-colors">
            Services
          </Link>
          <Link href="/about" className="text-[#1B1D1B] hover:text-[#FF3F1A] transition-colors">
            About
          </Link>
          <Link href="/portfolio" className="text-[#1B1D1B] hover:text-[#FF3F1A] transition-colors">
            Portfolio
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF3F1A] hover:bg-[#FF3F1A]/90"
          >
            Talk to Us
          </Button>
        </div>
      </div>

      <ContactForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </motion.header>
  );
}
