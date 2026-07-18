import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone } from 'lucide-react';

// Custom WhatsApp SVG Icon
const WhatsAppIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

function Footer() {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cancellation Policy', path: '/cancellation' },
    { name: 'Refund Policy', path: '/refund' },
  ];

  const socialLinks = [
    { name: 'Call', icon: Phone, url: 'tel:+919448455699' },
    { name: 'WhatsApp', icon: WhatsAppIcon, url: 'https://wa.me/919448455699' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/ssdentalcare' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@ssdentalcare' },
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/ssdentalcare' },
  ];

  return (
    <footer className="bg-[#0d121f] border-t-4 border-accent text-white mt-20 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/38c4b0b05acaa72021a2d891747924f2.jpg"
                alt="SS Dental Care logo"
                className="h-12 w-12 rounded-lg object-cover border border-accent/20"
              />
              <span className="font-bold text-xl tracking-tight">SS Dental Care</span>
            </div>
            <p className="text-sm opacity-85 leading-relaxed">
              Trusted dental care in Davangere since 2014. Advanced technology, experienced doctors, and patient-centered approach.
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block text-accent">Quick Links</span>
            <div className="flex flex-col gap-2">
              {policyLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm opacity-80 hover:opacity-100 hover:text-accent hover:underline transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block text-accent">Connect With Us</span>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-accent text-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-200 active:scale-95"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </a>
                );
              })}
            </div>
            <div className="mt-6 space-y-1.5 border-t border-white/10 pt-4">
              <p className="text-sm opacity-80">
                <span className="font-medium text-accent">Email:</span> <a href="mailto:ssdentalcare.in@gmail.com" className="hover:text-accent hover:underline transition-all">ssdentalcare.in@gmail.com</a>
              </p>
              <p className="text-sm opacity-80">
                <span className="font-medium text-accent">Phone:</span> <a href="tel:+919448455699" className="hover:text-accent hover:underline transition-all">+91 94484 55699</a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-center text-sm opacity-70">
            © {currentYear} SS Dental Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
