import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function CavityFillingPage() {
  const data = servicesData['ss-dental-care-cavity-filling-restoration'];
  return <ServiceDetailLayout {...data} />;
}

export default CavityFillingPage;
