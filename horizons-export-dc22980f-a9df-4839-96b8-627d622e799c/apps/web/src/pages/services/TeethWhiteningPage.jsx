import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function TeethWhiteningPage() {
  const data = servicesData['ss-dental-care-teeth-whitening'];
  return <ServiceDetailLayout {...data} />;
}

export default TeethWhiteningPage;
