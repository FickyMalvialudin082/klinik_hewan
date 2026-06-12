import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ModalForm from '../../components/common/ModalForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    schedule: '',
    image_url: '',
    status: 'available'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await api.get('/doctors');
      setDoctors(data);
    } catch (err) {
      setError('Gagal memuat data dokter.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      specialization: '',
      experience: '',
      schedule: '',
      image_url: '',
      status: 'available'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingId(doc.id);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      experience: doc.experience,
      schedule: doc.schedule,
      image_url: doc.image_url || '',
      status: doc.status || 'available'
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

    const { name, specialization, experience, schedule } = formData;
    if (!name || !specialization || !experience || !schedule) {
      setFormError('Nama, spesialisasi, pengalaman, dan jadwal praktik wajib diisi.');
      setFormLoading(false);
      return;
    }

    try {
      if (editingId) {
        await api.put(`/doctors/${editingId}`, formData);
      } else {
        await api.post('/doctors', formData);
      }
      
      setModalOpen(false);
      fetchDoctors();
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Gagal menyimpan data dokter.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/doctors/${deleteId}`);
      setDeleteId(null);
      fetchDoctors();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal menghapus dokter.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Define columns
  const columns = [
    {
      key: 'name',
      label: 'Nama Dokter',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image_url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=100&auto=format&fit=crop'}
            alt={val}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 leading-none">{val}</span>
            <span className="text-[10px] text-teal-600 font-semibold uppercase mt-1 leading-none">{row.specialization}</span>
          </div>
        </div>
      )
    },
    { key: 'experience', label: 'Pengalaman' },
    { key: 'schedule', label: 'Jadwal Praktik', render: (val) => <span className="font-medium text-slate-600 text-xs">{val}</span> },
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Kelola Dokter Hewan</h1>
          <p className="text-xs text-slate-500 mt-1">Tambah, perbarui, atau sesuaikan status ketersediaan dokter hewan praktek.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={Plus}>
          Tambah Dokter
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
        data={doctors}
        loading={loading}
        emptyMessage="Dokter belum diisi atau tidak tersedia."
      />

      {/* Form Modal */}
      <ModalForm
        isOpen={modalOpen}
        title={editingId ? 'Edit Data Dokter' : 'Tambah Dokter Hewan'}
        onClose={() => setModalOpen(false)}
      >
        {formError && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800">
            {formError}
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap Dokter *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Contoh: drh. Andi Pratama"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Spesialisasi *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="Contoh: Dokter Hewan Umum"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Lama Pengalaman (Tahun) *</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Contoh: 5 Tahun"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Ketersediaan Praktek *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:border-teal-500 focus:outline-none transition-colors"
                required
              >
                <option value="available">Tersedia</option>
                <option value="unavailable">Tidak Tersedia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jadwal Praktik Mingguan *</label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              placeholder="Contoh: Senin - Rabu, 08:00 - 15:00"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL Foto Dokter</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              Simpan Dokter
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

export default ManageDoctors;
