import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Syringe,
  Scissors,
  ShieldAlert,
  Smile,
  Apple,
  Sparkles,
  Activity,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Stethoscope,
  Syringe,
  Scissors,
  ShieldAlert,
  Smile,
  Apple,
  Sparkles,
  Activity
};

const ServiceCard = ({ service }) => {
  const { name, description, price, icon, status } = service;

  // Resolve Lucide Icon Component
  const IconComponent = iconMap[icon] || HelpCircle;

  // Format IDR Currency
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const isActive = status === 'active';

  return (
    <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-300 hover-scale shadow-sm ${
      isActive ? 'border-slate-200 hover:border-teal-200 hover:shadow-lg' : 'border-slate-100 opacity-60'
    }`}>
      {/* Icon top */}
      <div>
        <div className="inline-flex rounded-xl bg-teal-50 p-3 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
          <IconComponent size={24} className="transition-transform duration-300 group-hover:rotate-6" />
        </div>

        {/* Text */}
        <h3 className="mt-4 text-lg font-bold text-slate-900 font-sans group-hover:text-teal-700 transition-colors">
          {name}
        </h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
          {description || 'Tidak ada deskripsi layanan.'}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Estimasi Biaya</span>
          <span className="text-base font-extrabold text-teal-600">{formatIDR(price)}</span>
        </div>
        
        {isActive ? (
          <Link
            to="/reserve"
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:translate-x-1 transition-transform"
          >
            <span>Pesan</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Tutup</span>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
