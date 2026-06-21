
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Award, Heart, Users, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';

function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Your comfort and well-being are our top priorities. We listen, understand, and provide personalized treatment plans.'
    },
    {
      icon: Award,
      title: 'Excellence in Quality',
      description: 'We maintain the highest standards in dental care using advanced technology and proven treatment methods.'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description: 'Our skilled professionals bring years of expertise and continuous learning to every patient interaction.'
    },
    {
      icon: Zap,
      title: 'Advanced Technology',
      description: 'We invest in cutting-edge equipment to provide accurate diagnoses and effective treatments.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - SS Dental Care | Expert Dental Team in Davangere</title>
        <meta name="description" content="Learn about SS Dental Care's mission, values, and expert team. Serving Davangere with quality dental care since 2014." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="mb-6">About SS Dental Care</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your trusted partner in dental health since 2014
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    SS Dental Care was established in 2014 with a vision to provide world-class dental services to the people of Davangere. What started as a small clinic has grown into one of the most trusted dental care centers in the region.
                  </p>
                  <p>
                    Founded by Dr. Naveen Shamnur and Dr. Sunitha N Shamnur, both highly qualified specialists with MDS degrees, our clinic combines expertise with compassion. We believe that quality dental care should be accessible to everyone, and we've built our practice on this principle.
                  </p>
                  <p>
                    Over the years, we've treated more than 550 patients, earning a 4.8-star rating on Google. Our commitment to excellence, patient comfort, and advanced technology has made us the preferred choice for families across Davangere.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-xl"
              >
                <img
                  src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/49d7bbcfbcca055c20b75b55c7aded8e.jpg"
                  alt="SS Dental Care clinic reception area"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                To provide exceptional dental care that improves lives, builds confidence, and creates lasting smiles. We are committed to using the latest technology and techniques while maintaining a warm, patient-centered approach.
              </p>
            </motion.div>
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
              <h2 className="mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card p-6 rounded-2xl shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="mb-4">Meet Our Founders</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experienced specialists dedicated to your dental health
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/37a824af35a9003237db66be11bbe263.png"
                    alt="Dr. Naveen Shamnur MDS - Orthodontist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Dr. Naveen Shamnur</h3>
                  <p className="text-accent font-medium mb-3">MDS - Orthodontist</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Specializing in braces, aligners, and orthodontic surgery with over 10 years of experience in creating beautiful, healthy smiles.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src="https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/478df36d82fc64b544111f8c6fd0f1dc.png"
                    alt="Dr. Sunitha N Shamnur MDS - Prosthodontist and Implantologist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Dr. Sunitha N Shamnur</h3>
                  <p className="text-accent font-medium mb-3">MDS - Prosthodontist & Implantologist</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Expert in dental implants, dentures, and smile design with a decade of experience in restorative and cosmetic dentistry.
                  </p>
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

export default AboutPage;
