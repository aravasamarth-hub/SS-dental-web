import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function PterygoidZygomaticImplantPage() {
  const data = servicesData['ss-dental-care-pterygoid-and-zygomatic-implant'];
  return <ServiceDetailLayout {...data} />;
}

export default PterygoidZygomaticImplantPage;
