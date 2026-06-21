
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

function GumTherapyPage() {
  return (
    <>
      <Helmet>
        <title>Gum Therapy & Periodontal Care - SS Dental Care Davangere</title>
        <meta name="description" content="Comprehensive periodontal care and gum disease treatment in Davangere. Expert gum therapy at SS Dental Care." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6">Gum Therapy & Periodontal Care</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Comprehensive periodontal care for healthy gums</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-semibold mb-4">About the Treatment</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gum therapy, also known as periodontal treatment, addresses gum disease and maintains the health of your gums and supporting bone structure. We offer comprehensive care from preventive cleanings to advanced treatments for periodontitis.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Healthy gums are essential for overall oral health and keeping your natural teeth. Our treatments include deep cleaning (scaling and root planing), laser therapy, and maintenance programs to prevent gum disease progression.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 bg-card p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {[
                    'Prevents tooth loss from gum disease',
                    'Reduces inflammation and bleeding',
                    'Eliminates bad breath',
                    'Protects overall health (linked to heart disease)',
                    'Maintains bone support for teeth'
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { step: '1', title: 'Assessment', desc: 'Gum health evaluation and probing' },
                    { step: '2', title: 'Treatment', desc: 'Scaling, root planing, or laser therapy' },
                    { step: '3', title: 'Maintenance', desc: 'Regular cleanings and monitoring' },
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
                    Book Gum Health Checkup
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

export default GumTherapyPage;
