import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import ServiceCard from '../../components/common/ServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get('/services');
        setServices(data);
      } catch (err) {
        setError('Gagal memuat data layanan.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Layanan Medis & Perawatan</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Layanan Klinik Ficky Busuk
        </h1>
        <p className="text-base text-slate-500 leading-relaxed">
          Kami menyediakan berbagai macam layanan kesehatan medis dan perawatan higienis bagi hewan kesayangan Anda. Semua prosedur ditangani oleh staf berlisensi.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="text-center text-slate-500 font-medium">Layanan tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
