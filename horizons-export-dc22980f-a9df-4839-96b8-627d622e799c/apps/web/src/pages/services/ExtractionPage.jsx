import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function ExtractionPage() {
  const data = servicesData['ss-dental-care-extraction-wisdom-tooth-extraction'];
  return <ServiceDetailLayout {...data} />;
}

export default ExtractionPage;
