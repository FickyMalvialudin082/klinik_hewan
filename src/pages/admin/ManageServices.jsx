import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ModalForm from '../../components/common/ModalForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    icon: 'Stethoscope',
    status: 'active'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await api.get('/services');
      setServices(data);
    } catch (err) {
      setError('Gagal memuat data layanan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      icon: 'Stethoscope',
      status: 'active'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      icon: service.icon || 'Stethoscope',
      status: service.status || 'active'
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

    if (!formData.name || !formData.price || !formData.icon) {
      setFormError('Nama, harga, dan ikon wajib diisi.');
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price)
      };

      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
      } else {
        await api.post('/services', payload);
      }
      
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Gagal menyimpan layanan.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/services/${deleteId}`);
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal menghapus layanan.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Define Columns
  const columns = [
    { key: 'name', label: 'Nama Layanan', render: (val) => <span className="font-bold text-slate-950">{val}</span> },
    { key: 'icon', label: 'Ikon', render: (val) => <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{val}</span> },
    {
      key: 'price',
      label: 'Harga',
      render: (val) => (
        <span className="font-semibold text-slate-800">
          Rp {Number(val).toLocaleString('id-ID')}
        </span>
      )
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            icon={Edit}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteId(row.id)}
            icon={Trash2}
          >
            Hapus
          </Button>
        </div>
      )
    }
  ];

  const iconOptions = ['Stethoscope', 'Syringe', 'Scissors', 'ShieldAlert', 'Smile', 'Apple', 'Sparkles', 'Activity'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Kelola Layanan</h1>
          <p className="text-xs text-slate-500 mt-1">Tambah, perbarui, atau nonaktifkan produk layanan pemeriksaan klinik.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={Plus}>
          Tambah Layanan
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 font-semibold">
          {error}
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        emptyMessage="Layanan belum diisi atau tidak tersedia."
      />

      {/* Form Modal */}
      <ModalForm
        isOpen={modalOpen}
        title={editingId ? 'Edit Layanan Klinik' : 'Tambah Layanan Baru'}
        onClose={() => setModalOpen(false)}
      >
        {formError && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800">
            {formError}
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Layanan *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: Pemeriksaan Kesehatan"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Harga (Rp) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Contoh: 75000"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Ikon Lucide *</label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:border-teal-500 focus:outline-none transition-colors"
                required
              >
                {iconOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:border-teal-500 focus:outline-none transition-colors"
                required
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Deskripsi Layanan</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Jelaskan mengenai detail layanan pemeriksaan..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              Simpan Layanan
            </Button>
          </div>
        </form>
      </ModalForm>

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

export default ManageServices;
