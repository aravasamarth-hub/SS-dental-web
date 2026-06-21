
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

function CavityFillingPage() {
  return (
    <>
      <Helmet>
        <title>Cavity Filling & Restoration - SS Dental Care Davangere</title>
        <meta name="description" content="Advanced composite fillings for cavities in Davangere. Pain-free tooth restoration that matches your natural tooth color at SS Dental Care." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6">Cavity Filling & Restoration</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Advanced composite fillings that match your natural tooth color</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-semibold mb-4">About the Treatment</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cavity filling is a common dental procedure to restore teeth damaged by decay. We use advanced composite resin materials that not only restore the tooth's function but also match its natural color, making the filling virtually invisible.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Early treatment of cavities prevents further decay and more extensive dental work. Our gentle approach ensures a comfortable experience with long-lasting results.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 bg-card p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {[
                    'Tooth-colored fillings for natural appearance',
                    'Stops decay and prevents further damage',
                    'Restores tooth strength and function',
                    'Quick and comfortable procedure',
                    'Durable and long-lasting results'
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
                    { step: '1', title: 'Examination', desc: 'Cavity detection and assessment' },
                    { step: '2', title: 'Preparation', desc: 'Decay removal and tooth cleaning' },
                    { step: '3', title: 'Filling', desc: 'Composite application and shaping' },
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

export default CavityFillingPage;
