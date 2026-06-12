import React, { useEffect, useState } from 'react';
import {
  Stethoscope,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  Mail
} from 'lucide-react';
import api from '../../api/client';
import StatCard from '../../components/common/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        setError('Gagal memuat statistik dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 font-semibold text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pantau status terkini operasional klinik hewan Ficky Busuk secara real-time.
        </p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Layanan"
          value={stats?.totalServices}
          icon={Stethoscope}
          color="teal"
          subtitle="Aktif & Nonaktif"
        />
        
        <StatCard
          title="Total Dokter"
          value={stats?.totalDoctors}
          icon={Users}
          color="blue"
          subtitle="Staf Medis Aktif"
        />

        <StatCard
          title="Total Reservasi"
          value={stats?.totalAppointments}
          icon={CalendarCheck}
          color="orange"
          subtitle="Semua Status Kunjungan"
        />

        <StatCard
          title="Total Pendapatan"
          value={formatIDR(stats?.totalRevenue || 0)}
          icon={TrendingUp}
          color="emerald"
          subtitle="Dari Pembayaran Lunas"
        />
      </div>

      {/* Grid of status appointments */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-sans tracking-tight mb-4">
          Status Reservasi Kunjungan
        </h2>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Reservasi Menunggu"
            value={stats?.pendingAppointments}
            icon={AlertCircle}
            color="amber"
            subtitle="Perlu Konfirmasi Admin"
          />

          <StatCard
            title="Reservasi Disetujui"
            value={stats?.approvedAppointments}
            icon={Calendar}
            color="blue"
            subtitle="Menunggu Jadwal Datang"
          />

          <StatCard
            title="Reservasi Selesai"
            value={stats?.completedAppointments}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Selesai Diperiksa"
          />

          <StatCard
            title="Pesan Masuk"
            value={stats?.totalMessages}
            icon={Mail}
            color="slate"
            subtitle="Konsultasi & Kontak Masuk"
          />
        </div>
      </div>

      {/* Quick Help Box */}
      <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-sm font-sans">Pemberitahuan Sistem</h3>
          <p className="text-xs text-slate-600">
            Pastikan Anda memeriksa kolom **Kelola Reservasi** secara teratur untuk menanggapi reservasi baru yang masih bertanda status **Menunggu (Pending)**.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
