
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import LocationPage from './pages/LocationPage';
import BookingsPage from './pages/BookingsPage';
import BlogPage from './pages/BlogPage';
import TeethWhiteningPage from './pages/services/TeethWhiteningPage';
import VeneersPage from './pages/services/VeneersPage';
import DentalImplantsPage from './pages/services/DentalImplantsPage';
import CavityFillingPage from './pages/services/CavityFillingPage';
import DigitalDenturesPage from './pages/services/DigitalDenturesPage';
import BrokenTeethPage from './pages/services/BrokenTeethPage';
import AlignersPage from './pages/services/AlignersPage';
import SmileDesignPage from './pages/services/SmileDesignPage';
import OrthodonticTreatmentPage from './pages/services/OrthodonticTreatmentPage';
import OrthodonticSurgeryPage from './pages/services/OrthodonticSurgeryPage';
import FullMouthImplantPage from './pages/services/FullMouthImplantPage';
import PterygoidZygomaticImplantPage from './pages/services/PterygoidZygomaticImplantPage';
import LaserDentalTreatmentPage from './pages/services/LaserDentalTreatmentPage';
import ExtractionPage from './pages/services/ExtractionPage';
import GumTherapyPage from './pages/services/GumTherapyPage';
import DoctorNaveen from './pages/DoctorNaveen';
import DoctorSunitha from './pages/DoctorSunitha';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        
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
      </Routes>
    </Router>
  );
}

export default App;
