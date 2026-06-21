
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function BlogPage() {
  const blogPosts = [
    {
      title: '5 signs you need to visit a dentist',
      excerpt: 'Learn about the warning signs that indicate it\'s time for a dental checkup. From persistent pain to bleeding gums, discover when professional care is essential.',
      date: 'May 28, 2026',
      author: 'Dr. Naveen Shamnur',
      slug: 'signs-visit-dentist'
    },
    {
      title: 'How to maintain oral hygiene at home',
      excerpt: 'Discover effective daily routines and techniques to keep your teeth and gums healthy between dental visits. Simple habits that make a big difference.',
      date: 'May 15, 2026',
      author: 'Dr. Sunitha N Shamnur',
      slug: 'maintain-oral-hygiene'
    },
    {
      title: 'Benefits of dental implants over dentures',
      excerpt: 'Explore why dental implants are becoming the preferred choice for tooth replacement. Compare longevity, comfort, and functionality with traditional dentures.',
      date: 'April 30, 2026',
      author: 'Dr. Sunitha N Shamnur',
      slug: 'implants-vs-dentures'
    },
    {
      title: 'Understanding orthodontic treatment options',
      excerpt: 'From traditional braces to clear aligners, learn about modern orthodontic solutions. Find the right treatment for your smile transformation journey.',
      date: 'April 12, 2026',
      author: 'Dr. Naveen Shamnur',
      slug: 'orthodontic-treatment-options'
    },
    {
      title: 'The importance of regular dental checkups',
      excerpt: 'Prevention is better than cure. Understand why routine dental visits are crucial for maintaining long-term oral health and catching problems early.',
      date: 'March 25, 2026',
      author: 'Dr. Naveen Shamnur',
      slug: 'regular-dental-checkups'
    },
    {
      title: 'Teeth whitening: What you need to know',
      excerpt: 'Get the facts about professional teeth whitening. Learn about the process, expected results, and how to maintain your brighter smile.',
      date: 'March 8, 2026',
      author: 'Dr. Sunitha N Shamnur',
      slug: 'teeth-whitening-guide'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Blog - SS Dental Care | Dental Health Tips & Insights</title>
        <meta name="description" content="Read expert dental health tips, treatment guides, and oral care advice from SS Dental Care's experienced dentists in Davangere." />
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
              <h1 className="mb-6">Dental Health Blog</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Expert insights and tips for maintaining optimal oral health
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="flex-1 mb-4 leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                      <Button variant="ghost" className="w-full justify-between group">
                        Read More
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </CardContent>
                  </Card>
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
              <h2 className="mb-6">Stay Updated</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Follow us on social media for the latest dental health tips, clinic updates, and special offers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="https://facebook.com/ssdentalcare" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="transition-all duration-200 active:scale-98">
                    Follow on Facebook
                  </Button>
                </a>
                <a href="https://instagram.com/ssdentalcare" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="transition-all duration-200 active:scale-98">
                    Follow on Instagram
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default BlogPage;
