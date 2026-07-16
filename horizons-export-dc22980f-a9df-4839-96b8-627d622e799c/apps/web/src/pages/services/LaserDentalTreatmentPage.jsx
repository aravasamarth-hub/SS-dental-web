import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function LaserDentalTreatmentPage() {
  const data = servicesData['ss-dental-care-laser-dental-treatment'];
  return <ServiceDetailLayout {...data} />;
}

export default LaserDentalTreatmentPage;
