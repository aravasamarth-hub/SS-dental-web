import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Check, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Button } from '@/components/ui/button';

// Lazy YouTube: loads iframe only on click, saving ~500KB of 3rd-party scripts on initial load
function LazyYouTube({ videoId, title }) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (active) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      onClick={() => setActive(true)}
      className="absolute inset-0 w-full h-full flex items-center justify-center group focus:outline-none"
      aria-label={`Play ${title}`}
      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        width={480}
        height={270}
      />
      {/* Play button overlay */}
      <div className="relative z-10 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </button>
  );
}

function ServiceDetailLayout({
  title,
  metaDescription,
  heroDescription,
  aboutTitle,
  aboutText,
  imageSrc,
  benefits,
  aftercareTips,
  youtubeVideoId,
  videoObserveItems,
  videoDescription
}) {
  return (
    <>
      <Helmet>
        <title>{title} in Davangere - SS Dental Care</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {heroDescription}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Details Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Side: Image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative group rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-muted aspect-[4/3] w-full"
                >
                  <img
                    src={imageSrc}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                {/* Right Side: Text & Lists */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">{aboutTitle}</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      <strong>{title}</strong> {aboutText.replace(new RegExp('^' + title + '\\s+(is|are)\\s+', 'i'), '$1 ')}
                    </p>
                  </div>

                  {/* Clean side-by-side lists */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-border/60">
                    {/* Benefits */}
                    {benefits && benefits.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                          <span className="w-1 h-5 rounded-full bg-accent" />
                          Benefits
                        </h3>
                        <ul className="space-y-2">
                          {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-muted-foreground">
                              <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Aftercare Tips */}
                    {aftercareTips && aftercareTips.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                          <span className="w-1 h-5 rounded-full bg-primary" />
                          Aftercare Tips
                        </h3>
                        <ul className="space-y-2">
                          {aftercareTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-muted-foreground">
                              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Book Appointment Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
              >
                <Link to="/bookings">
                  <Button size="lg" className="px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition-all duration-300">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </Link>
              </motion.div>

              {/* Video Section */}
              {youtubeVideoId && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="mt-24 border-t border-border/60 pt-20"
                >
                  <h2 className="text-3xl font-extrabold mb-4 text-center">
                    {title} Video Demo
                  </h2>
                  <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                    Here is a real video demonstration of professional {title.toLowerCase()}:
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Video Player */}
                    <div className="lg:col-span-7 bg-card p-3 rounded-2xl border border-border/50 shadow-2xl relative">
                    {/* Lazy YouTube Player */}
                    <div className="aspect-video rounded-xl overflow-hidden relative bg-black">
                      <LazyYouTube videoId={youtubeVideoId} title={`${title} Video Demonstration`} />
                    </div>
                    </div>

                    {/* What you observe in the video */}
                    <div className="lg:col-span-5 space-y-6">
                      <h3 className="text-2xl font-bold">What you&apos;ll observe in the video:</h3>
                      <ul className="space-y-4">
                        {videoObserveItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                      {videoDescription && (
                        <p className="text-sm text-muted-foreground/80 leading-relaxed italic border-l-2 border-accent pl-4">
                          {videoDescription.replace('in-clinic whitening procedure', `in-clinic ${title.toLowerCase()} procedure`)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default ServiceDetailLayout;
