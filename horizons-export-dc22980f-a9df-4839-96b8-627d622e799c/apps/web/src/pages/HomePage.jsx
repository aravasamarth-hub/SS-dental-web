
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Award, Zap, Sparkles, Calendar, MapPin, Clock, Mail, Phone as PhoneIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import DoctorCard from '@/components/DoctorCard';
import TestimonialCard from '@/components/TestimonialCard';
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
    { title: 'Teeth Whitening', description: 'Professional whitening treatments for a brighter, more confident smile.', icon: Sparkles, slug: 'teeth-whitening' },
    { title: 'Veneers', description: 'Custom porcelain veneers to transform your smile with natural-looking results.', icon: Star, slug: 'veneers' },
    { title: 'Dental Implants', description: 'Permanent tooth replacement solutions with titanium implants.', icon: Award, slug: 'dental-implants' },
    { title: 'Cavity Filling', description: 'Advanced composite fillings that match your natural tooth color.', icon: Zap, slug: 'cavity-filling' },
    { title: 'Digital Dentures', description: 'Precision-crafted dentures using advanced 3D printing technology.', icon: Sparkles, slug: 'digital-dentures' },
    { title: 'Broken Teeth', description: 'Expert restoration of damaged or broken teeth with durable materials.', icon: Star, slug: 'broken-teeth' },
    { title: 'Aligners', description: 'Clear aligner therapy for discreet orthodontic treatment.', icon: Award, slug: 'aligners' },
    { title: 'Smile Design', description: 'Comprehensive aesthetic treatments for your perfect smile.', icon: Zap, slug: 'smile-design' },
    { title: 'Orthodontic Treatment', description: 'Traditional and modern braces for all ages.', icon: Sparkles, slug: 'orthodontic-treatment' },
    { title: 'Orthodontic Surgery', description: 'Surgical orthodontic solutions for complex cases.', icon: Star, slug: 'orthodontic-surgery' },
    { title: 'Full Mouth Implant', description: 'Complete mouth restoration with multiple implants.', icon: Award, slug: 'full-mouth-implant' },
    { title: 'Pterygoid & Zygomatic Implant', description: 'Advanced implant solutions for challenging bone conditions.', icon: Zap, slug: 'pterygoid-zygomatic-implant' },
    { title: 'Laser Dental Treatment', description: 'Minimally invasive procedures using advanced laser technology.', icon: Sparkles, slug: 'laser-dental-treatment' },
    { title: 'Extraction', description: 'Safe and comfortable tooth extraction including wisdom teeth.', icon: Star, slug: 'extraction' },
    { title: 'Gum Therapy', description: 'Comprehensive periodontal care for healthy gums.', icon: Award, slug: 'gum-therapy' },
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

  const testimonials = [
    { name: 'Priya Sharma', rating: 5, review: 'Excellent service and very professional staff. Dr. Naveen explained everything clearly before my orthodontic treatment. Highly recommend!', date: 'May 2026' },
    { name: 'Rajesh Kumar', rating: 5, review: 'Got my dental implants done here. The entire process was smooth and painless. Dr. Sunitha is very skilled and caring.', date: 'April 2026' },
    { name: 'Ananya Reddy', rating: 5, review: 'Best dental clinic in Davangere! The clinic is very clean and equipped with latest technology. My teeth whitening results are amazing.', date: 'March 2026' },
    { name: 'Vikram Patel', rating: 5, review: 'I was nervous about getting braces, but the team made me feel comfortable. The results are worth it. Thank you SS Dental Care!', date: 'February 2026' },
    { name: 'Meera Iyer', rating: 5, review: 'Professional and friendly environment. Got my cavity filled without any pain. The digital scanning technology is impressive.', date: 'January 2026' },
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

        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="mb-6">
                  Trusted Dental Care in Davangere
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  Experience world-class dental treatments with advanced technology and compassionate care
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">4.8</span>
                    <span className="text-sm text-muted-foreground ml-1">Google Rating</span>
                  </div>
                  <div className="bg-muted px-4 py-2 rounded-full">
                    <span className="font-semibold">550+ Happy Patients</span>
                  </div>
                </div>

                <Link to="/bookings">
                  <Button size="lg" className="text-lg px-8 transition-all duration-200 active:scale-98">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </Link>
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
              <h2 className="mb-4">Meet Our Expert Doctors</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Highly qualified specialists dedicated to your dental health
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {doctors.map((doctor, index) => (
                <DoctorCard key={doctor.slug} {...doctor} index={index} />
              ))}
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

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive dental care for all your needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={service.slug} {...service} index={index} />
              ))}
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
              <h2 className="mb-4">What Our Patients Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real experiences from our valued patients
              </p>
            </motion.div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} index={index} />
              ))}
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
                <Link to="/location">
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
                className="rounded-2xl overflow-hidden shadow-lg h-96"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.123456789!2d75.9234567!3d14.4567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDI3JzI0LjQiTiA3NcKwNTUnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SS Dental Care location map"
                ></iframe>
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
