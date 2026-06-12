import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Stethoscope, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Star
} from 'lucide-react';
import api from '../../api/client';
import Hero from '../../components/layout/Hero';
import ServiceCard from '../../components/common/ServiceCard';
import DoctorCard from '../../components/common/DoctorCard';
import TestimonialCard from '../../components/common/TestimonialCard';
import ContactSection from '../../components/layout/ContactSection';

const Home = () => {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, doctorsData, testimonialsData] = await Promise.all([
          api.get('/services'),
          api.get('/doctors'),
          api.get('/testimonials')
        ]);
        
        // Filter to display active/available items on home preview
        setServices(servicesData.filter(s => s.status === 'active').slice(0, 3));
        setDoctors(doctorsData.filter(d => d.status === 'available').slice(0, 4));
        setTestimonials(testimonialsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Tentang Kami Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="absolute -left-4 -top-4 w-72 h-72 bg-teal-200/30 rounded-full blur-2xl -z-10" />
            <img
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500&auto=format&fit=crop"
              alt="Klinik hewan modern"
              className="rounded-2xl shadow-lg border border-slate-200 aspect-[4/3] object-cover"
            />
          </div>
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">Tentang Kami</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight leading-tight">
              Ficky Busuk Klinik Hewan Modern & Terpercaya
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ficky Busuk adalah klinik hewan modern yang didirikan untuk memberikan solusi perawatan kesehatan hewan peliharaan secara menyeluruh. Kami memadukan kasih sayang dengan keahlian klinis untuk memberikan hasil terbaik bagi anjing, kucing, dan hewan peliharaan lainnya.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Dokter Berpengalaman</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                  <Sparkles size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Peralatan Modern</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                  <Heart size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Layanan Ramah & Cepat</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                  <Clock size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Reservasi Online Mudah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Layanan Klinik Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">Layanan Kami</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
              Solusi Kesehatan Terbaik
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <span>Lihat Semua Layanan</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Dokter Hewan Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">Tim Medis</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
              Dokter Hewan Profesional
            </h2>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <span>Lihat Semua Dokter</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Testimonial Section */}
      <section className="bg-teal-50/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">Testimoni</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">
              Apa Kata Pemilik Hewan?
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Kontak & Form Konsultasi Section */}
      <ContactSection />
    </div>
  );
};

export default Home;
