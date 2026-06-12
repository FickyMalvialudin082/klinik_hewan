import React, { useEffect, useState } from 'react';
import { Trash2, Check, MessageSquare } from 'lucide-react';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await api.get('/messages');
      setMessages(data);
    } catch (err) {
      setError('Gagal memuat pesan masuk.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      fetchMessages();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal mengubah status pesan.');
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/messages/${deleteId}`);
      setDeleteId(null);
      fetchMessages();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal menghapus pesan.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReplyWhatsApp = (row) => {
    const text = `Halo Kak ${row.name}, kami dari klinik hewan Ficky Busuk ingin membalas pesan konsultasi Kakak: "${row.message.slice(0, 60)}..."`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/62${row.whatsapp.replace(/^0/, '')}?text=${encodedText}`, '_blank');
  };

  // Columns definition
  const columns = [
    {
      key: 'name',
      label: 'Pengirim & Kontak',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-xs text-slate-500">{row.email}</span>
          <span className="text-xs text-teal-600 font-semibold mt-0.5">{row.whatsapp}</span>
        </div>
      )
    },
    { key: 'message', label: 'Isi Konsultasi / Pesan', render: (val) => <span className="text-xs text-slate-600 block max-w-[350px] whitespace-normal leading-relaxed">{val}</span> },
    {
      key: 'created_at',
      label: 'Tanggal Kirim',
      render: (val) => (
        <span className="text-xs text-slate-500 font-semibold">
          {new Date(val).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })} WIB
        </span>
      )
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => {
        const isUnread = row.status === 'unread';
        return (
          <div className="flex flex-col sm:flex-row gap-1.5">
            {isUnread && (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleMarkAsRead(row.id)}
                icon={Check}
                className="text-xs"
              >
                Tandai Dibaca
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReplyWhatsApp(row)}
              icon={MessageSquare}
              className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            >
              Balas WA
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
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Kelola Pesan Konsultasi</h1>
        <p className="text-xs text-slate-500 mt-1">Lihat kiriman formulir konsultasi pelanggan, tandai pesan yang sudah ditindaklanjuti, atau hubungi balik.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 font-semibold">
          {error}
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        emptyMessage="Belum ada pesan masuk."
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

export default ManageMessages;
