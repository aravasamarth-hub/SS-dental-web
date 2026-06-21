
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';

function GalleryPage() {
  const images = [
    {
      url: 'https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/49d7bbcfbcca055c20b75b55c7aded8e.jpg',
      title: 'Modern Reception Area',
      description: 'Welcoming and comfortable waiting space for our patients'
    },
    {
      url: 'https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/f34a68507a359606e1a967332f54aad0.jpg',
      title: 'Advanced Treatment Procedure',
      description: 'State-of-the-art dental procedures with precision equipment'
    },
    {
      url: 'https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/9af403faf96bdb81357a2ca980031016.jpg',
      title: 'Comfortable Waiting Area',
      description: 'Relaxing environment designed for patient comfort'
    },
    {
      url: 'https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/600adc0c649fab36a9d76fa69829b794.jpg',
      title: 'Clinic Interior',
      description: 'Clean, modern facilities with advanced dental technology'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Gallery - SS Dental Care | Our Clinic & Facilities</title>
        <meta name="description" content="Explore SS Dental Care's modern facilities, advanced equipment, and comfortable treatment spaces in Davangere." />
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
              <h1 className="mb-6">Our Clinic Gallery</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Take a virtual tour of our modern facilities and advanced dental technology
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                      <p className="text-sm opacity-90">{image.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="mb-6">Experience Our Clinic</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Our clinic is designed with your comfort in mind. From the moment you step in, you'll experience a welcoming environment equipped with the latest dental technology. We maintain the highest standards of cleanliness and hygiene to ensure your safety and peace of mind.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Modern Equipment</h3>
                  <p className="text-sm text-muted-foreground">Latest dental technology for precise treatments</p>
                </div>
                <div className="bg-card p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Comfortable Spaces</h3>
                  <p className="text-sm text-muted-foreground">Relaxing environment for stress-free visits</p>
                </div>
                <div className="bg-card p-6 rounded-xl">
                  <h3 className="font-semibold mb-2">Hygiene Standards</h3>
                  <p className="text-sm text-muted-foreground">Strict sterilization protocols for your safety</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default GalleryPage;
