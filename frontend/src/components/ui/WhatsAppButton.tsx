'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WhatsAppIcon } from '@/components/contact/ContactSection';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  showText?: boolean;
  buttonText?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '213674041838',
  message = 'Bonjour, je suis intéressé par vos produits',
  position = 'bottom-right',
  showText = true,
  buttonText = 'Discuter sur WhatsApp'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show button after a small delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20
          }}
          className={`fixed ${positionClasses[position]} z-50`}
        >
          <motion.button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
            aria-label="Contact us on WhatsApp"
          >
            {/* Ripple effect background */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

            {/* Icon container */}
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16">
              <motion.div
                animate={{
                  rotate: isHovered ? [0, -10, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </motion.div>
            </div>

            {/* Text (desktop only) */}
            {showText && (
              <AnimatePresence>
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden sm:block pr-5 font-semibold text-sm md:text-base whitespace-nowrap overflow-hidden"
                >
                  {buttonText}
                </motion.span>
              </AnimatePresence>
            )}

            {/* Notification badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-full h-full bg-red-500 rounded-full"
              />
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="absolute inset-0 bg-[#25D366] rounded-full"
            />
          </motion.button>

          {/* Tooltip on hover */}
          <AnimatePresence>
            {isHovered && !showText && (
              <motion.div
                initial={{ opacity: 0, x: position === 'bottom-right' ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: position === 'bottom-right' ? 10 : -10 }}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  position === 'bottom-right' ? 'right-full mr-3' : 'left-full ml-3'
                } bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl`}
              >
                {buttonText}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    position === 'bottom-right'
                      ? 'right-0 translate-x-full border-l-gray-900'
                      : 'left-0 -translate-x-full border-r-gray-900'
                  } w-0 h-0 border-y-4 border-y-transparent ${
                    position === 'bottom-right' ? 'border-l-4' : 'border-r-4'
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
