
import React, { lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { useVersionCheck } from './hooks/useVersionCheck';
import HomePage from './pages/HomePage';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));

const TeethWhiteningPage = lazy(() => import('./pages/services/TeethWhiteningPage'));
const VeneersPage = lazy(() => import('./pages/services/VeneersPage'));
const DentalImplantsPage = lazy(() => import('./pages/services/DentalImplantsPage'));
const CavityFillingPage = lazy(() => import('./pages/services/CavityFillingPage'));
const DigitalDenturesPage = lazy(() => import('./pages/services/DigitalDenturesPage'));
const BrokenTeethPage = lazy(() => import('./pages/services/BrokenTeethPage'));
const AlignersPage = lazy(() => import('./pages/services/AlignersPage'));
const SmileDesignPage = lazy(() => import('./pages/services/SmileDesignPage'));
const OrthodonticTreatmentPage = lazy(() => import('./pages/services/OrthodonticTreatmentPage'));
const OrthodonticSurgeryPage = lazy(() => import('./pages/services/OrthodonticSurgeryPage'));
const FullMouthImplantPage = lazy(() => import('./pages/services/FullMouthImplantPage'));
const PterygoidZygomaticImplantPage = lazy(() => import('./pages/services/PterygoidZygomaticImplantPage'));
const LaserDentalTreatmentPage = lazy(() => import('./pages/services/LaserDentalTreatmentPage'));
const ExtractionPage = lazy(() => import('./pages/services/ExtractionPage'));
const GumTherapyPage = lazy(() => import('./pages/services/GumTherapyPage'));

const DoctorNaveen = lazy(() => import('./pages/DoctorNaveen'));
const DoctorSunitha = lazy(() => import('./pages/DoctorSunitha'));

const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CancellationPage = lazy(() => import('./pages/CancellationPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  useVersionCheck();

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/location" element={<ContactPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/booking" element={<BookingsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/services" element={<ServicesPage />} />
          
          <Route path="/services/teeth-whitening" element={<TeethWhiteningPage />} />
          <Route path="/services/veneers" element={<VeneersPage />} />
          <Route path="/services/dental-implants" element={<DentalImplantsPage />} />
          <Route path="/services/cavity-filling" element={<CavityFillingPage />} />
          <Route path="/services/digital-dentures" element={<DigitalDenturesPage />} />
          <Route path="/services/broken-teeth" element={<BrokenTeethPage />} />
          <Route path="/services/aligners" element={<AlignersPage />} />
          <Route path="/services/smile-design" element={<SmileDesignPage />} />
          <Route path="/services/orthodontic-treatment" element={<OrthodonticTreatmentPage />} />
          <Route path="/services/orthodontic-surgery" element={<OrthodonticSurgeryPage />} />
          <Route path="/services/full-mouth-implant" element={<FullMouthImplantPage />} />
          <Route path="/services/pterygoid-zygomatic-implant" element={<PterygoidZygomaticImplantPage />} />
          <Route path="/services/laser-dental-treatment" element={<LaserDentalTreatmentPage />} />
          <Route path="/services/extraction" element={<ExtractionPage />} />
          <Route path="/services/gum-therapy" element={<GumTherapyPage />} />
          
          <Route path="/doctors/naveen-shamnur" element={<DoctorNaveen />} />
          <Route path="/doctors/sunitha-shamnur" element={<DoctorSunitha />} />

          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cancellation" element={<CancellationPage />} />
          <Route path="/refund" element={<RefundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
