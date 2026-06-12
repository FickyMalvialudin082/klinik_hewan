import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import api from '../../api/client';
import Button from '../../components/common/Button';

const Reserve = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  
  const [formData, setFormData] = useState({
    owner_name: '',
    whatsapp: '',
    email: '',
    pet_name: '',
    pet_type: '',
    pet_age: '',
    service_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    complaint: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesList, doctorsList] = await Promise.all([
          api.get('/services'),
          api.get('/doctors')
        ]);
        
        const activeServices = servicesList.filter(s => s.status === 'active');
        const availableDoctors = doctorsList.filter(d => d.status === 'available');

        setServices(activeServices);
        setDoctors(availableDoctors);

        // Handle pre-selected doctor from location state
        const preselectedDoctor = location.state?.preselectedDoctor;
        if (preselectedDoctor && availableDoctors.some(d => d.id === preselectedDoctor)) {
          setFormData(prev => ({ ...prev, doctor_id: String(preselectedDoctor) }));
        }
      } catch (err) {
        console.error('Error loading booking options:', err);
        setErrorMsg('Gagal memuat daftar layanan atau dokter hewan.');
      } finally {
        setLoadingDropdowns(false);
      }
    };
    loadData();
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    // Validation
    const {
      owner_name,
      whatsapp,
      email,
      pet_name,
      pet_type,
      pet_age,
      service_id,
      doctor_id,
      appointment_date,
      appointment_time,
      complaint
    } = formData;

    if (
      !owner_name ||
      !whatsapp ||
      !email ||
      !pet_name ||
      !pet_type ||
      !pet_age ||
      !service_id ||
      !doctor_id ||
      !appointment_date ||
      !appointment_time ||
      !complaint
    ) {
      setErrorMsg('Harap isi semua kolom wajib (bertanda bintang *).');
      setSubmitting(false);
      return;
    }

    // Validate WhatsApp (Numbers only)
    const numericWa = whatsapp.replace(/\D/g, '');
    if (!numericWa) {
      setErrorMsg('Nomor WhatsApp hanya boleh berisi angka.');
      setSubmitting(false);
      return;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Format email tidak valid.');
      setSubmitting(false);
      return;
    }

    // Validate Date is not in the past
    const inputDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) {
      setErrorMsg('Tanggal reservasi tidak boleh di masa lalu.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        whatsapp: numericWa,
        service_id: Number(service_id),
        doctor_id: Number(doctor_id)
      };

      const res = await api.post('/appointments', payload);
      setSuccessMsg(res.message || 'Reservasi berhasil! Admin Ficky Busuk akan menghubungi kamu via WhatsApp.');
      
      // Reset form
      setFormData({
        owner_name: '',
        whatsapp: '',
        email: '',
        pet_name: '',
        pet_type: '',
        pet_age: '',
        service_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        complaint: '',
        notes: ''
      });
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Gagal mengirim formulir reservasi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Reservasi Pemeriksaan Hewan
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Silakan lengkapi formulir di bawah ini untuk membuat janji pemeriksaan. Admin kami akan mengirimkan konfirmasi via WhatsApp dalam waktu 1x24 jam.
        </p>
      </div>

      {successMsg ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
            {successMsg}
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setSuccessMsg('')}>
              Buat Reservasi Baru
            </Button>
            <Button variant="primary" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          {errorMsg && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 font-semibold flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Pemilik */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 font-sans">
                1. Data Pemilik
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Pemilik *
                  </label>
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="budi@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Section 2: Hewan Peliharaan */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 font-sans">
                2. Data Hewan Peliharaan
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Hewan *
                  </label>
                  <input
                    type="text"
                    name="pet_name"
                    value={formData.pet_name}
                    onChange={handleChange}
                    placeholder="Contoh: Milo"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jenis Hewan *
                  </label>
                  <input
                    type="text"
                    name="pet_type"
                    value={formData.pet_type}
                    onChange={handleChange}
                    placeholder="Kucing / Anjing / Kelinci"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Umur Hewan *
                  </label>
                  <input
                    type="text"
                    name="pet_age"
                    value={formData.pet_age}
                    onChange={handleChange}
                    placeholder="Contoh: 1 Tahun 2 Bulan"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Detail Reservasi */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 font-sans">
                3. Detail Kunjungan & Jadwal
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pilihan Layanan *
                  </label>
                  <select
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    disabled={loadingDropdowns}
                    required
                  >
                    <option value="">-- Pilih Layanan Klinik --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - Rp {Number(s.price).toLocaleString('id-ID')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pilihan Dokter Hewan *
                  </label>
                  <select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    disabled={loadingDropdowns}
                    required
                  >
                    <option value="">-- Pilih Dokter Hewan --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Reservasi *
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jam Reservasi *
                  </label>
                  <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Keluhan & Catatan */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 font-sans">
                4. Keluhan & Catatan Medis
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Keluhan Utama *
                  </label>
                  <textarea
                    name="complaint"
                    rows={3}
                    value={formData.complaint}
                    onChange={handleChange}
                    placeholder="Contoh: Kucing lemas, muntah sejak kemarin malam, tidak mau makan."
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Contoh: Hewan agak sensitif saat disentuh bagian telinganya."
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wide shadow-md"
              >
                Kirim Reservasi Pemeriksaan
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reserve;
