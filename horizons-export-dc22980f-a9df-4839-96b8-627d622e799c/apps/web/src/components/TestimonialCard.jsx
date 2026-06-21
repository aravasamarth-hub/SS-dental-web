
import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

function TestimonialCard({ name, rating, review, date, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="break-inside-avoid mb-6"
    >
      <Card className="bg-muted">
        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed mb-4">{review}</p>
          <div className="flex items-center justify-between">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TestimonialCard;
