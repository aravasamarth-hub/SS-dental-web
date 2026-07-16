
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Briefcase, Calendar, MapPin, Clock, ShieldCheck, Star } from 'lucide-react';
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
  ];

  const specialisations = [
    {
      title: 'Aligners & Invisible Braces',
      description: 'Clear aligner treatments (Invisalign) for discreet teeth straightening.'
    },
    {
      title: 'Orthognathic Surgery',
      description: 'Correction of jaw irregularities for improved function and bite.'
    },
    {
      title: 'Dental Implants',
      description: 'Durable tooth replacements using modern implantology techniques.'
    },
    {
      title: 'Cosmetic & Aesthetic Dentistry',
      description: 'Smile designs, veneers, and facial aesthetic enhancements.'
    }
  ];

  const trustReasons = [
    '25+ years of proven experience',
    'Focus on painless, patient-friendly treatments',
    'Use of modern digital dental technology',
    'Trusted by families across Davangere'
  ];

  return (
    <>
      <Helmet>
        <title>Dr. Naveen Shamnur MDS - Orthodontist | SS Dental Care Davangere</title>
        <meta name="description" content="Meet Dr. Naveen Shamnur MDS, Senior Orthodontist at SS Dental Care Davangere. 25+ years of experience in braces, aligners, orthognathic surgery, and dental implants." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="order-2 lg:order-1"
              >
                <h1 className="mb-2">
                  About <span className="text-accent">Dr. Naveen Shamnur</span> MDS
                </h1>
                <p className="text-base text-muted-foreground font-medium mb-4">
                  Professor, Dept. of Orthodontics, College of Dental Sciences, Davangere
                </p>
                <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                  <p>
                    <strong className="text-foreground">Dr. Naveen Shamnur</strong> is a senior{' '}
                    <strong className="text-foreground">Orthodontist and Dental Specialist</strong> with over{' '}
                    <strong className="text-foreground">25 years of experience</strong>, based in Davangere. He completed his{' '}
                    <strong className="text-foreground">MDS in Orthodontics</strong> from the College of Dental Sciences and is a member of the{' '}
                    <strong className="text-foreground">Indian Orthodontic Society (IOS)</strong> and{' '}
                    <strong className="text-foreground">Indian Dental Association (IDA)</strong>.
                  </p>
                  <p>
                    He specialises in <strong className="text-foreground">aligners & invisible braces, orthognathic surgery, dental implants, and cosmetic dentistry</strong>, delivering precise and patient-friendly treatments using modern technology.
                  </p>
                  <p>
                    At <strong className="text-foreground">S S Dental Care</strong>, he is known for his{' '}
                    <strong className="text-foreground">painless approach, calm demeanor, and high-quality care</strong>, making him a trusted choice for families.
                  </p>
                </div>
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
                    className="w-full h-auto object-cover object-top"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Three-column info section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

              {/* Column 1: Specialisations & Expertise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award className="h-6 w-6 text-accent" />
                  Specialisations & Expertise
                </h2>
                <ul className="space-y-5">
                  {specialisations.map((item, index) => (
                    <li key={index}>
                      <p className="font-bold text-foreground mb-1">• {item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-3">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Column 2: Education & Professional Background */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-accent" />
                  Education & Professional Background
                </h2>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  {[
                    { bold: 'MDS in Orthodontics', rest: ' – College of Dental Sciences, Davangere (2001)' },
                    { bold: 'Active Member', rest: ' – Indian Orthodontic Society (IOS)' },
                    { bold: 'Member', rest: ' – Indian Dental Association (IDA)' },
                    { bold: 'Former Treasurer', rest: ' – Indian Orthodontic Society' },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span><strong className="text-foreground">{item.bold}</strong>{item.rest}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dr. Shamnur combines strong academic knowledge with decades of hands-on experience, ensuring reliable and effective treatment outcomes.
                </p>

                <h3 className="text-lg font-bold mt-8 mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Why Patients Trust Him
                </h3>
                <ul className="space-y-2">
                  {trustReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Column 3: Clinical Practice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-accent" />
                  Clinical Practice – S S Dental Care
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  At <strong className="text-foreground">S S Dental Care</strong>, Dr. Shamnur is well regarded for his{' '}
                  <strong className="text-foreground">calm approach, painless procedures, and use of advanced dental equipment</strong>, ensuring a comfortable patient experience.
                </p>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-foreground mb-1">Address</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        #2873, 1st Floor, S S Plaza, 4th Main, 4th Cross Road,<br />
                        MCC B Block, Davangere, Karnataka
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-foreground mb-1">Timings</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Monday – Saturday: 10:30 AM – 9:00 PM<br />
                        Sunday: 10:30 AM – 2:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-foreground mb-1">Commitment</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Trusted by families in Davangere for painless, high-quality dental care using modern equipment.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Patient Testimonials */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-8 text-center">Patient Testimonials</h2>
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
