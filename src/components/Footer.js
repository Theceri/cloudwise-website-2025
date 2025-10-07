'use client';

import Link from 'next/link';
import { NAVIGATION_LINKS, COMPANY_INFO } from '@/lib/constants';
import { Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1B1D1B] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#97D6DF]">Cloudwise</h3>
            <p className="text-gray-400">
              Unleash the power of digital transformation to elevate your business!
            </p>
            <div className="space-y-2">
              <a 
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center space-x-2 text-gray-400 hover:text-[#447980]"
              >
                <Phone size={18} />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <a 
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center space-x-2 text-gray-400 hover:text-[#447980]"
              >
                <Mail size={18} />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#97D6DF]">Quick Links</h4>
            <ul className="space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-[#FF3F1A]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#97D6DF]">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services#ai" className="text-gray-400 hover:text-[#FF3F1A]">
                  AI Development
                </Link>
              </li>
              <li>
                <Link href="/services#web" className="text-gray-400 hover:text-[#FF3F1A]">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services#mobile" className="text-gray-400 hover:text-[#FF3F1A]">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link href="/services#ecommerce" className="text-gray-400 hover:text-[#FF3F1A]">
                  E-commerce Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#97D6DF]">Our Impact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#447980]/20 rounded-lg">
                <div className="text-2xl font-bold text-[#97D6DF]">
                  {COMPANY_INFO.stats.projectsDone}+
                </div>
                <div className="text-sm text-gray-300">Projects</div>
              </div>
              <div className="text-center p-4 bg-[#447980]/20 rounded-lg">
                <div className="text-2xl font-bold text-[#97D6DF]">
                  {COMPANY_INFO.stats.happyCustomers}
                </div>
                <div className="text-sm text-gray-300">Happy Clients</div>
              </div>
              <div className="text-center p-4 bg-[#447980]/20 rounded-lg col-span-2">
                <div className="text-2xl font-bold text-[#97D6DF]">
                  {COMPANY_INFO.stats.countries}
                </div>
                <div className="text-sm text-gray-300">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Cloudwise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
