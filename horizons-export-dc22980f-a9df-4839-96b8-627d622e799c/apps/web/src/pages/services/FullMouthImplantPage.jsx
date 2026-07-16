import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function FullMouthImplantPage() {
  const data = servicesData['ss-dental-care-full-mouth-implant'];
  return <ServiceDetailLayout {...data} />;
}

export default FullMouthImplantPage;
