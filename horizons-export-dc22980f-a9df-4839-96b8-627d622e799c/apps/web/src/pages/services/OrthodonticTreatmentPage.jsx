
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

function OrthodonticTreatmentPage() {
  return (
    <>
      <Helmet>
        <title>Orthodontic Treatment & Braces - SS Dental Care Davangere</title>
        <meta name="description" content="Traditional and modern braces for all ages in Davangere. Expert orthodontic treatment by Dr. Naveen Shamnur at SS Dental Care." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6">Orthodontic Treatment & Braces</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Traditional and modern braces for all ages</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-semibold mb-4">About the Treatment</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Orthodontic treatment corrects misaligned teeth and jaws using braces or other appliances. We offer both traditional metal braces and modern ceramic braces to suit different preferences and needs. Dr. Naveen Shamnur, our MDS Orthodontist, has extensive experience treating patients of all ages.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're dealing with crowding, spacing, overbite, underbite, or crossbite, we create personalized treatment plans to achieve optimal results and a healthy, beautiful smile.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 bg-card p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {[
                    'Corrects bite problems and alignment',
                    'Improves oral health and function',
                    'Enhances facial aesthetics',
                    'Prevents future dental issues',
                    'Suitable for children, teens, and adults'
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
                    { step: '1', title: 'Consultation', desc: 'Comprehensive orthodontic evaluation' },
                    { step: '2', title: 'Planning', desc: 'Treatment plan and timeline' },
                    { step: '3', title: 'Braces Placement', desc: 'Bracket and wire installation' },
                    { step: '4', title: 'Retention', desc: 'Retainers to maintain results' },
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
                    Book Orthodontic Consultation
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

export default OrthodonticTreatmentPage;
