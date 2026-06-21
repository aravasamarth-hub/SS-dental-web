
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import TestimonialCard from '@/components/TestimonialCard';
import { Button } from '@/components/ui/button';

function DoctorSunitha() {
  const testimonials = [
    { name: 'Lakshmi Rao', rating: 5, review: 'Dr. Sunitha is an amazing prosthodontist. She did my dental implants and the results are fantastic. Very professional and caring throughout the process.', date: 'May 2026' },
    { name: 'Karthik Bhat', rating: 5, review: 'Got my smile makeover done by Dr. Sunitha. She has an eye for aesthetics and the technical skills to match. Couldn\'t be happier with my new smile!', date: 'April 2026' },
    { name: 'Deepa Shetty', rating: 5, review: 'Dr. Sunitha made my denture experience so comfortable. She explained everything clearly and the fit is perfect. Highly recommend her expertise.', date: 'March 2026' },
  ];

  return (
    <>
      <Helmet>
        <title>Dr. Sunitha N Shamnur MDS - Prosthodontist & Implantologist | SS Dental Care</title>
        <meta name="description" content="Meet Dr. Sunitha N Shamnur, MDS Prosthodontist and Implantologist at SS Dental Care. Expert in dental implants, dentures, and smile design with 10+ years of experience." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="order-2 lg:order-1"
              >
                <h1 className="mb-4">Dr. Sunitha N Shamnur</h1>
                <p className="text-2xl text-accent font-semibold mb-6">MDS - Prosthodontist & Implantologist</p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Dr. Sunitha N Shamnur is a highly skilled prosthodontist and implantologist with over 10 years of experience in restorative and cosmetic dentistry. Her expertise in dental implants, dentures, and smile design has transformed countless smiles.
                </p>
                <Link to="/bookings">
                  <Button size="lg" className="transition-all duration-200 active:scale-98">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="order-1 lg:order-2"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/478df36d82fc64b544111f8c6fd0f1dc.png"
                    alt="Dr. Sunitha N Shamnur MDS - Prosthodontist and Implantologist"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="mb-8">Qualifications & Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <GraduationCap className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Education</h3>
                    <p className="text-sm text-muted-foreground">MDS in Prosthodontics from a renowned dental institution</p>
                  </div>

                  <div className="bg-card p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Briefcase className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p className="text-sm text-muted-foreground">10+ years specializing in implants and prosthetics</p>
                  </div>

                  <div className="bg-card p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Expertise</h3>
                    <p className="text-sm text-muted-foreground">Advanced training in implantology and smile design</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="mb-6">Specializations</h2>
                <div className="bg-muted p-8 rounded-2xl">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Dental Implants',
                      'Full Mouth Rehabilitation',
                      'Digital Dentures',
                      'Smile Design',
                      'Crowns and Bridges',
                      'Veneers',
                      'Zygomatic Implants',
                      'All-on-4 Implants'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-8">Patient Testimonials</h2>
                <div className="columns-1 md:columns-2 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} index={index} />
                  ))}
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

export default DoctorSunitha;
