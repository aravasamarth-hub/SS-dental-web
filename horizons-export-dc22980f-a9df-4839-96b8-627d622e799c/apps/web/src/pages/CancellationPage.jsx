import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';

function CancellationPage() {
  return (
    <>
      <Helmet>
        <title>Cancellation Policy - SS Dental Care Davangere</title>
        <meta name="description" content="Read the Cancellation and Rescheduling Policy of SS Dental Care Davangere." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="mb-6">Cancellation Policy</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Understand the process and guidelines for canceling or rescheduling clinical appointments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 flex-grow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl mx-auto bg-card p-8 sm:p-12 rounded-2xl shadow-sm border border-border space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">1. Importance of Notice</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We schedule clinical sessions carefully to give each patient individual, focused attention. When an appointment is missed or canceled on short notice, it prevents us from offering that time slot to other patients in need of urgent care.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">2. Cancellation Window</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We kindly request that you notify us of any cancellations or rescheduling requests at least **24 hours** prior to your scheduled slot. You can do this by calling or messaging us on WhatsApp at +91 94484 55699.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">3. No-Show & Late Cancellations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Failing to attend a scheduled session (No-Show) or canceling within 2 hours of the appointment time without reasonable explanation may restrict your priority booking privileges for future sessions.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">4. Emergency Situations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We understand that personal emergencies and clinical situations happen. In such cases, we gladly waive normal scheduling guidelines to accommodate your situation. Please inform us as soon as possible.
                </p>
              </div>

              <div className="border-t border-border pt-6 text-xs text-muted-foreground text-center">
                Last Updated: July 2026
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default CancellationPage;
