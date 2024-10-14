'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />
}

export function ToastComponent({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center justify-between w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div className="flex items-center">
        {icons[type]}
        <div className="ml-3 text-sm font-normal">{message}</div>
      </div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Close"
        onClick={() => {
          setIsVisible(false)
          onClose && onClose()
        }}
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

// Example usage
export function ToastExample() {
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info')

  const handleShowToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    setToastType(type)
    setShowToast(true)
  }

  return (
    <div className="p-4">
      <div className="space-x-2">
        <button onClick={() => handleShowToast('success')} className="px-4 py-2 bg-green-500 text-white rounded">Success Toast</button>
        <button onClick={() => handleShowToast('error')} className="px-4 py-2 bg-red-500 text-white rounded">Error Toast</button>
        <button onClick={() => handleShowToast('warning')} className="px-4 py-2 bg-yellow-500 text-white rounded">Warning Toast</button>
        <button onClick={() => handleShowToast('info')} className="px-4 py-2 bg-blue-500 text-white rounded">Info Toast</button>
      </div>
      {showToast && (
        <ToastComponent
          message={`This is a ${toastType} toast message!`}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}