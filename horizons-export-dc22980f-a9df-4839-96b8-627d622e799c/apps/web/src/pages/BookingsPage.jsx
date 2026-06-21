
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

function BookingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    'Teeth Whitening',
    'Veneers',
    'Dental Implants',
    'Cavity Filling',
    'Digital Dentures',
    'Broken Teeth',
    'Aligners',
    'Smile Design',
    'Orthodontic Treatment',
    'Orthodontic Surgery',
    'Full Mouth Implant',
    'Pterygoid & Zygomatic Implant',
    'Laser Dental Treatment',
    'Extraction',
    'Gum Therapy'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.date || !formData.service) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Appointment request received. We will confirm your booking shortly.');
      setFormData({ name: '', phone: '', date: '', service: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Book Appointment - SS Dental Care | Schedule Your Visit</title>
        <meta name="description" content="Book your dental appointment at SS Dental Care in Davangere. Choose your preferred service and date for a convenient visit." />
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
              <h1 className="mb-6">Book Your Appointment</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Schedule your visit and take the first step towards a healthier smile
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl shadow-lg"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Select Service</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger className="mt-2 text-foreground">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full transition-all duration-200 active:scale-98"
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Book Appointment'}
                  </Button>
                </form>

                <div className="mt-8 p-6 bg-muted rounded-xl">
                  <h3 className="font-semibold mb-3">What happens next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>We will review your appointment request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Our team will call you to confirm the date and time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>You'll receive a confirmation message with appointment details</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <h3 className="text-xl font-semibold mb-4">Need immediate assistance?</h3>
                <p className="text-muted-foreground mb-6">
                  Call us directly at <a href="tel:+919448455699" className="text-accent hover:underline">+91 9448455699</a>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="tel:+919448455699">
                    <Button variant="outline" className="transition-all duration-200 active:scale-98">
                      Call Now
                    </Button>
                  </a>
                  <a href="https://wa.me/919448455699?text=Hello%20I%20want%20to%20book%20an%20appointment" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="transition-all duration-200 active:scale-98">
                      WhatsApp Us
                    </Button>
                  </a>
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

export default BookingsPage;
