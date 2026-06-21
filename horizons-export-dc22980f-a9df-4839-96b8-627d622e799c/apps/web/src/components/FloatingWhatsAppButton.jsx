
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function FloatingWhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919448455699?text=Hello%20I%20want%20to%20book%20an%20appointment"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 active:scale-95"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}

export default FloatingWhatsAppButton;
