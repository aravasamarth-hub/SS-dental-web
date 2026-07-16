import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function AlignersPage() {
  const data = servicesData['ss-dental-care-aligners'];
  return <ServiceDetailLayout {...data} />;
}

export default AlignersPage;
