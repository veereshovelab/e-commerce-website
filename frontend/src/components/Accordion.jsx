import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-2xl overflow-hidden shadow-premium ${
              isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-white border-zinc-200'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className={`w-full flex items-center justify-between p-5 text-left transition-colors duration-300 outline-none ${
                isDarkMode 
                  ? isOpen ? 'bg-zinc-900 text-brand-400' : 'hover:bg-zinc-900/60 text-white' 
                  : isOpen ? 'bg-zinc-50 text-brand-600' : 'hover:bg-zinc-50 text-zinc-800'
              }`}
            >
              <span className="font-display font-semibold text-sm">{item.title}</span>
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-brand-500' : 'text-zinc-400'
                }`}
                size={16}
              />
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="transform-gpu overflow-hidden"
                >
                  <div className={`p-5 text-sm leading-relaxed border-t ${
                    isDarkMode ? 'bg-zinc-900/80 border-zinc-850 text-zinc-400' : 'bg-white border-zinc-100 text-zinc-550'
                  }`}>
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
