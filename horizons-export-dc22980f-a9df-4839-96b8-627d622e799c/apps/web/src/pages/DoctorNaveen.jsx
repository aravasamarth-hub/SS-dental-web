
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import TestimonialCard from '@/components/TestimonialCard';
import { Button } from '@/components/ui/button';

function DoctorNaveen() {
  const testimonials = [
    { name: 'Arjun Desai', rating: 5, review: 'Dr. Naveen is an excellent orthodontist. He explained my treatment plan clearly and the results exceeded my expectations. My braces journey was smooth and comfortable.', date: 'May 2026' },
    { name: 'Kavya Nair', rating: 5, review: 'Got my aligners from Dr. Naveen. He is very patient and professional. The treatment was exactly as he described and my smile looks amazing now!', date: 'April 2026' },
    { name: 'Rohan Kulkarni', rating: 5, review: 'Best orthodontist in Davangere! Dr. Naveen handled my complex case with expertise. Highly recommend for anyone needing braces or orthodontic treatment.', date: 'March 2026' },
  ];

  return (
    <>
      <Helmet>
        <title>Dr. Naveen Shamnur MDS - Orthodontist | SS Dental Care</title>
        <meta name="description" content="Meet Dr. Naveen Shamnur, MDS Orthodontist at SS Dental Care. Expert in braces, aligners, and orthodontic surgery with 10+ years of experience." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="order-2 lg:order-1"
              >
                <h1 className="mb-4">Dr. Naveen Shamnur</h1>
                <p className="text-2xl text-accent font-semibold mb-6">MDS - Orthodontist</p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Dr. Naveen Shamnur is a highly qualified orthodontist with over 10 years of experience in creating beautiful, healthy smiles. His expertise in braces, clear aligners, and orthodontic surgery has helped hundreds of patients achieve their dream smiles.
                </p>
                <Link to="/bookings">
                  <Button size="lg" className="transition-all duration-200 active:scale-98">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="order-1 lg:order-2"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/37a824af35a9003237db66be11bbe263.png"
                    alt="Dr. Naveen Shamnur MDS - Orthodontist"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="mb-8">Qualifications & Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <GraduationCap className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Education</h3>
                    <p className="text-sm text-muted-foreground">MDS in Orthodontics from a prestigious dental college</p>
                  </div>

                  <div className="bg-card p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Briefcase className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p className="text-sm text-muted-foreground">10+ years of clinical practice in orthodontics</p>
                  </div>

                  <div className="bg-card p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Expertise</h3>
                    <p className="text-sm text-muted-foreground">Certified in advanced orthodontic techniques</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="mb-6">Specializations</h2>
                <div className="bg-muted p-8 rounded-2xl">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Traditional Metal Braces',
                      'Ceramic Braces',
                      'Clear Aligner Therapy',
                      'Orthodontic Surgery',
                      'Early Orthodontic Treatment',
                      'Adult Orthodontics',
                      'Retention and Post-Treatment Care',
                      'Complex Malocclusion Cases'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-8">Patient Testimonials</h2>
                <div className="columns-1 md:columns-2 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} index={index} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default DoctorNaveen;
