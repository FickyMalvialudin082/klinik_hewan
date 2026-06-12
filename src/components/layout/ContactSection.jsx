import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import api from '../../api/client';
import Button from '../common/Button';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Form validation
    if (!formData.name || !formData.whatsapp || !formData.email || !formData.message) {
      setError('Harap isi semua kolom formulir.');
      setLoading(false);
      return;
    }

    const numericWa = formData.whatsapp.replace(/\D/g, '');
    if (!numericWa) {
      setError('Nomor WhatsApp hanya boleh berisi angka.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        whatsapp: numericWa
      };
      
      const res = await api.post('/messages', payload);
      setSuccess(res.message || 'Pesan konsultasi Anda berhasil dikirim!');
      setFormData({ name: '', whatsapp: '', email: '', message: '' });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gagal mengirim pesan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
            Hubungi & Konsultasi
          </h2>
          <p className="mt-4 text-base text-slate-500 leading-relaxed">
            Punya pertanyaan mengenai kesehatan hewan peliharaan Anda? Kirim pesan konsultasi atau hubungi kami langsung via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Info & Map Placeholder */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 font-sans">Informasi Kontak</h3>
              
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Alamat Klinik</span>
                    <span>Jl. Raya Garut - Tasikmalaya, Garut, Jawa Barat, Indonesia</span>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">WhatsApp</span>
                    <span>0812-3456-7890</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Email</span>
                    <span>hello@fickybusuk.com</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Jam Operasional</span>
                    <span>Senin - Minggu, 08.00 - 20.00 WIB</span>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-sm shadow-sm transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Chat WhatsApp Sekarang</span>
                </a>
              </div>
            </div>

            {/* Styled Google Maps Mockup */}
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm overflow-hidden h-64 relative group">
              <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-center p-4">
                {/* Map graphics representation */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-md border border-rose-200 animate-bounce relative z-10">
                  <MapPin size={20} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-3 relative z-10">Ficky Busuk Veterinary Clinic</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs relative z-10">Garut, Jawa Barat</p>
                
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-bold text-teal-600 hover:text-teal-700 underline relative z-10"
                >
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Send Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-sans mb-1">Kirim Pesan Konsultasi</h3>
              <p className="text-xs text-slate-500 mb-6">Tulis pertanyaan atau keluhan Anda, admin kami akan segera membalas.</p>

              {success && (
                <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 font-semibold">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Anda</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">No. WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="Contoh: 081234567890"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alamat Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Isi Pesan / Keluhan</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tulis pesan detail mengenai kondisi hewan peliharaan Anda..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full"
                    icon={Send}
                  >
                    Kirim Pesan
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
