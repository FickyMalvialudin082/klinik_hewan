import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
              <span className="text-teal-400">Ficky</span>Busuk 🐾
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              Perawatan Terbaik untuk Hewan Kesayanganmu. Klinik hewan terpercaya untuk pemeriksaan, vaksinasi, grooming, dan konsultasi kesehatan.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <ShieldCheck size={16} />
              <span>Berlisensi & Profesional</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Navigasi</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">Layanan Klinik</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-teal-400 transition-colors">Dokter Hewan</Link>
              </li>
              <li>
                <Link to="/reserve" className="hover:text-teal-400 transition-colors">Buat Janji Reservasi</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-teal-400 shrink-0" />
                <span>Garut, Jawa Barat, Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <span>hello@fickybusuk.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Jam Operasional</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-teal-400" />
                  Senin - Jumat:
                </span>
                <span className="font-semibold text-white">08.00 - 20.00</span>
              </li>
              <li className="flex justify-between items-center gap-2 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-teal-400" />
                  Sabtu:
                </span>
                <span className="font-semibold text-white">09.00 - 17.00</span>
              </li>
              <li className="flex justify-between items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-teal-400" />
                  Minggu:
                </span>
                <span className="font-semibold text-white">10.00 - 15.00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Ficky Busuk Veterinary Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-slate-400 transition-colors">Portal Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
