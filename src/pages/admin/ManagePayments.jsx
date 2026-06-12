import React, { useEffect, useState } from 'react';
import { Edit } from 'lucide-react';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ModalForm from '../../components/common/ModalForm';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    payment_method: 'Cash / Tunai',
    amount: '',
    status: 'unpaid'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await api.get('/payments');
      setPayments(data);
    } catch (err) {
      setError('Gagal memuat data pembayaran.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpenEdit = (pay) => {
    setEditingId(pay.id);
    setFormData({
      payment_method: pay.payment_method || 'Cash / Tunai',
      amount: pay.amount,
      status: pay.status || 'unpaid'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    if (formData.amount === '' || !formData.payment_method || !formData.status) {
      setFormError('Harap isi semua kolom wajib.');
      setFormLoading(false);
      return;
    }

    try {
      await api.put(`/payments/${editingId}`, {
        ...formData,
        amount: Number(formData.amount)
      });
      setModalOpen(false);
      fetchPayments();
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Gagal menyimpan pembayaran.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Columns definition
  const columns = [
    { key: 'id', label: 'ID Transaksi', render: (val) => <span className="font-mono text-xs font-semibold text-slate-500">PAY-{val}</span> },
    {
      key: 'appointment_id',
      label: 'Kunjungan / Pemilik',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.owner_name}</span>
          <span className="text-xs text-slate-500">{row.pet_name} ({row.pet_type})</span>
          <span className="text-[10px] text-teal-600 font-semibold">{row.service_name}</span>
        </div>
      )
    },
    { key: 'payment_method', label: 'Metode Pembayaran', render: (val) => <span className="font-medium text-xs bg-slate-100 border px-2 py-0.5 rounded text-slate-700">{val}</span> },
    { key: 'amount', label: 'Jumlah Tagihan', render: (val) => <span className="font-bold text-slate-900">{formatIDR(val)}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'paid_at',
      label: 'Tanggal Bayar',
      render: (val) => {
        if (!val) return <span className="text-slate-400 italic text-xs">-</span>;
        return (
          <span className="text-xs font-semibold text-slate-700">
            {new Date(val).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} WIB
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenEdit(row)}
          icon={Edit}
        >
          Kelola
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Kelola Pembayaran</h1>
        <p className="text-xs text-slate-500 mt-1">Kelola pencatatan kasir, verifikasi bukti pelunasan biaya, atau pengembalian dana (refund).</p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 font-semibold">
          {error}
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        emptyMessage="Belum ada pencatatan tagihan kasir."
      />

      {/* Form Modal */}
      <ModalForm
        isOpen={modalOpen}
        title="Ubah & Verifikasi Transaksi"
        onClose={() => setModalOpen(false)}
      >
        {formError && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800">
            {formError}
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Metode Pembayaran</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:border-teal-500 focus:outline-none transition-colors"
              required
            >
              <option value="Cash / Tunai">Cash / Tunai</option>
              <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
              <option value="Transfer Bank BCA">Transfer Bank BCA</option>
              <option value="Transfer Bank BRI">Transfer Bank BRI</option>
              <option value="GoPay / OVO / ShopeePay">E-Wallet (GoPay/OVO/ShopeePay)</option>
              <option value="Debit / Kartu Kredit">Debit / Kartu Kredit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jumlah Tagihan (Rp) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status Pembayaran</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:border-teal-500 focus:outline-none transition-colors"
              required
            >
              <option value="unpaid">Belum Bayar (Unpaid)</option>
              <option value="paid">Lunas (Paid)</option>
              <option value="refunded">Dikembalikan (Refunded)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              Simpan Pembayaran
            </Button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
};

export default ManagePayments;
