import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { servicesData } from '@/data/servicesData';

function SmileDesignPage() {
  const data = servicesData['smile-design'];
  return <ServiceDetailLayout {...data} />;
}

export default SmileDesignPage;
