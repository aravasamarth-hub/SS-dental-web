
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function DoctorCard({ name, qualification, specialization, image, slug, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-80 overflow-hidden">
          <img
            src={image}
            alt={`${name} - ${qualification}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-1">{name}</h3>
            <p className="text-sm opacity-90 mb-1">{qualification}</p>
            <p className="text-sm opacity-80">{specialization}</p>
          </div>
        </div>
        <CardContent className="p-6">
          <Link to={`/doctors/${slug}`}>
            <Button className="w-full transition-all duration-200 active:scale-98">
              View Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DoctorCard;
