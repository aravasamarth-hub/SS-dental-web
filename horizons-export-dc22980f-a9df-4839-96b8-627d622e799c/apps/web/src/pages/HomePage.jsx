
import React, { useState, useEffect, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CheckCircle2 } from 'lucide-react';

function HomePage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  // Refs for tracking coordinates of the 4 features and the central logo
  const containerRef = useRef(null);
  const qaIconRef = useRef(null);
  const pcIconRef = useRef(null);
  const atIconRef = useRef(null);
  const tsIconRef = useRef(null);
  const logoRef = useRef(null);

  const [coords, setCoords] = useState({
    qa: { x: 0, y: 0 },
    pc: { x: 0, y: 0 },
    at: { x: 0, y: 0 },
    ts: { x: 0, y: 0 },
    logo: { x: 0, y: 0 },
  });

  const updateCoordinates = () => {
    if (!containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    
    const getCenter = (elRef) => {
      if (!elRef.current) return { x: 0, y: 0 };
      const rect = elRef.current.getBoundingClientRect();
      return {
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top + rect.height / 2,
      };
    };

    setCoords({
      qa: getCenter(qaIconRef),
      pc: getCenter(pcIconRef),
      at: getCenter(atIconRef),
      ts: getCenter(tsIconRef),
      logo: getCenter(logoRef),
    });
  };

  useEffect(() => {
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    // Double check on mounting shifts
    const timer1 = setTimeout(updateCoordinates, 300);
    const timer2 = setTimeout(updateCoordinates, 1000);
    return () => {
      window.removeEventListener('resize', updateCoordinates);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getPath = (from, to, idx) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    // Alternate curves for different streams to create a natural, organic flow
    const factor = (idx % 2 === 0 ? 0.08 : -0.08);
    return {
      x: [0, dx * 0.5 - dy * factor, dx],
      y: [0, dy * 0.5 + dx * factor, dy]
    };
  };

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
      image: '/services/broken-teeth.jpg',
      slug: 'broken-teeth'
    },
    {
      title: 'Aligners',
      description: 'Clear removable trays that gradually straighten teeth without visible braces.',
      image: '/services/aligners.jpg',
      slug: 'aligners'
    },
    {
      title: 'Orthodontic Treatment (Braces)',
      description: 'Corrects misaligned teeth and bite issues for improved function and appearance.',
      image: '/services/braces.jpg',
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
      image: '/services/smile-design.jpg',
      slug: 'smile-design'
    }
  ];

  const doctors = [
    {
      name: 'Dr. Naveen Shamnur',
      qualification: 'MDS - Orthodontist and Dentofacial Orthopedics',
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



  const submittingRef = React.useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || submittingRef.current) return;
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields (Name and Phone)');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      if (!supabase) {
        console.error('Supabase client is null because VITE_SUPABASE_ANON_KEY is missing!');
        toast.error('Database connection key is missing in website settings.');
      } else {
        const getFormattedTimestamp = () => {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          let hours = now.getHours();
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          const strHours = String(hours).padStart(2, '0');
          return `${day}/${month}/${year} ${strHours}:${minutes}:${seconds} ${ampm}`;
        };

        const today = new Date().toISOString().split('T')[0];
        const appointmentTimeVal = (formData.message ? `Msg: ${formData.message}` : 'General Consult').slice(0, 20);
        const { error } = await supabase.from('appointments').insert([
          {
            created_at: getFormattedTimestamp(),
            full_name: formData.name,
            email: formData.email || '',
            phone: formData.phone,
            appointment_date: today,
            appointment_time: appointmentTimeVal
          }
        ]);
        if (error) {
          console.error('Error inserting into Supabase:', error);
          toast.error(`Database error: ${error.message}`);
        } else {
          console.log('Successfully inserted inquiry into Supabase');
          setIsSubmitted(true);
          toast.success('Your message has been sent successfully! We will contact you shortly.');
          setFormData({ name: '', email: '', phone: '', message: '' });
        }
      }
    } catch (err) {
      console.error('Supabase submission exception:', err);
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Best Dental Clinic in Davangere - Implants & Aligners | SS Dental Care</title>
        <meta name="description" content="Discover the best dental clinic in Davangere offering top-notch services including dental implants, aligners, and whitening treatments." />
        <meta name="keywords" content="best dental clinic in davangere, dental implants davangere, aligners davangere" />
        <link rel="preload" fetchPriority="high" as="image" href="/hero-bg.jpg" type="image/jpeg" />
        <link rel="preload" fetchPriority="high" as="image" href="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/37a824af35a9003237db66be11bbe263.png" type="image/png" />
        <link rel="preload" fetchPriority="high" as="image" href="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/478df36d82fc64b544111f8c6fd0f1dc.png" type="image/png" />
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
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left text-white">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-5 max-w-2xl flex flex-col items-center lg:items-start"
                >
                  {/* Badge */}
                  <div className="flex items-center justify-center lg:justify-start gap-2.5 text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <Star className="h-8 w-8 md:h-9 md:w-9 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="text-3xl md:text-4xl tracking-wide uppercase">SS DENTAL CARE</span>
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
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-white text-sm md:text-base font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
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
                  <Link to="/doctors/naveen-shamnur" className="flex flex-col items-center text-center group cursor-pointer">
                    <div className="relative overflow-hidden p-2">
                      <img
                        src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/37a824af35a9003237db66be11bbe263.png"
                        alt="Dr. Naveen Shamnur"
                        fetchPriority="high"
                        width={176}
                        height={176}
                        className="h-36 md:h-44 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 h-20 md:h-24 flex flex-col justify-start drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-accent transition-colors duration-200">Dr. Naveen Shamnur</h3>
                      <p className="text-accent text-xs md:text-sm font-bold mt-0.5 tracking-wide uppercase">
                        orthodontist and dentofacial orthopedics
                      </p>
                    </div>
                  </Link>

                  {/* Dr. Sunitha */}
                  <Link to="/doctors/sunitha-shamnur" className="flex flex-col items-center text-center group cursor-pointer">
                    <div className="relative overflow-hidden p-2">
                      <img
                        src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/478df36d82fc64b544111f8c6fd0f1dc.png"
                        alt="Dr. Sunitha N Shamnur"
                        fetchPriority="high"
                        width={176}
                        height={176}
                        className="h-36 md:h-44 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2 h-20 md:h-24 flex flex-col justify-start drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-accent transition-colors duration-200">Dr. Sunitha Shamnur</h3>
                      <p className="text-accent text-xs md:text-sm font-bold mt-0.5 tracking-wide uppercase">
                        Prosthodontist and Implantologist
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section ref={containerRef} className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 relative overflow-hidden">
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
                {/* Feature 1 - Quality Assurance (Green) */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-end justify-center">
                    <div ref={qaIconRef} className="w-12 h-12 rounded-full border border-emerald-500/30 dark:border-emerald-400/30 bg-emerald-500/5 text-emerald-500 dark:text-emerald-400 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400 group-hover:text-white dark:group-hover:text-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.05)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                      <Star className="w-6 h-6 fill-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:fill-white/10 dark:group-hover:fill-slate-900/10 group-hover:text-white dark:group-hover:text-slate-900" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Quality Assurance</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Delivering reliable and precise results with top-quality standards.
                  </p>
                </motion.div>

                {/* Feature 2 - Patient-Centric Care (Red/Orange) */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-end justify-center">
                    <div ref={pcIconRef} className="w-12 h-12 rounded-full border border-accent/30 bg-accent/5 text-accent flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground shadow-[0_0_10px_rgba(230,60,10,0.05)] group-hover:shadow-[0_0_20px_rgba(230,60,10,0.25)]">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-accent">Patient-Centric Care</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Compassionate dental treatments focused entirely on your comfort and long-term well-being.
                  </p>
                </motion.div>
              </div>

              {/* Center Column: Logo */}
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
                  
                  {/* Dotted indicator nodes aligned perfectly to the w-72 rotating dashed circle */}
                  <div className="absolute w-72 h-72 pointer-events-none z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                  </div>
                  
                  {/* Clinic logo container with floating and hover animations */}
                  <motion.div
                    ref={logoRef}
                    className="w-48 h-48 md:w-56 md:h-56 bg-transparent rounded-3xl p-5 flex items-center justify-center z-10 cursor-pointer drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                    animate={{
                      y: [0, -12, 0],
                    }}
                    transition={{
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    }}
                    whileHover={{
                      scale: 1.08,
                      rotate: 3,
                    }}
                  >
                    {/* Transparent PNG logo — real alpha channel, no blend tricks needed */}
                    <img
                      src="/ss-dental-logo-full.png"
                      alt="SS Dental Care Logo"
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Column: 2 features */}
              <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-6 lg:gap-12 text-center lg:text-left items-center lg:items-start">
                {/* Feature 3 - Advanced Technology (Blue) */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-start justify-center">
                    <div ref={atIconRef} className="w-12 h-12 rounded-full border border-sky-500/30 dark:border-sky-400/30 bg-sky-500/5 text-sky-500 dark:text-sky-400 flex items-center justify-center transition-all duration-300 group-hover:bg-sky-500 dark:group-hover:bg-sky-400 group-hover:text-white dark:group-hover:text-slate-900 shadow-[0_0_10px_rgba(14,165,233,0.05)] group-hover:shadow-[0_0_20px_rgba(14,165,233,0.25)]">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-sky-600 dark:text-sky-400">Advanced Technology</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Modern tools for efficient, safe, and accurate execution.
                  </p>
                </motion.div>

                {/* Feature 4 - Timely Service (Pink) */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3 max-w-md group"
                >
                  <div className="flex lg:justify-start justify-center">
                    <div ref={tsIconRef} className="w-12 h-12 rounded-full border border-pink-500/30 dark:border-pink-400/30 bg-pink-500/5 text-pink-500 dark:text-pink-400 flex items-center justify-center transition-all duration-300 group-hover:bg-pink-500 dark:group-hover:bg-pink-400 group-hover:text-white dark:group-hover:text-slate-900 shadow-[0_0_10px_rgba(236,72,153,0.05)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <h5 className="text-xl font-bold text-pink-600 dark:text-pink-400">Timely Service</h5>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Prompt appointments and scheduling designed to value your time and convenience.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>

          {/* Animated color particles connecting features to the central logo */}
          {coords.logo.x !== 0 && [
            // Quality Assurance -> Green particles
            { from: coords.qa, to: coords.logo, color: '#10b981', delay: 0 },
            { from: coords.qa, to: coords.logo, color: '#10b981', delay: 1.5 },
            { from: coords.qa, to: coords.logo, color: '#10b981', delay: 3.0 },

            // Patient-Centric Care -> Orange/Red particles
            { from: coords.pc, to: coords.logo, color: '#e63c0a', delay: 0.7 },
            { from: coords.pc, to: coords.logo, color: '#e63c0a', delay: 2.2 },
            { from: coords.pc, to: coords.logo, color: '#e63c0a', delay: 3.7 },

            // Advanced Technology -> Blue particles
            { from: coords.at, to: coords.logo, color: '#008cd2', delay: 0.3 },
            { from: coords.at, to: coords.logo, color: '#008cd2', delay: 1.8 },
            { from: coords.at, to: coords.logo, color: '#008cd2', delay: 3.3 },

            // Timely Service -> Pink particles
            { from: coords.ts, to: coords.logo, color: '#ec4899', delay: 1.1 },
            { from: coords.ts, to: coords.logo, color: '#ec4899', delay: 2.6 },
            { from: coords.ts, to: coords.logo, color: '#ec4899', delay: 4.1 },
          ].map((particle, idx) => {
            const path = getPath(particle.from, particle.to, idx);
            return (
              <motion.div
                key={idx}
                className="absolute pointer-events-none z-20 rounded-full"
                style={{
                  left: particle.from.x,
                  top: particle.from.y,
                  x: '-50%',
                  y: '-50%',
                  width: '8px',
                  height: '8px',
                  backgroundColor: particle.color,
                  boxShadow: `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`,
                }}
                animate={{
                  x: path.x,
                  y: path.y,
                  scale: [0.5, 1.2, 1.2, 0.4],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: particle.delay,
                }}
              />
            );
          })}
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

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-white font-semibold text-base shadow-md hover:bg-accent/90 transition-all duration-200 hover:-translate-y-0.5"
              >
                View All Services →
              </Link>
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
                  <Link to="/location" className="flex items-start gap-3 group cursor-pointer">
                    <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium mb-1 group-hover:text-accent transition-colors">Address</p>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                        SS Dental Care, 2873, S S Plaza, 1st Floor,<br />
                        4th Main, 4th Cross Rd, MCC B Block,<br />
                        Davanagere, Karnataka 577004
                      </p>
                    </div>
                  </Link>
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
                        Phone: <a href="tel:+919448455699" className="hover:text-accent transition-colors">+91 9448455699</a><br />
                        Email: <a href="mailto:ssdentalcare.in@gmail.com" className="hover:text-accent transition-colors">ssdentalcare.in@gmail.com</a>
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
                    src="/clinic-map.jpg"
                    alt="SS Dental Care Location Map"
                    loading="lazy"
                    width={600}
                    height={384}
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

              {isSubmitted ? (
                <div className="bg-card border border-emerald-500/30 p-8 rounded-2xl shadow-xl text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Message Sent Successfully!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for reaching out. We have received your request and will contact you shortly.
                  </p>
                  <Button 
                    asChild
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link to="/bookings">Book Appointment</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl shadow-lg border border-border/50">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
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

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="mt-2 text-foreground placeholder:text-muted-foreground resize-none"
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
              )}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default HomePage;
