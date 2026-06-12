import React from 'react';
import { X } from 'lucide-react';

const ModalForm = ({
  isOpen,
  title,
  onClose,
  children,
  size = 'md' // md, lg, xl
}) => {
  if (!isOpen) return null;

  const sizes = {
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl'
  };

  const selectedSize = sizes[size] || sizes.md;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900 bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Alignment Container */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 w-full ${selectedSize}`}>
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-slate-100 px-6">
            <h3 className="text-base font-bold text-slate-900 font-sans">{title}</h3>
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[75vh] overflow-y-auto px-6 py-6 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
