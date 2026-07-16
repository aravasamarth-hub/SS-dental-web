import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function OrthodonticSurgeryPage() {
  const data = servicesData['ss-dental-care-orthodontic-surgery'];
  return <ServiceDetailLayout {...data} />;
}

export default OrthodonticSurgeryPage;
