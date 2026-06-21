
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cancellation Policy', path: '/cancellation' },
    { name: 'Refund Policy', path: '/refund' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/ssdentalcare' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/ssdentalcare' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@ssdentalcare' },
    { name: 'Phone', icon: Phone, url: 'tel:+919448455699' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/38c4b0b05acaa72021a2d891747924f2.jpg"
                alt="SS Dental Care logo"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <span className="font-bold text-xl">SS Dental Care</span>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Trusted dental care in Davangere since 2014. Advanced technology, experienced doctors, and patient-centered approach.
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Quick Links</span>
            <div className="flex flex-col gap-2">
              {policyLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Connect With Us</span>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-200 active:scale-95"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <div className="mt-4">
              <p className="text-sm opacity-90">Email: ssdentalcare.in@gmail.com</p>
              <p className="text-sm opacity-90">Phone: +91 9448455699</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6">
          <p className="text-center text-sm opacity-80">
            © {currentYear} SS Dental Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
