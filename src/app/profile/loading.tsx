'use client';

import { motion } from 'framer-motion';

export default function ProfileLoading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <div className="flex space-x-2">
        {[0, 0.2, 0.4].map((delay, index) => (
          <motion.span
            key={index}
            className="w-4 h-4 rounded-full"
            animate={{
              y: ['0%', '-60%', '0%'],
              scale: [1, 1.3, 1],
              backgroundColor: ['#3b82f6', '#60a5fa', '#3b82f6'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay,
            }}
          />
        ))}
      </div>
      <p className="text-gray-700 font-medium">Loading profile...</p>
    </div>
  );
}
