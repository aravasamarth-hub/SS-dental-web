import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';

function RefundPage() {
  return (
    <>
      <Helmet>
        <title>Refund Policy - SS Dental Care Davangere</title>
        <meta name="description" content="Read the Refund and Payment Policy of SS Dental Care Davangere." />
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
              <h1 className="mb-6">Refund Policy</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Read our policy regarding payments, booking fees, treatment packages, and refunds.
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
                <h2 className="text-xl font-bold mb-4 text-foreground">1. Consultations & Diagnostic Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Fees paid for clinical consultations, dental check-ups, and diagnostic imaging (such as X-rays, intraoral scans) are non-refundable once the clinical service is performed.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">2. Online & Advanced Bookings</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you paid any advance booking deposit to reserve a clinical slot:
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                    <li>Cancellations made **more than 24 hours** before the slot are eligible for a **100% refund** or rescheduling credit.</li>
                    <li>Cancellations made **within 24 hours** of the slot are non-refundable but can be credited towards a rescheduled visit at our discretion.</li>
                  </ul>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">3. Mid-Treatment Package Cancellations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For comprehensive treatments spanning multiple sessions (such as aligners, orthodontics, implants, or root canals): if a patient wishes to discontinue treatment midway, the refund amount will be calculated by deducting the standard individual session fees for services already rendered from the total package price.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">4. Refund Processing Time</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Approved refunds will be processed using the original method of payment (bank transfer, UPI, or card payment) within **5-7 business days** of confirmation.
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

export default RefundPage;
