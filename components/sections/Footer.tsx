import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { SCHOOL_CONFIG, CURRENT_YEAR } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{SCHOOL_CONFIG.SCHOOL_NAME}</h3>
            <p className="text-blue-200 mb-4 max-w-md">
              {SCHOOL_CONFIG.MOTTO} - Committed to providing excellent education and nurturing young minds for a brighter future.
            </p>
            <div className="space-y-2 text-blue-200">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{SCHOOL_CONFIG.CONTACT.ADDRESS}, {SCHOOL_CONFIG.CONTACT.CITY}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{SCHOOL_CONFIG.CONTACT.PHONE}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{SCHOOL_CONFIG.CONTACT.EMAIL}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {SCHOOL_CONFIG.NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/programs/early-years" className="hover:text-white transition-colors">Early Years</Link></li>
              <li><Link href="/programs/primary" className="hover:text-white transition-colors">Primary Level</Link></li>
              <li><Link href="/programs/secondary" className="hover:text-white transition-colors">Secondary Level</Link></li>
              <li><Link href="/programs/higher-secondary" className="hover:text-white transition-colors">Higher Secondary</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-blue-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-200 text-sm mb-4 md:mb-0">
              © {CURRENT_YEAR} {SCHOOL_CONFIG.SCHOOL_NAME}. All rights reserved.
            </div>
            
            <div className="flex space-x-4">
              <a 
                href={SCHOOL_CONFIG.SOCIAL.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={SCHOOL_CONFIG.SOCIAL.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={SCHOOL_CONFIG.SOCIAL.TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={SCHOOL_CONFIG.SOCIAL.YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}