import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Card({ children, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 120 }}
      className={cn(
        'rounded-2xl bg-card/80 shadow-glass p-6 max-w-full overflow-hidden backdrop-blur-md border border-border',
        'transition-all',
        className
      )}
      style={{
        background: 'rgba(36, 39, 48, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        border: '1px solid #2e323c',
        backdropFilter: 'blur(12px)',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
