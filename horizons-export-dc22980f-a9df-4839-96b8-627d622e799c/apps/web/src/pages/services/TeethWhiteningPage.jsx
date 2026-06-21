
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

function TeethWhiteningPage() {
  return (
    <>
      <Helmet>
        <title>Teeth Whitening in Davangere - SS Dental Care</title>
        <meta name="description" content="Professional teeth whitening services in Davangere. Get a brighter, more confident smile with safe and effective whitening treatments at SS Dental Care." />
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
              <h1 className="mb-6">Teeth Whitening</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Professional whitening treatments for a brighter, more confident smile
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="prose prose-lg max-w-none"
              >
                <h2>About the Treatment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Teeth whitening is one of the most popular cosmetic dental procedures, offering a quick and effective way to enhance your smile. At SS Dental Care, we use advanced whitening technology to safely lighten the shade of your teeth, removing stains and discoloration caused by food, drinks, smoking, and aging.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our professional whitening treatments are customized to your specific needs and deliver results that are significantly better than over-the-counter products. The procedure is safe, comfortable, and can brighten your teeth by several shades in just one visit.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 bg-card p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {[
                    'Immediate visible results in just one session',
                    'Safe and effective professional-grade whitening',
                    'Customized treatment for your specific needs',
                    'Long-lasting results with proper care',
                    'Boosts confidence and improves appearance'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <h2 className="text-2xl font-semibold mb-6">Procedure Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { step: '1', title: 'Consultation', desc: 'Initial assessment and shade selection' },
                    { step: '2', title: 'Preparation', desc: 'Teeth cleaning and protection of gums' },
                    { step: '3', title: 'Whitening', desc: 'Application of whitening gel and activation' },
                  ].map((item) => (
                    <div key={item.step} className="bg-muted p-6 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl mb-4">
                        {item.step}
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <Link to="/bookings">
                  <Button size="lg" className="transition-all duration-200 active:scale-98">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Your Appointment
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

export default TeethWhiteningPage;
