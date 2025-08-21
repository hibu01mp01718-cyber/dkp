import { motion } from 'framer-motion';
import { cn } from '../lib/utils';


import styles from './DKPDashboard.module.css';

export default function Card({ children, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.25, type: 'spring', stiffness: 120 }}
      className={cn(
        styles.cardBase,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
