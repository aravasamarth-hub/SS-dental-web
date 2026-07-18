import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Check, ChevronLeft, ChevronRight, ArrowLeft, Calendar, HelpCircle, Navigation } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import BackToTopButton from '@/components/BackToTopButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function BookingsPage() {
  const [step, setStep] = useState('intro'); // 'intro', 'checkout', 'success'
  const [showModal, setShowModal] = useState(false);
  
  // Date & Time selection states
  const [selectedDay, setSelectedDay] = useState(16); // Default 16th July 2026
  const [selectedTime, setSelectedTime] = useState('05:00 PM'); // Default 5:00 PM
  
  // Checkout form states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Karnataka');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'Visit to pay'
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [price, setPrice] = useState(250);



  // Calendar dates helper for July 2026
  // July 1st starts on a Wednesday (index 2: Mon=0, Tue=1, Wed=2)
  const emptyDays = [null, null];
  const julyDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const calendarGrid = [...emptyDays, ...julyDays];

  // List of slots
  const timeSlots = [
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
    '08:30 PM'
  ];

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'SMILE50') {
      setPrice(125);
      setDiscountApplied(true);
      toast.success('50% discount applied successfully!');
    } else {
      toast.error('Invalid discount code. Try SMILE50 for demo discount.');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!email || !fullName || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'Razorpay') {
      // Dynamic loader helper for script tag
      const loadScript = (src) => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const sdkLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!sdkLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      const options = {
        key: 'rzp_live_SeQO0J84sbnMZb',
        amount: price * 100, // Amount in paise
        currency: 'INR',
        name: 'SS Dental Care',
        description: 'Dental Consultation Booking Fee',
        image: 'https://horizons-cdn.hostinger.com/dc22980f-a9df-4839-96b8-627d622e799c/38c4b0b05acaa72021a2d891747924f2.jpg',
        handler: function (response) {
          // Success callback
          setStep('success');
          toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        notes: {
          booking_details: `Consultation on Jul ${selectedDay}, 2026 at ${selectedTime}`,
        },
        theme: {
          color: '#e63c0a', // Clinic orange/red accent
        },
      };

      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        console.error(err);
        toast.error('Could not initiate payment. Please try again.');
      }
    } else {
      setStep('success');
      toast.success('Appointment booked successfully!');
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Your Visit - SS Dental Care Davangere</title>
        <meta name="description" content="Schedule your appointment at SS Dental Care in Davangere. Choose a convenient time and let our expert team take care of your smile." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <FloatingWhatsAppButton />
        <BackToTopButton />

        {/* Hero Banner (Only shown in intro & success steps) */}
        {(step === 'intro' || step === 'success') && (
          <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
            <div className="container mx-auto px-4 text-center relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Book Your Appointment
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Take the first step towards a healthier, brighter smile today.
              </p>
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              
              {/* STEP 1: INTRO SERVICE PAGE */}
              {step === 'intro' && (
                <>
                  <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-card p-6 md:p-10 rounded-3xl border border-border/50 shadow-2xl"
                >
                  {/* Left Column: Cozy Clinic Image */}
                  <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-[4/3] relative group shadow-lg border border-border/40">
                    <img
                      src="/clinic-interior.jpg"
                      alt="SS Dental Care Cozy Clinic Room"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Right Column: Pricing & Booking Details */}
                  <div className="lg:col-span-6 space-y-8">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
                        Book Your Visit
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className="text-lg text-muted-foreground line-through font-medium">₹500.00</span>
                        <span className="text-3xl font-extrabold text-accent">₹250.00</span>
                      </div>
                    </div>

                    <div className="space-y-4 border-y border-border/60 py-6 text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                        <span>Duration - <strong className="text-foreground">30 min</strong></span>
                      </div>
                      <Link to="/location" className="flex items-start gap-3 text-muted-foreground group cursor-pointer">
                        <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span>
                          Location - <strong className="text-foreground group-hover:text-accent transition-colors">2873, S S Plaza, 1st Floor, 4th Main, 4th Cross Rd, MCC B Block, Davanagere, Karnataka 577004</strong>
                        </span>
                      </Link>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      Schedule your appointment at SS Dental Care with ease. Choose a convenient time, and let our friendly team take care of your smile in our cozy Davanagere clinic.
                    </p>

                    <div>
                      <Button
                        onClick={() => setShowModal(true)}
                        size="lg"
                        className="px-10 py-6 text-lg rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-98 transition-all duration-300 w-full sm:w-auto"
                      >
                        Book now
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Book Through Whatsapp Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-20 border-t border-border/60 pt-20 space-y-12"
                >
                  <h2 className="text-4xl font-extrabold text-center text-foreground">
                    Book Through Whatsapp
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-card p-6 md:p-10 rounded-3xl border border-border/50 shadow-2xl">
                    {/* Left Column: WhatsApp details */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-foreground">Book Your Visit</h3>
                        <p className="text-lg text-accent font-semibold italic">&ldquo;Starting from ₹250&rdquo;</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-foreground">Dental Consultation</h4>
                        <ul className="space-y-4 text-muted-foreground list-disc pl-5 leading-relaxed">
                          <li>
                            Book your dental visit instantly via WhatsApp. Quick response, expert care, and personalized treatment—all in one place.
                          </li>
                          <li>
                            Get expert dental consultation tailored to your needs. We assess your oral health, explain treatment options clearly, and guide you toward the most effective and affordable solution.
                          </li>
                        </ul>
                      </div>

                      <div className="pt-4">
                        <a
                          href="https://wa.me/919448455699?text=Hello!%20I%20want%20to%20book%20a%20Dental%20Consultation%20appointment."
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            className="bg-black hover:bg-neutral-800 text-white rounded-full font-bold px-10 py-6 text-lg transition-transform active:scale-98 shadow-md hover:scale-105"
                          >
                            Book Now
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* Right Column: Dentist Checkup Image */}
                    <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-[4/3] relative group shadow-lg border border-border/40">
                      <img
                        src="/whatsapp-booking-dentist.jpg"
                        alt="SS Dental Care Dentist Checkup"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </motion.div>

                {/* Book Through Online Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-20 border-t border-border/60 pt-20 space-y-12"
                >
                  <h2 className="text-4xl font-extrabold text-center text-foreground">
                    Book Through Online
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-card p-6 md:p-10 rounded-3xl border border-border/50 shadow-2xl">
                    {/* Left Column: Online Booking Details */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-foreground">Book Your Visit</h3>
                        <p className="text-lg text-accent font-semibold italic">&ldquo;Starting from ₹250&rdquo;</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-foreground">Dental Consultation Booking</h4>
                        <ul className="space-y-4 text-muted-foreground list-disc pl-5 leading-relaxed">
                          <li>
                            Secure your appointment by completing a quick online payment via Razorpay. Enter the amount as advised by the clinic and confirm instantly. Safe, fast, and hassle-free booking.
                          </li>
                          <li>
                            Secure Payment via Razorpay | Trusted & Encrypted
                          </li>
                        </ul>
                      </div>

                      <div className="pt-4 flex flex-col items-start gap-2">
                        <Button
                          onClick={() => setShowModal(true)}
                          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold px-12 py-6 rounded-md shadow-lg transition-transform active:scale-98 hover:scale-102 w-full sm:w-auto"
                        >
                          Pay Now
                        </Button>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground pl-2 font-medium">
                          <span>Powered by</span>
                          <span className="font-extrabold italic text-slate-700 dark:text-slate-300">Razorpay</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Dentist Checkup Image */}
                    <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-[4/3] relative group shadow-lg border border-border/40">
                      <img
                        src="/whatsapp-booking-dentist.jpg"
                        alt="SS Dental Care Dentist Checkup"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              </>)}

              {/* STEP 2: CHECKOUT PAGE */}
              {step === 'checkout' && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
                >
                  {/* Checkout Form (Left 7 Columns) */}
                  <div className="lg:col-span-7 space-y-8">
                    <button
                      onClick={() => setStep('intro')}
                      className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors focus:outline-none"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Return to store
                    </button>

                    <form onSubmit={handleCheckoutSubmit} className="space-y-8 bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-md">
                      
                      {/* Contact Section */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold border-b border-border pb-2 text-foreground">Contact</h3>
                        <div className="space-y-2">
                          <Label htmlFor="checkout-email">Email</Label>
                          <Input
                            id="checkout-email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="text-foreground focus-visible:ring-accent"
                          />
                        </div>
                      </div>

                      {/* Billing Section */}
                      <div className="space-y-4 pt-4">
                        <h3 className="text-xl font-bold border-b border-border pb-2 text-foreground">Billing</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="checkout-name">Full name</Label>
                            <Input
                              id="checkout-name"
                              type="text"
                              placeholder="Enter your full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required
                              className="text-foreground focus-visible:ring-accent"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Country/Region</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
                              <option>India</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="checkout-state">State</Label>
                            <Input
                              id="checkout-state"
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              required
                              className="text-foreground focus-visible:ring-accent"
                            />
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="checkout-phone">Phone number</Label>
                            <div className="flex gap-2">
                              <div className="flex items-center gap-1 bg-muted px-3 border rounded-md text-xs text-muted-foreground font-medium">
                                🇮🇳 +91
                              </div>
                              <Input
                                id="checkout-phone"
                                type="tel"
                                placeholder="Enter 10-digit number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="text-foreground focus-visible:ring-accent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Section */}
                      <div className="space-y-4 pt-4">
                        <h3 className="text-xl font-bold border-b border-border pb-2 text-foreground">Payment</h3>
                        
                        <div className="space-y-3">
                          {/* Razorpay Option */}
                          <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'Razorpay' 
                              ? 'border-accent bg-accent/5 ring-1 ring-accent' 
                              : 'border-border hover:bg-muted/50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'Razorpay'}
                                onChange={() => setPaymentMethod('Razorpay')}
                                className="h-4 w-4 text-accent focus:ring-accent border-gray-300"
                              />
                              <span className="font-bold text-foreground text-sm">Razorpay</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-muted-foreground font-bold px-1.5 py-0.5 border rounded bg-background">VISA</span>
                              <span className="text-[10px] text-muted-foreground font-bold px-1.5 py-0.5 border rounded bg-background">MC</span>
                              <span className="text-[10px] text-muted-foreground font-bold px-1.5 py-0.5 border rounded bg-background">UPI</span>
                            </div>
                          </label>

                          {/* Visit to Pay Option */}
                          <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'Visit to pay' 
                              ? 'border-accent bg-accent/5 ring-1 ring-accent' 
                              : 'border-border hover:bg-muted/50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'Visit to pay'}
                                onChange={() => setPaymentMethod('Visit to pay')}
                                className="h-4 w-4 text-accent focus:ring-accent border-gray-300"
                              />
                              <span className="font-bold text-foreground text-sm">Visit to pay</span>
                            </div>
                            <span className="text-xs text-muted-foreground italic">Pay at clinic</span>
                          </label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-6 text-lg rounded-xl font-bold transition-all duration-200 active:scale-98"
                      >
                        Continue
                      </Button>
                    </form>
                  </div>

                  {/* Order Summary Column (Right 5 Columns) */}
                  <div className="lg:col-span-5 bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-md space-y-6 sticky top-24">
                    <h3 className="text-xl font-bold border-b border-border pb-2 text-foreground">Summary</h3>
                    
                    {/* Item details */}
                    <div className="flex gap-4 items-start pb-6 border-b border-border/60">
                      <div className="w-16 h-12 rounded-lg overflow-hidden relative border flex-shrink-0">
                        <img src="/clinic-interior.jpg" alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border">
                          1
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-sm">Book Your Visit</h4>
                        <div className="text-xs text-muted-foreground space-y-1.5 mt-2">
                          <p className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-accent" />
                            <span>Jul {selectedDay}, 2026 at {selectedTime}</span>
                          </p>
                          <p className="flex items-start gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                            <span>MCC B Block, Davanagere</span>
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-foreground text-sm">₹250.00</span>
                    </div>

                    {/* Discount Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter discount code (SMILE50)"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="text-foreground text-sm focus-visible:ring-accent"
                        disabled={discountApplied}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyDiscount}
                        disabled={discountApplied}
                      >
                        Apply
                      </Button>
                    </div>

                    {/* Totals panel */}
                    <div className="space-y-3 pt-2 text-sm">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹250.00</span>
                      </div>
                      {discountApplied && (
                        <div className="flex justify-between items-center text-emerald-600 font-medium">
                          <span>Discount (SMILE50)</span>
                          <span>-₹125.00</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Shipping/Fees</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border/60 text-lg font-extrabold text-foreground">
                        <span>Total</span>
                        <span>₹{price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS PAGE */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto bg-card border border-border/50 shadow-2xl p-8 md:p-12 rounded-3xl text-center space-y-8"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <Check className="h-10 w-10" strokeWidth={3} />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-extrabold text-foreground">Booking Confirmed!</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Thank you, <strong className="text-foreground">{fullName}</strong>! Your appointment has been scheduled successfully.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-muted/40 p-6 rounded-2xl border text-left space-y-4 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-foreground">Date & Time</p>
                        <p className="text-sm text-muted-foreground">Thursday, July {selectedDay}, 2026 at {selectedTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-foreground">Location</p>
                        <p className="text-sm text-muted-foreground">
                          SS Plaza, 1st Floor, MCC B Block, Davanagere
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">30 Minutes</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    A confirmation email has been sent to <strong className="text-foreground">{email}</strong>. If you need to make changes, please contact us.
                  </p>

                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        setStep('intro');
                        setFullName('');
                        setEmail('');
                        setPhone('');
                      }}
                      className="px-8 py-5 rounded-full font-bold"
                    >
                      Book Another Visit
                    </Button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </section>

        {/* DATE & TIME SELECTION MODAL POPUP */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-card border border-border/50 shadow-2xl rounded-3xl w-full max-w-5xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-visible"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-all focus:outline-none z-30"
                >
                  <Check className="h-5 w-5 rotate-45" strokeWidth={2.5} />
                </button>

                {/* Modal Left Column: Service Details */}
                <div className="lg:col-span-4 bg-muted/40 p-6 md:p-8 border-r border-border/60 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-foreground">Book Your Visit</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>30 min</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <Link to="/location" className="flex items-start gap-2 text-muted-foreground leading-relaxed group cursor-pointer">
                        <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span>
                          Live meeting, <strong className="text-foreground font-normal group-hover:text-accent transition-colors">2873, S S Plaza, 1st Floor 4th main, 4th Cross Rd, MCC B Block, Davanagere, Karnataka 577004</strong>
                        </span>
                      </Link>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Description</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Schedule your appointment at SS Dental Care with ease. Choose a convenient time, and let our friendly team take care of your smile in our cozy Davanagere clinic.
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:block pt-6 border-t border-border/60 text-xs text-muted-foreground">
                    SS Dental Care, Davanagere
                  </div>
                </div>

                {/* Modal Right Column: Calendar Date & Time selector */}
                <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left part: Date Calendar Grid */}
                    <div className="md:col-span-7 space-y-4">
                      <h3 className="font-extrabold text-lg text-foreground">Select date & time</h3>
                      
                      <div className="flex justify-between items-center bg-muted/50 px-4 py-2 rounded-xl">
                        <span className="font-bold text-sm text-foreground">Jul 2026</span>
                        <div className="flex items-center gap-1.5">
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground transition-all">
                            <ChevronLeft className="h-4.5 w-4.5" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground transition-all">
                            <ChevronRight className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>

                      {/* Day of Week Headers */}
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground pb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day}>{day}</div>
                        ))}
                      </div>

                      {/* Calendar Grid Cells */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {calendarGrid.map((day, idx) => {
                          if (day === null) {
                            return <div key={`empty-${idx}`} />;
                          }
                          const isSelected = selectedDay === day;
                          // Disable dates in past for realism (e.g. assume today is July 16, 2026)
                          const isPast = day < 16;
                          return (
                            <button
                              key={`day-${day}`}
                              type="button"
                              onClick={() => {
                                if (!isPast) setSelectedDay(day);
                              }}
                              disabled={isPast}
                              className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isPast 
                                  ? 'text-muted-foreground/30 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-accent text-accent-foreground shadow-md scale-105'
                                    : 'text-foreground hover:bg-muted hover:text-accent'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right part: Time Slots Selector */}
                    <div className="md:col-span-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">Select available time</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">(GMT+5:30) Asia Calcutta</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                        {timeSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 text-center text-xs font-semibold rounded-lg border transition-all ${
                                isSelected
                                  ? 'border-accent bg-accent/10 text-accent font-extrabold'
                                  : 'border-border/60 text-muted-foreground hover:border-accent hover:text-accent'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Footer buttons */}
                  <div className="flex justify-end gap-3 mt-8 border-t border-border/60 pt-6">
                    <Button
                      variant="ghost"
                      onClick={() => setShowModal(false)}
                      className="px-6 font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowModal(false);
                        setStep('checkout');
                      }}
                      disabled={!selectedDay || !selectedTime}
                      className="px-8 font-bold"
                    >
                      Book
                    </Button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>



        <Footer />
      </div>
    </>
  );
}

export default BookingsPage;
