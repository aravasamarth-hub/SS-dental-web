import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function DentalImplantsPage() {
  const data = servicesData['ss-dental-care-dental-implants'];
  return <ServiceDetailLayout {...data} />;
}

export default DentalImplantsPage;
