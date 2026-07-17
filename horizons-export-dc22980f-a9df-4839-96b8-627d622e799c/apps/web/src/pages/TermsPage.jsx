import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';

function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - SS Dental Care Davangere</title>
        <meta name="description" content="Read the Terms and Conditions for using SS Dental Care Davangere's services, website, and appointment systems." />
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
              <h1 className="mb-6">Terms & Conditions</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Please read these terms carefully before using our website and scheduling services.
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
                <h2 className="text-xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using the SS Dental Care website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this website.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">2. Appointment Scheduling & Consultation</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Scheduling an appointment through our website or portal is subject to confirmation. SS Dental Care reserves the right to modify, postpone, or cancel appointments based on clinical urgency, practitioner availability, or unforeseen circumstances.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">3. Medical Information Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The content provided on this website—including articles, treatment descriptions, and FAQs—is for informational purposes only. It is not a substitute for professional clinical advice, diagnosis, or treatment. Always consult a qualified dentist or doctor.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">4. User Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Users agree to provide accurate and complete personal details (such as name, phone number, and medical history) when booking appointments. Providing misleading information may result in the cancellation of your appointments.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All design layout, logo, graphics, text, and other content displayed on this website are the property of SS Dental Care. Unauthorized reproduction, modification, or distribution of this content is strictly prohibited.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">6. Modifications to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SS Dental Care reserves the right to update these terms at any time. Changes will be posted directly to this page, and your continued use of the website constitutes acceptance of the modified terms.
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

export default TermsPage;
