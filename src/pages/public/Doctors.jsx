import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import DoctorCard from '../../components/common/DoctorCard';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.get('/doctors');
        setDoctors(data);
      } catch (err) {
        setError('Gagal memuat data dokter.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Tim Medis Profesional</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Dokter Hewan Kami
        </h1>
        <p className="text-base text-slate-500 leading-relaxed">
          Ketahui jam praktik dan spesialisasi tim medis kami. Staf dokter kami selalu siap melayani konsultasi, tindakan bedah, dan pengobatan medis lainnya.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Doctors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <p className="text-center text-slate-500 font-medium">Dokter tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
