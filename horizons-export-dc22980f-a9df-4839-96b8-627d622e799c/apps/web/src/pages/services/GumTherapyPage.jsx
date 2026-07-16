import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function GumTherapyPage() {
  const data = servicesData['ss-dental-care-gum-therapy'];
  return <ServiceDetailLayout {...data} />;
}

export default GumTherapyPage;
