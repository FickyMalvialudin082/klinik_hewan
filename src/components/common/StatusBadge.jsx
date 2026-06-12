import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = String(status).toLowerCase();

  const configs = {
    // Appointment Statuses
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200',

    // Payment Statuses
    unpaid: 'bg-red-100 text-red-800 border-red-200',
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    refunded: 'bg-slate-100 text-slate-800 border-slate-200',

    // Message Statuses
    unread: 'bg-amber-100 text-amber-800 border-amber-200',
    read: 'bg-slate-100 text-slate-800 border-slate-200',

    // Doctor Availability
    available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    unavailable: 'bg-rose-100 text-rose-800 border-rose-200',

    // Service Statuses
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-800 border-slate-200'
  };

  const labels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    unpaid: 'Belum Bayar',
    paid: 'Lunas',
    refunded: 'Dikembalikan',
    unread: 'Belum Dibaca',
    read: 'Dibaca',
    available: 'Tersedia',
    unavailable: 'Tutup',
    active: 'Aktif',
    inactive: 'Nonaktif'
  };

  const defaultStyle = 'bg-slate-100 text-slate-800 border-slate-200';
  const styleClass = configs[normalized] || defaultStyle;
  const label = labels[normalized] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
