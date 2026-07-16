import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function OrthodonticTreatmentPage() {
  const data = servicesData['ss-dental-care-orthodontic-treatment-braces'];
  return <ServiceDetailLayout {...data} />;
}

export default OrthodonticTreatmentPage;
