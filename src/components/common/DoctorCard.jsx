import React from 'react';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const { name, specialization, experience, schedule, image_url, status } = doctor;
  const isAvailable = status === 'available';

  const defaultAvatar = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=200&auto=format&fit=crop';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover-scale hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Doctor Image Header */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden group">
        <img
          src={image_url || defaultAvatar}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Availability Badge Overlay */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 backdrop-blur-sm">
              <CheckCircle2 size={12} className="text-emerald-600" />
              Tersedia
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 border border-rose-200 backdrop-blur-sm">
              <XCircle size={12} className="text-rose-600" />
              Tidak Tersedia
            </span>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            {specialization}
          </span>
          <h3 className="mt-1 text-lg font-bold text-slate-900 font-sans">{name}</h3>
          
          <p className="mt-1 text-xs font-medium text-slate-500">
            Pengalaman: <span className="text-slate-800 font-semibold">{experience}</span>
          </p>

          {/* Schedule */}
          <div className="mt-4 rounded-xl bg-slate-50 p-3 flex items-start gap-2.5">
            <Calendar size={16} className="text-teal-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Jadwal Praktik</span>
              <span className="text-xs text-slate-700 font-semibold mt-0.5">{schedule}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6">
          {isAvailable ? (
            <Link
              to="/reserve"
              state={{ preselectedDoctor: doctor.id }}
              className="block w-full text-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-2 text-xs font-bold transition-all"
            >
              Buat Janji Konsultasi
            </Link>
          ) : (
            <button
              disabled
              className="block w-full text-center rounded-xl bg-slate-100 text-slate-400 py-2 text-xs font-bold cursor-not-allowed"
            >
              Sedang Tidak Praktik
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
