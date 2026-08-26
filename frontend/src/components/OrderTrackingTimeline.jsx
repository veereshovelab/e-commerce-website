import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCheck,
  FiClock,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiHome,
  FiCopy,
  FiCheckCircle,
  FiExternalLink
} from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const STEPS = [
  {
    id: 'placed',
    title: 'Order Placed',
    description: 'Your order has been received',
    icon: FiPackage,
    defaultDate: 'Jun 6, 2024 - 10:30 AM'
  },
  {
    id: 'processing',
    title: 'Processing',
    description: 'Items packed and prepared',
    icon: FiClock,
    defaultDate: 'Jun 6, 2024 - 02:15 PM'
  },
  {
    id: 'shipped',
    title: 'Shipped',
    description: 'In transit to distribution hub',
    icon: FiTruck,
    defaultDate: 'Jun 7, 2024 - 08:45 AM'
  },
  {
    id: 'out_for_delivery',
    title: 'Out for Delivery',
    description: 'With local courier',
    icon: FiMapPin,
    defaultDate: 'Jun 8, 2024 - 09:00 AM'
  },
  {
    id: 'delivered',
    title: 'Delivered',
    description: 'Package delivered safely',
    icon: FiHome,
    defaultDate: 'Jun 8, 2024 - 03:20 PM'
  }
];

const STATUS_MAP = {
  pending: 0,
  placed: 0,
  processing: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1
};

const OrderTrackingTimeline = ({
  orderStatus = 'shipped',
  trackingNumber = 'TRACK123456789',
  carrier = 'FedEx Express',
  estimatedDelivery = 'June 9, 2024'
}) => {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  const currentStepIndex = STATUS_MAP[orderStatus.toLowerCase()] ?? 2;
  const isCancelled = orderStatus.toLowerCase() === 'cancelled';

  const handleCopyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      toast.success('Tracking number copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 transition-all ${
        isDarkMode
          ? 'bg-zinc-900/60 border-zinc-800 backdrop-blur-md shadow-glass-dark'
          : 'bg-white border-zinc-200 shadow-premium'
      }`}
    >
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            Real-time Shipment Tracker
          </span>
          <h3 className="text-xl font-bold font-display mt-0.5 text-zinc-900 dark:text-white">
            Order Status & Timeline
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800/80 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Tracking:</span>
            <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {trackingNumber}
            </span>
            <button
              onClick={handleCopyTracking}
              className="text-zinc-400 hover:text-brand-500 transition-colors p-1"
              title="Copy tracking number"
            >
              {copied ? <FiCheckCircle className="text-green-500" size={14} /> : <FiCopy size={14} />}
            </button>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-medium bg-brand-500/10 text-brand-500 px-3 py-1.5 rounded-xl border border-brand-500/20">
            <FiTruck size={14} />
            <span>{carrier}</span>
          </div>
        </div>
      </div>

      {/* Cancelled Alert Banner if applicable */}
      {isCancelled ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium mb-6">
          This order was cancelled. If you have any questions, please reach out to support.
        </div>
      ) : (
        /* Progress Steps */
        <div className="relative my-4">
          {/* Desktop Stepper Horizontal */}
          <div className="hidden md:block relative">
            {/* Background Line */}
            <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full z-0" />

            {/* Active Filled Line */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{
                width: `${(currentStepIndex / (STEPS.length - 1)) * 80}%`
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute top-6 left-[10%] h-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full z-0"
            />

            <div className="grid grid-cols-5 relative z-10">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isUpcoming = idx > currentStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center text-center px-2">
                    {/* Circle Indicator */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-brand-500 text-white shadow-glow-primary'
                          : isCurrent
                          ? 'bg-brand-500 text-white shadow-glow-primary ring-4 ring-brand-500/30 ring-offset-2 dark:ring-offset-zinc-900 animate-pulse'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {isCompleted ? <FiCheck size={20} strokeWidth={3} /> : <Icon size={20} />}
                    </motion.div>

                    {/* Step Title & Subtext */}
                    <h4
                      className={`text-sm font-bold mt-3 transition-colors ${
                        isCompleted || isCurrent
                          ? 'text-zinc-900 dark:text-white'
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={`text-[11px] leading-tight mt-1 max-w-[130px] ${
                        isCurrent
                          ? 'text-brand-500 font-medium'
                          : isCompleted
                          ? 'text-zinc-500 dark:text-zinc-400'
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Date stamp */}
                    {(isCompleted || isCurrent) && (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono">
                        {step.defaultDate}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Stepper Vertical */}
          <div className="block md:hidden relative space-y-6 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 ml-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="relative pl-6">
                  {/* Circle */}
                  <div
                    className={`absolute -left-[25px] top-0.5 w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all ${
                      isCompleted
                        ? 'bg-brand-500 text-white'
                        : isCurrent
                        ? 'bg-brand-500 text-white ring-4 ring-brand-500/30'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isCompleted ? <FiCheck size={14} /> : <Icon size={14} />}
                  </div>

                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isCompleted || isCurrent
                          ? 'text-zinc-900 dark:text-white'
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {step.description}
                    </p>
                    {(isCompleted || isCurrent) && (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono block mt-1">
                        {step.defaultDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Estimate Info */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>On-time delivery performance guarantee applied.</span>
        </div>
        <div className="font-medium text-zinc-800 dark:text-zinc-200">
          Estimated Delivery: <span className="text-brand-500 font-bold">{estimatedDelivery}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingTimeline;
