
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Button } from '@/components/ui/button';

function FullMouthImplantPage() {
  return (
    <>
      <Helmet>
        <title>Full Mouth Implant - SS Dental Care Davangere</title>
        <meta name="description" content="Complete mouth restoration with multiple implants in Davangere. Expert full arch implant solutions at SS Dental Care." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6">Full Mouth Implant</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Complete mouth restoration with multiple implants</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-semibold mb-4">About the Treatment</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Full mouth implant restoration is a comprehensive solution for patients who have lost most or all of their teeth. Using strategically placed dental implants, we can restore an entire arch or both arches with fixed prosthetics that function like natural teeth.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Dr. Sunitha N Shamnur specializes in full mouth rehabilitation, using advanced techniques like All-on-4 or All-on-6 to provide stable, long-lasting results with fewer implants and faster recovery times.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 bg-card p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {[
                    'Complete restoration of chewing function',
                    'Fixed solution (not removable like dentures)',
                    'Prevents bone loss and facial collapse',
                    'Natural appearance and feel',
                    'Improved quality of life and confidence'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Procedure Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { step: '1', title: 'Planning', desc: '3D imaging and treatment design' },
                    { step: '2', title: 'Implant Surgery', desc: 'Strategic implant placement' },
                    { step: '3', title: 'Healing', desc: 'Osseointegration period' },
                    { step: '4', title: 'Final Restoration', desc: 'Permanent prosthetic attachment' },
                  ].map((item) => (
                    <div key={item.step} className="bg-muted p-6 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl mb-4">{item.step}</div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 text-center">
                <Link to="/bookings">
                  <Button size="lg" className="transition-all duration-200 active:scale-98">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Consultation
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default FullMouthImplantPage;
