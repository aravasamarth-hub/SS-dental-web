import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Briefcase, Calendar, MapPin, Clock, ShieldCheck, Star, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import TestimonialCard from '@/components/TestimonialCard';
import { Button } from '@/components/ui/button';

function DoctorSunitha() {
  const testimonials = [
    { name: 'Lakshmi Rao', rating: 5, review: 'Dr. Sunitha is an amazing prosthodontist. She did my dental implants and the results are fantastic. Very professional and caring throughout the process.', date: 'May 2026' },
    { name: 'Deepa Shetty', rating: 5, review: 'Dr. Sunitha made my denture experience so comfortable. She explained everything clearly and the fit is perfect. Highly recommend her expertise.', date: 'March 2026' },
  ];

  const specialisations = [
    {
      title: 'Dental Implants',
      description: 'Durable tooth replacements using modern implantology techniques.'
    },
    {
      title: 'Maxillofacial Prosthetics',
      description: 'Defect restoration to rebuild both function and appearance.'
    },
    {
      title: 'Cosmetic & Aesthetic Dentistry',
      description: 'Smile designs, veneers, and cosmetic enhancements.'
    },
    {
      title: 'Crowns & Bridges (Fixed Prosthodontics)',
      description: 'Durable restoration of damaged or missing teeth.'
    }
  ];

  const academicContributions = [
    'Editorial Board Member – International Journal of Oral Health Sciences (IJOHS)',
    'Author of multiple research papers on oral health, cancer biomarkers, and digital dentistry',
    'Participant in advanced academic programs and dental conferences'
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
        <title>Dr. Sunitha Shamnur MDS - Best Dental Implantologist in Davangere | SS Dental Care</title>
        <meta name="description" content="Consult Dr. Sunitha N Shamnur MDS, Senior Prosthodontist & Implantologist at SS Dental Care Davangere. Specialist in Dental Implants, Digital Dentures & Smile Design." />
        <meta name="keywords" content="dr sunitha shamnur, prosthodontist davangere, dental implantologist davangere, digital dentures davangere, ss dental care" />
        <link rel="canonical" href="https://ssdentalcare.in/doctors/sunitha-shamnur" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="order-2 lg:order-1 lg:col-span-7"
              >
                <h1 className="mb-2 flex flex-col gap-1">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">About</span>
                  <span className="text-accent text-4xl md:text-5xl lg:text-6xl font-bold">Dr. Sunitha Shamnur</span>
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">MDS</span>
                </h1>
                <p className="text-base text-muted-foreground font-medium mb-4">
                  Professor, Dept. of Prosthodontics, Bapuji College of Dental Sciences, Davangere
                </p>
                <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                  <p>
                    <strong className="text-foreground">Dr. Sunitha N. Shamnur</strong> is a senior{' '}
                    <strong className="text-foreground">Prosthodontist and Implantologist</strong> with over{' '}
                    <strong className="text-foreground">21 years of experience</strong>, based in Davangere. She completed her{' '}
                    <strong className="text-foreground">MDS in Prosthodontics & Implantology</strong> and is known for her expertise in advanced restorative and aesthetic dentistry.
                  </p>
                  <p>
                    She specialises in <strong className="text-foreground">dental implants, maxillofacial prosthetics, crowns & bridges, and cosmetic dentistry</strong>, providing precise and function-focused treatments using modern techniques.
                  </p>
                  <p>
                    At <strong className="text-foreground">S S Dental Care</strong>, she is recognised for her{' '}
                    <strong className="text-foreground">precision, patient-focused approach, and high-quality care</strong>, making her a trusted choice for long-term dental solutions.
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
                className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-start"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl max-w-sm md:max-w-md lg:max-w-[380px] w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 flex justify-center">
                  <img
                    src="/dr-sunitha-shamnur.png"
                    alt="Dr. Sunitha N Shamnur MDS - Prosthodontist and Implantologist"
                    className="w-full h-auto object-contain"
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

              {/* Column 1: Education & Professional Background */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-accent" />
                  Education & Professional Background
                </h2>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  {[
                    { bold: 'BDS', rest: ' – V.S. Dental College, Bangalore (1994)' },
                    { bold: 'MDS in Prosthodontics & Implantology', rest: ' – Bapuji College of Dental Sciences, Davangere (2004)' },
                    { bold: 'Practicing', rest: ' at S S Dental Care, Davangere' },
                    { bold: 'Associated', rest: ' with CG Hospital' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span><strong className="text-foreground">{item.bold}</strong>{item.rest}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Column 2: Specialisations & Expertise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
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
                  At <strong className="text-foreground">S S Dental Care</strong>, Dr. Shamnur is well regarded for her{' '}
                  <strong className="text-foreground">calm approach, painless procedures, and use of advanced dental equipment</strong>, ensuring a comfortable patient experience.
                </p>
                <div className="space-y-5">
                  <Link to="/location" className="flex items-start gap-3 group cursor-pointer">
                    <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-bold text-foreground mb-1 group-hover:text-accent transition-colors">Address</p>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                        #2873, 1st Floor, S S Plaza, 4th Main, 4th Cross Road,<br />
                        MCC B Block, Davangere, Karnataka
                      </p>
                    </div>
                  </Link>
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
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contributions and Trust factors */}
        <section className="py-16 bg-muted/20 border-y border-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              
              {/* Card 1: Academic & Research Contributions */}
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-muted/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  Academic & Research Contributions
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Dr. Shamnur is actively involved in dental education and research:
                </p>
                <ul className="space-y-3">
                  {academicContributions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Why Patients Trust Her */}
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-muted/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Why Patients Trust Her
                </h3>
                <ul className="space-y-4">
                  {trustReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3: Patient Care Philosophy */}
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-muted/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  Patient Care Philosophy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  She is widely respected for her <strong className="text-foreground">precision, gentle approach, and commitment to high-quality care</strong>, ensuring every patient receives personalized and effective treatment in a comfortable environment.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Patient Testimonials */}
        <section className="py-16 bg-muted/10">
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

export default DoctorSunitha;
