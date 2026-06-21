
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function ServiceCard({ title, description, icon: Icon, slug, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 group">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all duration-200">
            <Icon className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <CardDescription className="flex-1 mb-4">{description}</CardDescription>
          <Link to={`/services/${slug}`}>
            <Button variant="ghost" className="w-full justify-between group-hover:text-accent transition-all duration-200">
              Learn More
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ServiceCard;
