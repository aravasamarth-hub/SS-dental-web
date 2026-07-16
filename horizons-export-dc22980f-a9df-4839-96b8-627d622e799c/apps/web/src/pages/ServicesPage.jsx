import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Sparkles, Activity } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';

function ServicesPage() {
  const valueProps = [
    {
      icon: Sparkles,
      title: 'Experienced Care',
      description: 'Experienced care with 25+ years ensuring safe, reliable and effective dental treatments.'
    },
    {
      icon: HeartPulse,
      title: 'Painless Procedures',
      description: 'Painless procedures using advanced techniques for comfortable and stress-free dental experience always.'
    },
    {
      icon: Activity,
      title: 'Modern Technology',
      description: 'Modern technology with digital tools delivering accurate, faster and high-quality dental treatment results.'
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Environment',
      description: 'Hygienic environment following strict sterilization protocols ensuring complete safety and patient protection standards.'
    }
  ];

  const allServices = [
    {
      title: 'Teeth Whitening',
      description: 'Removes stains and brightens teeth safely with quick visible results.',
      image: '/services/teeth-whitening-hq.jpg',
      path: '/services/teeth-whitening'
    },
    {
      title: 'Veneers',
      description: 'Thin shells covering teeth to enhance appearance, fixing chips, gaps, stains.',
      image: '/services/veneers.jpg',
      path: '/services/veneers'
    },
    {
      title: 'Dental Implants',
      description: 'Replaces missing teeth with durable implants providing natural look and strength.',
      image: '/services/dental-implants.jpg',
      path: '/services/dental-implants'
    },
    {
      title: 'Laser Dental Treatment',
      description: 'Uses advanced laser technology for precise, painless, bloodless and faster dental procedures.',
      image: '/services/laser-treatment.jpg',
      path: '/services/laser-dental-treatment'
    },
    {
      title: 'Aligners',
      description: 'Clear removable trays that gradually straighten teeth without visible braces.',
      image: '/services/aligners.png',
      path: '/services/aligners'
    },
    {
      title: 'Orthodontic Treatment (Braces)',
      description: 'Corrects misaligned teeth and bite issues for improved function and appearance.',
      image: '/services/braces-hq.png',
      path: '/services/orthodontic-treatment'
    },
    {
      title: 'Orthognathic Surgery',
      description: 'Corrects jaw alignment issues improving function, bite, and overall facial balance.',
      image: '/services/orthognathic.jpg',
      path: '/services/orthodontic-surgery'
    },
    {
      title: 'Cavity Filling (Restoration)',
      description: 'Restoring damaged teeth with comfortable, lasting fillings.',
      image: '/services/cavity-filling.jpg',
      path: '/services/cavity-filling'
    },
    {
      title: 'Broken Teeth Restoration',
      description: 'Expert restoration of damaged or broken teeth with durable, seamless tooth-colored bonding.',
      image: '/services/broken-teeth.png',
      path: '/services/broken-teeth'
    },
    {
      title: 'Digital Dentures',
      description: 'Modern digital prosthodontics for lightweight, highly precise, and comfortable dentures.',
      image: '/services/digital-dentures.png',
      path: '/services/digital-dentures'
    },
    {
      title: 'Full Mouth Implant',
      description: 'Complete arch restorations replacing all missing teeth with a premium implant-supported bridge.',
      image: '/services/full-mouth-implant.png',
      path: '/services/full-mouth-implant'
    },
    {
      title: 'Pterygoid & Zygomatic Implant',
      description: 'Advanced implant procedures utilizing facial bones for patients with severe upper jaw bone loss.',
      image: '/services/pterygoid-zygomatic-implant.png',
      path: '/services/pterygoid-zygomatic-implant'
    },
    {
      title: 'Extraction',
      description: 'Safe, comfortable, and painless tooth removal including surgical wisdom teeth extractions.',
      image: '/services/extraction.png',
      path: '/services/extraction'
    },
    {
      title: 'Gum Therapy',
      description: 'Advanced deep cleaning, scaling, and laser therapy to treat gingivitis and restore gum health.',
      image: '/services/gum-therapy.png',
      path: '/services/gum-therapy'
    },
    {
      title: 'Smile Design',
      description: 'Customized digital smile makeovers analyzing facial features to create your dream aesthetic smile.',
      image: '/services/smile-design.png',
      path: '/services/smile-design'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - SS Dental Care Davangere</title>
        <meta name="description" content="Discover our wide range of professional dental treatments in Davangere. From teeth whitening and veneers to dental implants, braces, and advanced oral surgery." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <div>
          <Header />
          <FloatingWhatsAppButton />
          <BackToTopButton />

          {/* Hero Section */}
          <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight">Our Services</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We offer a comprehensive range of premium dental treatments, combining expert clinical care with advanced technology to ensure a healthy, brilliant smile for your family.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
                {/* Left: iTero/Dental Scan Hero Image */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-muted border border-muted"
                >
                  <img
                    src="/services/services_hero_scan.png"
                    alt="Dentist explaining a digital 3D scan to a patient"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Right: Key Values list */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="lg:col-span-6 space-y-6"
                >
                  {valueProps.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Grid Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-3">All Treatments</h2>
                <p className="text-muted-foreground">
                  Quality dental care tailored for your perfect smile. Select any treatment to learn more.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-[1400px] mx-auto">
                {allServices.map((service, index) => (
                  <motion.div
                    key={service.path}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group flex flex-col justify-between bg-card hover:bg-muted/30 border border-muted/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Link to={service.path} className="flex-1 flex flex-col">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-muted border-b border-muted/40 relative">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                          {service.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ServicesPage;
