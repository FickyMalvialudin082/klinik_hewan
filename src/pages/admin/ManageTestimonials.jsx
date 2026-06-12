import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import ModalForm from '../../components/common/ModalForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    pet_name: '',
    comment: '',
    rating: 5,
    is_visible: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // Fetch all (including invisible ones) by passing adminView=true
      const data = await api.get('/testimonials?adminView=true');
      setTestimonials(data);
    } catch (err) {
      setError('Gagal memuat data testimoni.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      customer_name: '',
      pet_name: '',
      comment: '',
      rating: 5,
      is_visible: true
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      customer_name: t.customer_name,
      pet_name: t.pet_name,
      comment: t.comment,
      rating: t.rating,
      is_visible: t.is_visible === 1 || t.is_visible === true
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleToggleVisibility = async (row) => {
    try {
      const newVisible = !(row.is_visible === 1 || row.is_visible === true);
      await api.put(`/testimonials/${row.id}`, {
        is_visible: newVisible
      });
      fetchTestimonials();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal memperbarui visibilitas testimoni.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    const { customer_name, pet_name, comment, rating } = formData;
    if (!customer_name || !pet_name || !comment || rating === undefined) {
      setFormError('Harap isi semua kolom wajib.');
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating),
        is_visible: formData.is_visible ? 1 : 0
      };

      if (editingId) {
        await api.put(`/testimonials/${editingId}`, payload);
      } else {
        await api.post('/testimonials', payload);
      }

      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Gagal menyimpan testimoni.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/testimonials/${deleteId}`);
      setDeleteId(null);
      fetchTestimonials();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal menghapus testimoni.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Columns definition
  const columns = [
    {
      key: 'customer_name',
      label: 'Pelanggan & Hewan',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.customer_name}</span>
          <span className="text-xs text-teal-600 font-semibold mt-0.5">Pemilik {row.pet_name}</span>
        </div>
      )
    },
    { key: 'comment', label: 'Komentar', render: (val) => <span className="text-xs text-slate-600 italic block max-w-[300px] whitespace-normal">"{val}"</span> },
    {
      key: 'rating',
      label: 'Rating',
      render: (val) => (
        <div className="flex text-amber-400 gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < val ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
          ))}
        </div>
      )
    },
    {
      key: 'is_visible',
      label: 'Tampil',
      render: (val, row) => {
        const isVisible = val === 1 || val === true;
        return (
          <button
            onClick={() => handleToggleVisibility(row)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isVisible
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>{isVisible ? 'Ditampilkan' : 'Disembunyikan'}</span>
          </button>
        );
      }
    },
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
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">Kelola Testimoni</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola tinjauan ulasan pelanggan dan atur apakah ulasan ditampilkan di halaman utama.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={Plus}>
          Tambah Ulasan
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
        data={testimonials}
        loading={loading}
        emptyMessage="Belum ada testimoni tersimpan."
      />

      {/* Form Modal */}
      <ModalForm
        isOpen={modalOpen}
        title={editingId ? 'Edit Testimoni Ulasan' : 'Tambah Testimoni'}
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Pelanggan *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama & Jenis Hewan *</label>
              <input
                type="text"
                name="pet_name"
                value={formData.pet_name}
                onChange={handleInputChange}
                placeholder="Contoh: Milo (Kucing)"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Rating Ulasan (1 - 5) *</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:border-teal-500 focus:outline-none transition-colors"
                required
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                <option value={2}>⭐⭐ (2 Bintang)</option>
                <option value={1}>⭐ (1 Bintang)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  name="is_visible"
                  checked={formData.is_visible}
                  onChange={handleInputChange}
                  className="rounded text-teal-600 border-slate-300 focus:ring-teal-500 h-4.5 w-4.5"
                />
                <span>Tampilkan di Landing Page</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Isi Ulasan / Komentar *</label>
            <textarea
              name="comment"
              rows={4}
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Tulis testimoni ulasan pelanggan..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              Simpan Ulasan
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

export default ManageTestimonials;
