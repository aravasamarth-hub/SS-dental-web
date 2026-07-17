import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';

function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - SS Dental Care Davangere</title>
        <meta name="description" content="Read the Privacy Policy of SS Dental Care Davangere to learn how we protect and manage your personal and medical information." />
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
              <h1 className="mb-6">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We are committed to safeguarding your personal and medical information.
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
                <h2 className="text-xl font-bold mb-4 text-foreground">1. Collection of Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information when you book an appointment, submit an inquiry, or interact with our site. This may include your name, email, phone number, medical history, and clinical concerns.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">2. Use of Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The data we collect is strictly used to process your appointments, communicate scheduling updates, answer queries, and maintain diagnostic clinical records.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">3. Protection of Medical Records</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Patient medical histories, diagnostic scans, and clinical notes are treated with absolute confidentiality. We implement technical and physical safety measures to prevent unauthorized access or disclosure.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">4. Disclosure to Third Parties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or transfer your personally identifiable information to third parties. This does not include trusted partners who assist us in operating our website or conducting our clinical practice, so long as those parties agree to keep this information confidential.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">5. Cookies and Analytics</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may use cookies to improve user experience on our website. Cookies help us understand website traffic trends and page interactions. You can disable cookies in your browser settings if you choose.
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

export default PrivacyPage;
