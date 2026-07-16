import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function VeneersPage() {
  const data = servicesData['ss-dental-care-veneers'];
  return <ServiceDetailLayout {...data} />;
}

export default VeneersPage;
