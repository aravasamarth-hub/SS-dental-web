import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function BrokenTeethPage() {
  const data = servicesData['ss-dental-care-broken-teeth'];
  return <ServiceDetailLayout {...data} />;
}

export default BrokenTeethPage;
