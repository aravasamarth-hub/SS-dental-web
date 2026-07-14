import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DarkModeToggle from './DarkModeToggle';

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

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutLinks = [
    { name: 'Dr. Naveen Shamnur MDS', path: '/doctors/naveen-shamnur' },
    { name: 'Dr. Sunitha N Shamnur MDS', path: '/doctors/sunitha-shamnur' },
  ];

  const serviceLinks = [
    { name: 'Teeth Whitening', path: '/services/teeth-whitening' },
    { name: 'Veneers', path: '/services/veneers' },
    { name: 'Dental Implants', path: '/services/dental-implants' },
    { name: 'Cavity Filling', path: '/services/cavity-filling' },
    { name: 'Digital Dentures', path: '/services/digital-dentures' },
    { name: 'Broken Teeth', path: '/services/broken-teeth' },
    { name: 'Aligners', path: '/services/aligners' },
    { name: 'Smile Design', path: '/services/smile-design' },
    { name: 'Orthodontic Treatment', path: '/services/orthodontic-treatment' },
    { name: 'Orthodontic Surgery', path: '/services/orthodontic-surgery' },
    { name: 'Full Mouth Implant', path: '/services/full-mouth-implant' },
    { name: 'Pterygoid & Zygomatic Implant', path: '/services/pterygoid-zygomatic-implant' },
    { name: 'Laser Dental Treatment', path: '/services/laser-dental-treatment' },
    { name: 'Extraction', path: '/services/extraction' },
    { name: 'Gum Therapy', path: '/services/gum-therapy' },
  ];

  const isActive = (path) => location.pathname === path;
  
  const isAboutActive = () =>
    location.pathname === '/about' ||
    aboutLinks.some((link) => location.pathname === link.path);
    
  const isServicesActive = () =>
    serviceLinks.some((link) => location.pathname === link.path);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80' : 'bg-background'
      }`}
    >
      {/* Top Bar for Desktop and Tablet */}
      <div className="bg-accent text-accent-foreground py-3.5 hidden md:block transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="tel:+919448455699"
              className="flex items-center gap-2 hover:opacity-90 font-bold tracking-wide transition-opacity text-base md:text-lg"
            >
              <Phone className="h-5 w-5" strokeWidth={2.5} />
              <span>+91 94484 55699</span>
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="tel:+919448455699"
              className="hover:opacity-85 transition-opacity"
              aria-label="Call Us"
            >
              <Phone className="h-6 w-6" strokeWidth={2.5} />
            </a>
            <a
              href="https://wa.me/919448455699"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com/ssdentalcare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" strokeWidth={2.5} />
            </a>
            <a
              href="https://youtube.com/@ssdentalcare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity"
              aria-label="YouTube"
            >
              <Youtube className="h-6 w-6" strokeWidth={2.5} />
            </a>
            <a
              href="https://facebook.com/ssdentalcare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/38c4b0b05acaa72021a2d891747924f2.jpg"
              alt="SS Dental Care logo"
              className="h-12 w-12 rounded-lg object-cover"
            />
            <span className="font-extrabold text-xl md:text-2xl tracking-tight hidden sm:inline">SS Dental Care</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            {/* 1. Home */}
            <Link
              to="/"
              className={`text-base font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'text-accent scale-110 -translate-y-0.5 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                  : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full hover:-translate-y-0.5'
              }`}
            >
              Home
            </Link>

            {/* 2. About Us */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center gap-1.5 text-base font-semibold transition-all duration-300 focus:outline-none ${
                  isAboutActive() 
                    ? 'text-accent scale-110 -translate-y-0.5 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                    : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full hover:-translate-y-0.5'
                }`}
              >
                About Us
                <ChevronDown className="h-4.5 w-4.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="w-full cursor-pointer">
                    About SS Dental Care
                  </Link>
                </DropdownMenuItem>
                {aboutLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="w-full cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Service */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center gap-1.5 text-base font-semibold transition-all duration-300 focus:outline-none ${
                  isServicesActive() 
                    ? 'text-accent scale-110 -translate-y-0.5 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                    : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full hover:-translate-y-0.5'
                }`}
              >
                Service
                <ChevronDown className="h-4.5 w-4.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-96 overflow-y-auto">
                {serviceLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="w-full cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 4. Gallery */}
            <Link
              to="/gallery"
              className={`text-base font-semibold transition-all duration-300 ${
                isActive('/gallery') 
                  ? 'text-accent scale-110 -translate-y-0.5 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                  : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full hover:-translate-y-0.5'
              }`}
            >
              Gallery
            </Link>

            {/* 5. Contact Us */}
            <Link
              to="/contact"
              className={`text-base font-semibold transition-all duration-300 ${
                isActive('/contact') 
                  ? 'text-accent scale-110 -translate-y-0.5 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                  : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full hover:-translate-y-0.5'
              }`}
            >
              Contact Us
            </Link>

            {/* 6. Location */}
            <Link
              to="/location"
              className={`text-base font-semibold transition-all duration-300 ${
                isActive('/location') 
                  ? 'text-accent scale-110 -translate-y-0.5 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                  : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full hover:-translate-y-0.5'
              }`}
            >
              Location
            </Link>

            {/* 7. Blog */}
            <Link
              to="/blog"
              className={`text-base font-semibold transition-all duration-300 ${
                isActive('/blog') 
                  ? 'text-accent scale-110 -translate-y-0.5 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                  : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full hover:-translate-y-0.5'
              }`}
            >
              Blog
            </Link>

            {/* 8. Book Appointment */}
            <Link to="/bookings">
              <Button variant="accent" className="text-base font-semibold h-11 px-6 transition-all duration-200 active:scale-98">
                Book Appointment
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <DarkModeToggle />
            
            {/* Mobile Sheet Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 flex flex-col h-full">
                <nav className="flex flex-col gap-4 mt-8 flex-1 overflow-y-auto pr-2">
                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 transition-all duration-200 hover:text-accent ${
                      isActive('/') ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    Home
                  </Link>

                  {/* About Us (Collapsible) */}
                  <div className="flex flex-col py-2 border-t border-muted">
                    <button
                      onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                      className="flex items-center justify-between text-sm font-medium transition-all duration-200 hover:text-accent text-left"
                    >
                      <span>About Us</span>
                      <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isMobileAboutOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileAboutOpen && (
                      <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-muted">
                        <Link
                          to="/about"
                          onClick={() => setIsOpen(false)}
                          className={`text-sm py-1 hover:text-accent transition-colors ${isActive('/about') ? 'text-accent' : 'text-muted-foreground'}`}
                        >
                          About SS Dental Care
                        </Link>
                        {aboutLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-sm py-1 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Service (Collapsible) */}
                  <div className="flex flex-col py-2 border-t border-muted">
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className="flex items-center justify-between text-sm font-medium transition-all duration-200 hover:text-accent text-left"
                    >
                      <span>Service</span>
                      <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileServicesOpen && (
                      <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-muted max-h-60 overflow-y-auto">
                        {serviceLinks.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-sm py-1 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Gallery */}
                  <Link
                    to="/gallery"
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 border-t border-muted transition-all duration-200 hover:text-accent ${
                      isActive('/gallery') ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    Gallery
                  </Link>

                  {/* Contact Us */}
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 border-t border-muted transition-all duration-200 hover:text-accent ${
                      isActive('/contact') ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    Contact Us
                  </Link>

                  {/* Location */}
                  <Link
                    to="/location"
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 border-t border-muted transition-all duration-200 hover:text-accent ${
                      isActive('/location') ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    Location
                  </Link>

                  {/* Blog */}
                  <Link
                    to="/blog"
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 border-t border-muted transition-all duration-200 hover:text-accent ${
                      isActive('/blog') ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    Blog
                  </Link>

                  {/* Book Appointment Button */}
                  <Link to="/bookings" onClick={() => setIsOpen(false)} className="border-t border-muted pt-4">
                    <Button variant="accent" className="w-full transition-all duration-200 active:scale-98">
                      Book Appointment
                    </Button>
                  </Link>
                </nav>

                {/* Social media icons at the bottom of drawer */}
                <div className="border-t pt-6 pb-4 mt-auto flex justify-center gap-4">
                  <a
                    href="tel:+919448455699"
                    className="w-10 h-10 rounded-full border border-muted hover:border-accent hover:text-accent flex items-center justify-center transition-all duration-200 active:scale-95 text-foreground"
                    aria-label="Call"
                  >
                    <Phone className="h-5 w-5" strokeWidth={2.5} />
                  </a>
                  <a
                    href="https://wa.me/919448455699"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-muted hover:border-accent hover:text-accent flex items-center justify-center transition-all duration-200 active:scale-95 text-foreground"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="https://instagram.com/ssdentalcare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-muted hover:border-accent hover:text-accent flex items-center justify-center transition-all duration-200 active:scale-95 text-foreground"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" strokeWidth={2.5} />
                  </a>
                  <a
                    href="https://youtube.com/@ssdentalcare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-muted hover:border-accent hover:text-accent flex items-center justify-center transition-all duration-200 active:scale-95 text-foreground"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" strokeWidth={2.5} />
                  </a>
                  <a
                    href="https://facebook.com/ssdentalcare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-muted hover:border-accent hover:text-accent flex items-center justify-center transition-all duration-200 active:scale-95 text-foreground"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" strokeWidth={2.5} />
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
