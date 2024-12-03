import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-12 w-48 bg-gray-200 rounded-lg mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(null).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden"
            >
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}