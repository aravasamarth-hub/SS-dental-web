
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
        <title>Dr. Naveen Shamnur MDS - Best Orthodontist in Davangere | SS Dental Care</title>
        <meta name="description" content="Consult Dr. Naveen Shamnur MDS, Senior Orthodontist & Dentofacial Orthopedist at SS Dental Care Davangere. Specialist in Braces, Clear Aligners & Jaw Surgery." />
        <meta name="keywords" content="dr naveen shamnur, orthodontist davangere, best braces doctor davangere, aligners specialist davangere, ss dental care" />
        <link rel="canonical" href="https://ssdentalcare.in/doctors/naveen-shamnur" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="order-2 lg:order-1 lg:col-span-7"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-xs sm:text-sm mb-4">
                  <Award className="w-4 h-4 text-accent" />
                  <span>Senior Orthodontist & Dentofacial Specialist</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-2">
                  Dr. Naveen Shamnur <span className="text-accent text-2xl sm:text-3xl md:text-4xl font-bold">MDS</span>
                </h1>

                <p className="text-base sm:text-lg text-primary font-semibold mb-1">
                  Professor, Dept. of Orthodontics, College of Dental Sciences, Davangere
                </p>

                {/* Quick Highlight Badges */}
                <div className="flex flex-wrap gap-2.5 my-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/80 border border-border text-xs sm:text-sm font-medium text-foreground shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    25+ Years Experience
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/80 border border-border text-xs sm:text-sm font-medium text-foreground shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5 text-accent" />
                    MDS in Orthodontics
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/80 border border-border text-xs sm:text-sm font-medium text-foreground shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    IOS & IDA Member
                  </span>
                </div>

                <div className="space-y-4 text-muted-foreground leading-relaxed mb-8 text-sm sm:text-base">
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

                <div className="flex flex-wrap gap-4 items-center">
                  <Link to="/bookings">
                    <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 active:scale-98">
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Appointment
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/919448455699?text=Hello%20Dr.%20Naveen,%20I%20would%20like%20to%20consult%20regarding%20an%20orthodontic%20treatment."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg" className="border-border hover:bg-accent/10 hover:text-accent transition-all">
                      Consult via WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="order-1 lg:order-2 lg:col-span-5 flex justify-center"
              >
                <div className="relative group max-w-sm md:max-w-md lg:max-w-[400px] w-full">
                  {/* Subtle Ambient Backlight Glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-accent/30 via-primary/20 to-sky-500/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Container */}
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-white/15 shadow-2xl flex flex-col items-center">
                    {/* Top Lighting Halo */}
                    <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent pointer-events-none" />

                    {/* Image with Smooth Grounding */}
                    <div className="relative w-full pt-4 px-2 flex justify-center">
                      <img
                        src="/dr-naveen-shamnur.png"
                        alt="Dr. Naveen Shamnur MDS - Orthodontist and Dentofacial Orthopedics"
                        className="w-full h-auto max-h-[500px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transform group-hover:scale-[1.02] transition-transform duration-500"
                        loading="eager"
                      />
                      {/* Bottom Gradient Fade */}
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Bottom Info Ribbon */}
                    <div className="w-full bg-slate-950/90 backdrop-blur-md border-t border-white/10 px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-base">Dr. Naveen Shamnur</p>
                        <p className="text-accent text-xs font-semibold tracking-wide">MDS • Senior Orthodontist</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
                          ⭐ 25+ Yrs
                        </span>
                      </div>
                    </div>
                  </div>
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
