import React from 'react';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900 bg-opacity-50 transition-opacity" 
        onClick={onCancel}
      />

      {/* Modal wrapper */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {/* Warning Icon */}
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-rose-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-slate-950 font-sans">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
            <Button
              variant="danger"
              onClick={onConfirm}
              loading={loading}
              className="w-full sm:w-auto"
            >
              {confirmLabel}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
