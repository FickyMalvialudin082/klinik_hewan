import React, { useEffect, useState } from 'react';
import { Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.get('/appointments');
      setAppointments(data);
    } catch (err) {
      setError('Gagal memuat data reservasi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal mengubah status reservasi.');
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/appointments/${deleteId}`);
      setDeleteId(null);
      fetchAppointments();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal menghapus reservasi.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Chat WhatsApp Helper
  const handleWhatsAppChat = (row) => {
    const text = `Halo Kak ${row.owner_name}, kami dari klinik hewan Ficky Busuk ingin mengonfirmasi reservasi pemeriksaan untuk peliharaan Kakak, ${row.pet_name} (${row.pet_type}), pada tanggal ${new Date(row.appointment_date).toLocaleDateString('id-ID', { dateStyle: 'long' })} jam ${row.appointment_time.slice(0, 5)} WIB.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/62${row.whatsapp.replace(/^0/, '')}?text=${encodedText}`, '_blank');
  };

  // Columns definition
  const columns = [
    {
      key: 'owner_name',
      label: 'Pemilik & Kontak',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.owner_name}</span>
          <span className="text-xs text-slate-500">{row.email}</span>
          <span className="text-xs text-teal-600 font-semibold mt-0.5">{row.whatsapp}</span>
        </div>
      )
    },
    {
      key: 'pet_name',
      label: 'Hewan Peliharaan',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{row.pet_name} ({row.pet_type})</span>
          <span className="text-[10px] text-slate-400 font-medium">{row.pet_age}</span>
        </div>
      )
    },
    {
      key: 'service_name',
      label: 'Kunjungan Medis',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-xs">{row.service_name || '-'}</span>
          <span className="text-[10px] text-slate-500 font-medium">Dokter: {row.doctor_name || '-'}</span>
        </div>
      )
    },
    {
      key: 'appointment_date',
      label: 'Waktu Kunjungan',
      render: (_, row) => {
        const dateStr = new Date(row.appointment_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const timeStr = row.appointment_time.slice(0, 5);
        return (
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-slate-800">{dateStr}</span>
            <span className="text-slate-500 font-medium">{timeStr} WIB</span>
          </div>
        );
      }
    },
    {
      key: 'complaint',
      label: 'Keluhan',
      render: (val, row) => (
        <div className="max-w-[200px] text-xs space-y-1">
          <p className="text-slate-700 line-clamp-2" title={val}>{val}</p>
          {row.notes && (
            <p className="text-[10px] text-amber-600 font-medium italic truncate" title={row.notes}>
              Catatan: {row.notes}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status Reservasi',
      render: (val, row) => (
        <div className="flex flex-col gap-1.5">
          <StatusBadge status={val} />
          <select
            value={val}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className="text-[10px] font-bold border border-slate-300 rounded px-1 py-0.5 bg-white text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div className="flex flex-col sm:flex-row gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWhatsAppChat(row)}
            icon={MessageSquare}
            className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800"
          >
            Hubungi
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteId(row.id)}
            icon={Trash2}
            className="text-xs"
          >
            Hapus
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Kelola Reservasi</h1>
        <p className="text-xs text-slate-500 mt-1">Konfirmasi pendaftaran, ubah status kedatangan pasien, atau hubungi pemilik hewan.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 font-semibold">
          {error}
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={appointments}
        loading={loading}
        emptyMessage="Belum ada pendaftaran reservasi masuk."
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ManageAppointments;
