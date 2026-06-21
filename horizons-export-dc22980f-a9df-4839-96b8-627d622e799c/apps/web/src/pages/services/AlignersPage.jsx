
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

function AlignersPage() {
  return (
    <>
      <Helmet>
        <title>Clear Aligners in Davangere - SS Dental Care</title>
        <meta name="description" content="Discreet orthodontic treatment with clear aligners in Davangere. Straighten your teeth invisibly with expert care at SS Dental Care." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6">Clear Aligners</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">Discreet orthodontic treatment for a straighter smile</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-semibold mb-4">About the Treatment</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Clear aligners are a modern alternative to traditional braces, using a series of custom-made, transparent trays to gradually straighten your teeth. They're virtually invisible, removable, and comfortable, making them an ideal choice for adults and teens who want to improve their smile discreetly.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Dr. Naveen Shamnur, our orthodontic specialist, creates personalized treatment plans using advanced 3D imaging to ensure precise tooth movement and optimal results.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 bg-card p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {[
                    'Virtually invisible during treatment',
                    'Removable for eating and cleaning',
                    'More comfortable than traditional braces',
                    'Fewer office visits required',
                    'Predictable results with 3D planning'
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
                    { step: '1', title: 'Consultation', desc: '3D scan and treatment planning' },
                    { step: '2', title: 'Custom Aligners', desc: 'Fabrication of your aligner series' },
                    { step: '3', title: 'Treatment', desc: 'Wear aligners 20-22 hours daily' },
                    { step: '4', title: 'Retention', desc: 'Maintain results with retainers' },
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
                    Book Your Consultation
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

export default AlignersPage;
