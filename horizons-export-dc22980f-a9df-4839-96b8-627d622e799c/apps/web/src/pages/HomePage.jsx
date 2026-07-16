
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Award, Zap, Sparkles, Calendar, MapPin, Clock, Mail, Phone as PhoneIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import DoctorCard from '@/components/DoctorCard';

import StatCounter from '@/components/StatCounter';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function HomePage() {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      title: 'Teeth Whitening',
      description: 'Removes stains and brightens teeth safely with quick visible results.',
      image: '/services/teeth-whitening-hq.jpg',
      slug: 'teeth-whitening'
    },
    {
      title: 'Veneers',
      description: 'Thin shells covering teeth to enhance appearance, fixing chips, gaps, stains.',
      image: '/services/veneers.jpg',
      slug: 'veneers'
    },
    {
      title: 'Dental Implants',
      description: 'Replaces missing teeth with durable implants providing natural look and strength.',
      image: '/services/dental-implants.jpg',
      slug: 'dental-implants'
    },
    {
      title: 'Laser Dental Treatment',
      description: 'Uses advanced laser technology for precise, painless, bloodless and faster dental procedures.',
      image: '/services/laser-treatment.jpg',
      slug: 'laser-dental-treatment'
    },
    {
      title: 'Broken Teeth',
      description: 'Repairs damaged teeth using bonding, crowns, or veneers for strength.',
      image: '/services/broken-teeth.png',
      slug: 'broken-teeth'
    },
    {
      title: 'Aligners',
      description: 'Clear removable trays that gradually straighten teeth without visible braces.',
      image: '/services/aligners.png',
      slug: 'aligners'
    },
    {
      title: 'Orthodontic Treatment (Braces)',
      description: 'Corrects misaligned teeth and bite issues for improved function and appearance.',
      image: '/services/braces-hq.png',
      slug: 'orthodontic-treatment'
    },
    {
      title: 'Orthognathic Surgery',
      description: 'Corrects jaw alignment issues improving function, bite, and overall facial balance.',
      image: '/services/orthognathic.jpg',
      slug: 'orthodontic-surgery'
    },
    {
      title: 'Cavity Filling (Restoration)',
      description: 'Restoring damaged teeth with comfortable, lasting fillings.',
      image: '/services/cavity-filling.jpg',
      slug: 'cavity-filling'
    },
    {
      title: 'Smile Design',
      description: 'Customized digital smile makeovers analyzing facial features to create your dream aesthetic smile.',
      image: '/services/smile-design.png',
      slug: 'smile-design'
    }
  ];

  const doctors = [
    {
      name: 'Dr. Naveen Shamnur',
      qualification: 'MDS - Orthodontist',
      specialization: 'Braces, Aligners & Orthodontic Surgery',
      image: 'https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/37a824af35a9003237db66be11bbe263.png',
      slug: 'naveen-shamnur'
    },
    {
      name: 'Dr. Sunitha N Shamnur',
      qualification: 'MDS - Prosthodontist',
      specialization: 'Dental Implants, Dentures & Smile Design',
      image: 'https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/478df36d82fc64b544111f8c6fd0f1dc.png',
      slug: 'sunitha-shamnur'
    }
  ];



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Booking request received. We will contact you shortly.');
      setFormData({ name: '', phone: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Best Dental Clinic in Davangere - Implants & Aligners | SS Dental Care</title>
        <meta name="description" content="Discover the best dental clinic in Davangere offering top-notch services including dental implants, aligners, and whitening treatments." />
        <meta name="keywords" content="best dental clinic in davangere, dental implants davangere, aligners davangere" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="hero-section relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ backgroundImage: `url('/hero-bg.jpg')` }}>
          {/* Transparent overlay so the background image is fully bright and visible */}
          <div className="absolute inset-0 bg-transparent z-0"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column - Content */}
              <div className="lg:col-span-7 flex flex-col items-start text-left text-white">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-5 max-w-2xl"
                >
                  {/* Badge */}
                  <div className="flex items-center gap-1.5 text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold tracking-wide">SS Dental Care</span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    Trusted <br />
                    <span className="text-accent">Dental Care</span> <br />
                    in Davangere
                  </h1>

                  {/* Button directly under heading */}
                  <div className="pt-1">
                    <Link to="/bookings">
                      <Button variant="accent" size="lg" className="text-base font-bold px-8 h-11 rounded-full shadow-lg hover:shadow-accent/30 transition-all duration-300">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>

                  {/* Description below button with styled yellow first part */}
                  <p className="text-lg md:text-xl leading-relaxed font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    <span className="text-yellow-300">From preventive check-ups to smile makeovers</span>
                    <span className="text-white"> — we ensure your dental experience is gentle, comfortable, and rewarding.</span>
                  </p>

                  {/* Horizontal Line */}
                  <hr className="w-full border-white/20 my-2" />

                  {/* Google Rating line */}
                  <div className="flex flex-wrap items-center gap-3 text-white text-sm md:text-base font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4.5 w-4.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span>Google Rating 4.8</span>
                    </div>
                    <span className="hidden md:inline text-white/30">•</span>
                    <span>Trusted by over 550 happy patients</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Doctors Cutouts */}
              <div className="lg:col-span-5 flex flex-col justify-end h-full translate-y-12 md:translate-y-20 lg:translate-y-28">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="grid grid-cols-2 gap-4 items-end mt-8 lg:mt-0"
                >
                  {/* Dr. Naveen */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative overflow-hidden p-2">
                      <img
                        src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/37a824af35a9003237db66be11bbe263.png"
                        alt="Dr. Naveen Shamnur"
                        className="h-36 md:h-44 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 h-20 md:h-24 flex flex-col justify-start drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      <h3 className="text-white font-bold text-lg md:text-xl">Dr. Naveen Shamnur</h3>
                      <p className="text-accent text-xs md:text-sm font-bold mt-0.5 tracking-wide uppercase">
                        Dental Specialist orthodontist
                      </p>
                    </div>
                  </div>

                  {/* Dr. Sunitha */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="relative overflow-hidden p-2">
                      <img
                        src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/478df36d82fc64b544111f8c6fd0f1dc.png"
                        alt="Dr. Sunitha N Shamnur"
                        className="h-36 md:h-44 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 h-20 md:h-24 flex flex-col justify-start drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      <h3 className="text-white font-bold text-lg md:text-xl">Dr. Sunitha Shamnur</h3>
                      <p className="text-accent text-xs md:text-sm font-bold mt-0.5 tracking-wide uppercase">
                        Specialist Prosthodontist and Implantologist
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                Why Choose Us?
              </h2>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight mb-3">
                Our Care
              </h3>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                Gentle dental services tailored to keep your smile healthy and bright.
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center mb-16"
            >
              <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white max-w-4xl mx-auto leading-snug">
                Delivering Excellence Through{" "}
                <span className="text-accent">Trust</span>,{" "}
                <span className="text-accent">Quality</span>, and{" "}
                <span className="text-accent">Innovation</span>
              </h4>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
              
              {/* Left Column: 2 features */}
              <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-6 lg:gap-12 text-center lg:text-right items-center lg:items-end">
                {/* Feature 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-end justify-center">
                    <div className="w-12 h-12 rounded-full border border-accent bg-accent/5 text-accent flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Star className="w-6 h-6 fill-accent text-accent group-hover:fill-accent-foreground group-hover:text-accent-foreground" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-accent">Quality Assurance</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Delivering reliable and precise results with top-quality standards.
                  </p>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-end justify-center">
                    <div className="w-12 h-12 rounded-full border border-accent bg-accent/5 text-accent flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-accent">Patient-Centric Care</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Compassionate dental treatments focused entirely on your comfort and long-term well-being.
                  </p>
                </motion.div>
              </div>

              {/* Center Column: Glossy 3D Tooth Graphic */}
              <div className="lg:col-span-4 flex justify-center py-6 lg:py-0 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative flex items-center justify-center"
                >
                  {/* Decorative rotating dotted circles / accent light rings */}
                  <div className="absolute w-72 h-72 rounded-full border-2 border-dashed border-accent/20 animate-[spin_60s_linear_infinite] z-0"></div>
                  <div className="absolute w-64 h-64 rounded-full border border-accent/10 z-0"></div>
                  
                  {/* Dotted indicator nodes around the circle */}
                  <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                  <div className="absolute bottom-0 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                  <div className="absolute left-0 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                  <div className="absolute right-0 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                  
                  {/* Tooth image */}
                  <img
                    src="/3d-tooth.png"
                    alt="Glossy 3D Tooth Illustration"
                    className="w-48 h-48 md:w-56 md:h-56 object-contain z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] animate-[bounce_5s_infinite_ease-in-out]"
                  />
                </motion.div>
              </div>

              {/* Right Column: 2 features */}
              <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-6 lg:gap-12 text-center lg:text-left items-center lg:items-start">
                {/* Feature 3 */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-start justify-center">
                    <div className="w-12 h-12 rounded-full border border-accent bg-accent/5 text-accent flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-accent">Advanced Technology</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Modern tools for efficient, safe, and accurate execution.
                  </p>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-start justify-center">
                    <div className="w-12 h-12 rounded-full border border-accent bg-accent/5 text-accent flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-accent">Timely Service</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Prompt appointments and scheduling designed to value your time and convenience.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="mb-4">Why Choose SS Dental Care</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Excellence in dental care since 2014
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  <StatCounter end={12} suffix="+" />
                </h3>
                <p className="text-muted-foreground">Years of Excellence</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  <StatCounter end={4.8} suffix=" ★" />
                </h3>
                <p className="text-muted-foreground">Google Rating</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  <StatCounter end={550} suffix="+" />
                </h3>
                <p className="text-muted-foreground">Happy Patients</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Advanced</h3>
                <p className="text-muted-foreground">Technology</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 bg-card rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6 text-center">Our Advanced Technology</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <p className="font-medium mb-1">Digital Intraoral Scanning</p>
                  <p className="text-sm text-muted-foreground">Precise 3D imaging for accurate diagnosis</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <p className="font-medium mb-1">3D Printing Technology</p>
                  <p className="text-sm text-muted-foreground">Custom dental solutions with precision</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <p className="font-medium mb-1">RVG Digital X-Ray</p>
                  <p className="text-sm text-muted-foreground">Instant, low-radiation imaging</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                Quality dental care with a gentle, personal touch.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {services.slice(0, 10).map((service, index) => (
                <ServiceCard key={service.slug} {...service} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-white font-semibold text-base shadow-md hover:bg-accent/90 transition-all duration-200 hover:-translate-y-0.5"
              >
                View All Services →
              </a>
            </div>
          </div>
        </section>



        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6">Visit Our Clinic</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Address</p>
                      <p className="text-muted-foreground">
                        SS Dental Care, 2873, S S Plaza, 1st Floor,<br />
                        4th Main, 4th Cross Rd, MCC B Block,<br />
                        Davanagere, Karnataka 577004
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Hours</p>
                      <p className="text-muted-foreground">
                        Monday – Saturday: 10:30 AM – 9:00 PM<br />
                        Sunday: 10:30 AM – 2:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Contact</p>
                      <p className="text-muted-foreground">
                        Phone: +91 9448455699<br />
                        Email: ssdentalcare.in@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
                <Link to="/contact">
                  <Button variant="outline" className="transition-all duration-200 active:scale-98">
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-lg h-96 group relative cursor-pointer"
              >
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=SS+Dental+Care+Davanagere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src="/clinic-map.png"
                    alt="SS Dental Care Location Map"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 flex items-center justify-center">
                    <span className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                      Open in Google Maps
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="mb-4">Book Your Appointment</h2>
                <p className="text-lg text-muted-foreground">
                  Fill in your details and we'll contact you shortly
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl shadow-lg">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="mt-2 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full transition-all duration-200 active:scale-98"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
