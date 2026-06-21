
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Button } from '@/components/ui/button';

function LocationPage() {
  return (
    <>
      <Helmet>
        <title>Location & Directions - SS Dental Care | Find Us in Davangere</title>
        <meta name="description" content="Find SS Dental Care at MCC B Block, Davanagere. Get directions, view our hours, and plan your visit to our dental clinic." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="mb-6">Visit Our Clinic</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Conveniently located in the heart of Davangere
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-8">How to Find Us</h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Address</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        SS Dental Care<br />
                        2873, S S Plaza, 1st Floor<br />
                        4th Main, 4th Cross Rd<br />
                        MCC B Block<br />
                        Davanagere, Karnataka 577004
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Clinic Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday – Saturday: 10:30 AM – 9:00 PM</p>
                        <p>Sunday: 10:30 AM – 2:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Contact</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Phone: <a href="tel:+919448455699" className="hover:text-accent transition-all duration-200">+91 9448455699</a></p>
                        <p>Email: <a href="mailto:ssdentalcare.in@gmail.com" className="hover:text-accent transition-all duration-200">ssdentalcare.in@gmail.com</a></p>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=SS+Dental+Care+Davanagere"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="transition-all duration-200 active:scale-98">
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </a>

                <div className="mt-8 bg-muted p-6 rounded-xl">
                  <h3 className="font-semibold mb-3">Parking Information</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ample parking space is available at S S Plaza. The clinic is located on the 1st floor with easy elevator access.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-xl h-[600px]"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.123456789!2d75.9234567!3d14.4567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDI3JzI0LjQiTiA3NcKwNTUnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SS Dental Care detailed location map"
                ></iframe>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="mb-6">Directions from Major Landmarks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl text-left">
                  <h3 className="font-semibold mb-2">From Davangere Railway Station</h3>
                  <p className="text-sm text-muted-foreground">Approximately 3.2 km, 12 minutes by car via MG Road</p>
                </div>
                <div className="bg-card p-6 rounded-xl text-left">
                  <h3 className="font-semibold mb-2">From Bus Stand</h3>
                  <p className="text-sm text-muted-foreground">Approximately 2.8 km, 10 minutes by car via PB Road</p>
                </div>
                <div className="bg-card p-6 rounded-xl text-left">
                  <h3 className="font-semibold mb-2">From GMIT College</h3>
                  <p className="text-sm text-muted-foreground">Approximately 1.5 km, 5 minutes by car via 4th Main</p>
                </div>
                <div className="bg-card p-6 rounded-xl text-left">
                  <h3 className="font-semibold mb-2">From City Hospital</h3>
                  <p className="text-sm text-muted-foreground">Approximately 2.1 km, 8 minutes by car via MCC Road</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default LocationPage;
