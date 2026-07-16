import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function DigitalDenturesPage() {
  const data = servicesData['ss-dental-care-digital-dentures'];
  return <ServiceDetailLayout {...data} />;
}

export default DigitalDenturesPage;
