
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DarkModeToggle from './DarkModeToggle';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

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

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/38c4b0b05acaa72021a2d891747924f2.jpg"
              alt="SS Dental Care logo"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="font-bold text-lg hidden sm:inline">SS Dental Care</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-accent ${
                  isActive(link.path) ? 'text-accent' : 'text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-all duration-200 hover:text-accent">
                About Us
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {aboutLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="w-full cursor-pointer">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-all duration-200 hover:text-accent">
                Services
                <ChevronDown className="h-4 w-4" />
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

            <Link to="/bookings">
              <Button className="transition-all duration-200 active:scale-98">
                Book Appointment
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <DarkModeToggle />
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium transition-all duration-200 hover:text-accent ${
                        isActive(link.path) ? 'text-accent' : 'text-foreground'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold mb-2">About Us</p>
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm py-2 hover:text-accent transition-all duration-200"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold mb-2">Services</p>
                    <div className="max-h-64 overflow-y-auto">
                      {serviceLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm py-2 hover:text-accent transition-all duration-200"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link to="/bookings" onClick={() => setIsOpen(false)}>
                    <Button className="w-full mt-4 transition-all duration-200 active:scale-98">
                      Book Appointment
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
