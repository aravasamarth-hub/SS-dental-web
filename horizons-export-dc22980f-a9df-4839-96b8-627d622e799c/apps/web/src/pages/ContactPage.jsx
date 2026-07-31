import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Mail, Phone, MapPin, Clock, Navigation } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CheckCircle2 } from 'lucide-react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submittingRef = React.useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting || submittingRef.current) return;

    if (!formData.name || !formData.phone) {
      toast.error('Please fill in required fields (Name and Phone)');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      // Open WhatsApp directly with pre-filled message
      const waMessage = `Hello SS Dental Care! 🦷\n\nI have sent a message via your Contact page:\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Email: ${formData.email || 'N/A'}\n• Message: ${formData.message || 'General Inquiry'}\n\nPlease get in touch with me. Thank you!`;
      const whatsappUrl = `https://wa.me/917619267764?text=${encodeURIComponent(waMessage)}`;
      window.open(whatsappUrl, '_blank');

      setIsSubmitted(true);
      toast.success('Redirecting to WhatsApp...');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form WhatsApp submission exception:', err);
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - SS Dental Care | Get in Touch</title>
        <meta name="description" content="Contact SS Dental Care in Davangere. Call us at +91 9448455699 or email ssdentalcare.in@gmail.com for appointments and inquiries." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        {/* Hero Banner Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We&apos;re here to answer your questions and schedule your appointment
              </p>
            </motion.div>
          </div>
        </section>

        {/* ROW 1: Contact Details & Form */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* Row 1 Left: Contact Information & Timings */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-10"
              >
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold">Contact Details</h2>
                  
                  <div className="space-y-8">
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=SS+Dental+Care+Davanagere"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-5 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-all">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-accent transition-colors">Address</h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          SS Dental Care, 2873, S S Plaza, 1st Floor,<br />
                          4th Main, 4th Cross Rd, MCC B Block,<br />
                          Davanagere, Karnataka 577004
                        </p>
                      </div>
                    </a>

                    <a
                      href="tel:+919448455699"
                      className="flex items-start gap-5 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-all">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-accent transition-colors">Phone</h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          +91 9448455699
                        </p>
                      </div>
                    </a>

                    <a
                      href="mailto:ssdentalcare.in@gmail.com"
                      className="flex items-start gap-5 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-all">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-accent transition-colors">Email</h3>
                        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                          ssdentalcare.in@gmail.com
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Timings Card */}
                <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
                    <Clock className="h-6 w-6 text-accent" />
                    Hours
                  </h3>
                  <div className="space-y-4">
                    {[
                      { day: 'MONDAY', time: '10:30 AM – 9:00 PM' },
                      { day: 'TUESDAY', time: '10:30 AM – 9:00 PM' },
                      { day: 'WEDNESDAY', time: '10:30 AM – 9:00 PM' },
                      { day: 'THURSDAY', time: '10:30 AM – 9:00 PM' },
                      { day: 'FRIDAY', time: '10:30 AM – 9:00 PM' },
                      { day: 'SATURDAY', time: '10:30 AM – 9:00 PM' },
                      { day: 'SUNDAY', time: '10:30 AM – 2:00 PM' }
                    ].map((item) => (
                      <div key={item.day} className="flex justify-between items-center py-2.5 border-b border-border/30 last:border-0">
                        <span className="font-semibold text-foreground text-sm tracking-wider">{item.day}</span>
                        <span className="text-muted-foreground text-sm font-medium">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Row 1 Right: Send Message Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-card p-8 rounded-2xl shadow-xl border border-border/50">
                  <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
                  
                  {isSubmitted ? (
                    <div className="border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Message Sent Successfully!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We have received your message and will contact you shortly.
                      </p>
                      <Button 
                        asChild
                        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link to="/bookings">Book Appointment</Link>
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help you"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                          className="text-foreground placeholder:text-muted-foreground focus-visible:ring-accent resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-6 text-base rounded-lg transition-all duration-200 active:scale-98"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ROW 2: Google Maps Map & Landmark Directions */}
        <section className="py-20 border-t border-border/60 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Row 2 Left: Map and Get Directions */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold">Find Us on Google Maps</h2>
                
                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-80 cursor-pointer border border-border/50">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=SS+Dental+Care+Davanagere"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src="/clinic-map.jpg"
                      alt="SS Dental Care Location Map"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 flex items-center justify-center">
                      <span className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Open in Google Maps
                      </span>
                    </div>
                  </a>
                </div>

                <div className="flex justify-start">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=SS+Dental+Care+Davanagere"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button size="lg" className="w-full sm:w-auto px-8 transition-all duration-200 active:scale-98">
                      <Navigation className="mr-2 h-5 w-5" />
                      Get Directions
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Row 2 Right: Directions from landmarks */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold">Directions from Landmarks</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-sm mb-1.5 text-foreground">From Davanagere Railway Station</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Approximately 2.9 km, 10 minutes by two wheeler via Davangere Harihar Road.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-sm mb-1.5 text-foreground">From Bus Stand</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Approximately 2.9 km, 11 minutes by two wheeler via PB Road.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-sm mb-1.5 text-foreground">From GMIT College</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Approximately 5.1 km, 13 minutes by two wheeler via Davangere Harihar Road.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-sm mb-1.5 text-foreground">From Bapuji Hospital</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Approximately 600m, 3 minutes by two wheeler via Church Rd.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default ContactPage;
