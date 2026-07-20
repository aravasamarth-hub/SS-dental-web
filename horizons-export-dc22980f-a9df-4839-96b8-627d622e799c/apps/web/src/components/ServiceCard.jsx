import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ServiceCard({ title, description, image, slug, index, imageFit = 'cover' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group h-full"
    >
      <Link to={`/services/${slug}`} className="block h-full">
        <div className="flex flex-col h-full items-center text-center transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-1">
          {/* Image Container with rounded corners */}
          <div className={`w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-md mb-4 ${imageFit === 'contain' ? 'bg-white p-3 dark:bg-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <img
              src={image}
              alt={title}
              loading="lazy"
              width={400}
              height={300}
              className={`w-full h-full transition-transform duration-500 ${imageFit === 'contain' ? 'object-contain group-hover:scale-110' : 'object-cover scale-[1.02] group-hover:scale-110'}`}
            />
          </div>
          {/* Title - min-h-[3.5rem] ensures vertical alignment for 1 or 2 lines */}
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 min-h-[3.5rem] flex items-center justify-center transition-colors duration-200 group-hover:text-accent">
            {title}
          </h3>
          {/* Description */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm px-2 line-clamp-3 flex-grow">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default ServiceCard;
