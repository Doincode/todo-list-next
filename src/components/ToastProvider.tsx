'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {ToastComponent} from './toast';

type ToastOptions = {
  title?: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

interface ToastContextProps {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toastData, setToastData] = useState<ToastOptions | null>(null);

  const showToast = (options: ToastOptions) => {
    setToastData(options);
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {toastData && (
        <ToastComponent
          message={toastData.description}
          type={toastData.type || 'info'}
          duration={toastData.duration || 3000}
          onClose={() => setToastData(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
