import React, { useEffect, useState, useRef } from 'react';
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutLocked, setIsAboutLocked] = useState(false);
  const [isServicesLocked, setIsServicesLocked] = useState(false);
  
  const aboutTimeoutRef = useRef(null);
  const servicesTimeoutRef = useRef(null);
  const location = useLocation();

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setIsAboutOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      if (!isAboutLocked) {
        setIsAboutOpen(false);
      }
    }, 200);
  };

  const handleAboutClick = () => {
    setIsAboutLocked(!isAboutLocked);
    setIsAboutOpen(!isAboutOpen);
  };

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      if (!isServicesLocked) {
        setIsServicesOpen(false);
      }
    }, 200);
  };

  const handleServicesClick = () => {
    setIsServicesLocked(!isServicesLocked);
    setIsServicesOpen(!isServicesOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsAboutOpen(false);
        setIsServicesOpen(false);
        setIsAboutLocked(false);
        setIsServicesLocked(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setIsAboutOpen(false);
    setIsServicesOpen(false);
    setIsAboutLocked(false);
    setIsServicesLocked(false);
  }, [location.pathname]);

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
      {/* Top Bar - shown on ALL screen sizes */}
      <div className="bg-accent text-accent-foreground py-2 md:py-3.5 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <a
              href="tel:+919448455699"
              className="flex items-center gap-1.5 hover:text-[#008cd2] font-bold tracking-wide transition-colors duration-300 text-sm md:text-lg"
            >
              <Phone className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
              <span>+91 94484 55699</span>
            </a>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <a
              href="tel:+919448455699"
              className="hover:text-[#008cd2] transition-colors duration-300"
              aria-label="Call Us"
            >
              <Phone className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.5} />
            </a>
            <a
              href="https://wa.me/919448455699"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4 md:h-6 md:w-6" />
            </a>
            <a
              href="https://instagram.com/ssdentalcare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E1306C] transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.5} />
            </a>
            <a
              href="https://youtube.com/@ssdentalcare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF0000] transition-colors duration-300"
              aria-label="YouTube"
            >
              <Youtube className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.5} />
            </a>
            <a
              href="https://facebook.com/ssdentalcare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1877F2] transition-colors duration-300"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.5} />
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
            <div 
              className="relative dropdown-container"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <Link
                to="/about"
                onClick={handleAboutClick}
                className={`flex items-center gap-1.5 text-base font-semibold transition-all duration-300 focus:outline-none ${
                  isAboutActive() 
                    ? 'text-accent scale-105 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                    : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full'
                }`}
              >
                About Us
                <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
              </Link>
              {/* About Us dropdown wrapper (bridge for gap-of-death) */}
              <div className={`absolute left-0 top-full pt-2 w-72 transition-all duration-200 origin-top-left z-50 ${
                isAboutOpen 
                  ? 'opacity-100 scale-100 pointer-events-auto' 
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}>
                {/* Visual Panel */}
                <div className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground font-medium"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Service (Mega Dropdown in Liquid Glass style) */}
            <div 
              className="relative dropdown-container"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <Link
                to="/services"
                onClick={handleServicesClick}
                className={`flex items-center gap-1.5 text-base font-semibold transition-all duration-300 focus:outline-none ${
                  isServicesActive() 
                    ? 'text-accent scale-105 bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20 shadow-sm' 
                    : 'text-foreground hover:text-accent px-3.5 py-1.5 hover:bg-muted/50 rounded-full'
                }`}
              >
                Service
                <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </Link>
              {/* Mega Dropdown Panel Wrapper (bridge for gap-of-death) */}
              <div className={`absolute left-1/2 -translate-x-[45%] top-full pt-2 w-[calc(100vw-6rem)] max-w-5xl transition-all duration-300 origin-top z-50 ${
                isServicesOpen 
                  ? 'opacity-100 scale-100 pointer-events-auto' 
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}>
                {/* Visual Panel */}
                <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] grid grid-cols-4 gap-8">
                  {/* Column 1: Restorative & Gum */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-accent mb-3">
                        <span className="w-1.5 h-1.5 bg-accent rounded-sm" />
                        Restorative Dentistry
                      </h4>
                      <ul className="space-y-1">
                        {[{ name: 'Cavity Filling', path: '/services/cavity-filling' },
                          { name: 'Broken Teeth', path: '/services/broken-teeth' },
                          { name: 'Digital Dentures', path: '/services/digital-dentures' }].map((item) => (
                          <li key={item.path}>
                            <Link to={item.path} className="block text-sm text-muted-foreground hover:text-accent font-medium py-1.5 px-3 rounded-lg border border-transparent hover:border-white/30 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200">
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-accent mb-3">
                        <span className="w-1.5 h-1.5 bg-accent rounded-sm" />
                        Gum Treatment
                      </h4>
                      <ul className="space-y-1">
                        {[{ name: 'Gum Therapy', path: '/services/gum-therapy' },
                          { name: 'Laser Dental Treatment', path: '/services/laser-dental-treatment' }].map((item) => (
                          <li key={item.path}>
                            <Link to={item.path} className="block text-sm text-muted-foreground hover:text-accent font-medium py-1.5 px-3 rounded-lg border border-transparent hover:border-white/30 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200">
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Column 2: Orthodontics & Oral Surgery */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-accent mb-3">
                        <span className="w-1.5 h-1.5 bg-accent rounded-sm" />
                        Orthodontics
                      </h4>
                      <ul className="space-y-1">
                        {[{ name: 'Orthodontic Treatment', path: '/services/orthodontic-treatment' },
                          { name: 'Aligners', path: '/services/aligners' }].map((item) => (
                          <li key={item.path}>
                            <Link to={item.path} className="block text-sm text-muted-foreground hover:text-accent font-medium py-1.5 px-3 rounded-lg border border-transparent hover:border-white/30 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200">
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-accent mb-3">
                        <span className="w-1.5 h-1.5 bg-accent rounded-sm" />
                        Oral Surgery
                      </h4>
                      <ul className="space-y-1">
                        {[{ name: 'Extraction', path: '/services/extraction' },
                          { name: 'Orthognathic Surgery', path: '/services/orthodontic-surgery' }].map((item) => (
                          <li key={item.path}>
                            <Link to={item.path} className="block text-sm text-muted-foreground hover:text-accent font-medium py-1.5 px-3 rounded-lg border border-transparent hover:border-white/30 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200">
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Column 3: Implants */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-accent mb-3">
                      <span className="w-1.5 h-1.5 bg-accent rounded-sm" />
                      Implants
                    </h4>
                    <ul className="space-y-1">
                      {[{ name: 'Dental Implants', path: '/services/dental-implants' },
                        { name: 'Full Mouth Implant', path: '/services/full-mouth-implant' },
                        { name: 'Pterygoid & Zygomatic Implant', path: '/services/pterygoid-zygomatic-implant' }].map((item) => (
                        <li key={item.path}>
                          <Link to={item.path} className="block text-sm text-muted-foreground hover:text-accent font-medium py-1.5 px-3 rounded-lg border border-transparent hover:border-white/30 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 4: Cosmetic Dentistry */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-accent mb-3">
                      <span className="w-1.5 h-1.5 bg-accent rounded-sm" />
                      Cosmetic Dentistry
                    </h4>
                    <ul className="space-y-1">
                      {[{ name: 'Smile Design', path: '/services/smile-design' },
                        { name: 'Veneers', path: '/services/veneers' },
                        { name: 'Teeth Whitening', path: '/services/teeth-whitening' }].map((item) => (
                        <li key={item.path}>
                          <Link to={item.path} className="block text-sm text-muted-foreground hover:text-accent font-medium py-1.5 px-3 rounded-lg border border-transparent hover:border-white/30 dark:hover:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

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

                  {/* About Us */}
                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 border-t border-muted transition-all duration-200 hover:text-accent ${
                      isActive('/about') ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    About Us
                  </Link>

                  {/* Our Doctors (Collapsible) */}
                  <div className="flex flex-col py-2 border-t border-muted">
                    <button
                      onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                      className="flex items-center justify-between text-sm font-medium transition-all duration-200 hover:text-accent text-left"
                    >
                      <span>Our Doctors</span>
                      <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isMobileAboutOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileAboutOpen && (
                      <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-muted">
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
                      <div className="pl-4 mt-2 flex flex-col gap-4 border-l border-muted max-h-[400px] overflow-y-auto pr-2">
                        <Link
                          to="/services"
                          onClick={() => setIsOpen(false)}
                          className="text-[12px] font-extrabold uppercase tracking-wider text-accent border-b border-muted pb-2 hover:underline"
                        >
                          View All Services →
                        </Link>
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-1.5">Restorative Dentistry</p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {[{ name: 'Cavity Filling', path: '/services/cavity-filling' },
                              { name: 'Broken Teeth', path: '/services/broken-teeth' },
                              { name: 'Digital Dentures', path: '/services/digital-dentures' }].map((link) => (
                              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-xs py-0.5 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}>{link.name}</Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-1.5">Orthodontics</p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {[{ name: 'Orthodontic Treatment', path: '/services/orthodontic-treatment' },
                              { name: 'Aligners', path: '/services/aligners' }].map((link) => (
                              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-xs py-0.5 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}>{link.name}</Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-1.5">Implants</p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {[{ name: 'Dental Implants', path: '/services/dental-implants' },
                              { name: 'Full Mouth Implant', path: '/services/full-mouth-implant' },
                              { name: 'Pterygoid & Zygomatic Implant', path: '/services/pterygoid-zygomatic-implant' }].map((link) => (
                              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-xs py-0.5 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}>{link.name}</Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-1.5">Cosmetic Dentistry</p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {[{ name: 'Smile Design', path: '/services/smile-design' },
                              { name: 'Veneers', path: '/services/veneers' },
                              { name: 'Teeth Whitening', path: '/services/teeth-whitening' }].map((link) => (
                              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-xs py-0.5 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}>{link.name}</Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-1.5">Gum Treatment</p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {[{ name: 'Gum Therapy', path: '/services/gum-therapy' },
                              { name: 'Laser Dental Treatment', path: '/services/laser-dental-treatment' }].map((link) => (
                              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-xs py-0.5 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}>{link.name}</Link>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-accent mb-1.5">Oral Surgery</p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {[{ name: 'Extraction', path: '/services/extraction' },
                              { name: 'Orthognathic Surgery', path: '/services/orthodontic-surgery' }].map((link) => (
                              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-xs py-0.5 hover:text-accent transition-colors ${isActive(link.path) ? 'text-accent' : 'text-muted-foreground'}`}>{link.name}</Link>
                            ))}
                          </div>
                        </div>
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
