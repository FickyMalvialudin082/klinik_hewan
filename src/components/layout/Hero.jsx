import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Heart, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-tr from-slate-50 via-teal-50/20 to-teal-100/30 py-20 sm:py-24 lg:py-32">
      {/* Decorative background grid/blobs */}
      <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-teal-500/5 ring-1 ring-teal-50/10 sm:-mr-80 lg:-mr-96" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1.5 text-xs font-semibold text-teal-800">
              <Heart size={14} className="fill-teal-600 stroke-none animate-pulse" />
              <span>Klinik Hewan Ficky Busuk</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans leading-tight">
              Perawatan Terbaik untuk <span className="text-teal-600">Hewan Kesayanganmu</span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
              Klinik hewan terpercaya untuk pemeriksaan, vaksinasi, grooming, dan konsultasi kesehatan hewan. Kami hadir dengan tenaga ahli medis berpengalaman demi kesembuhan dan keceriaan peliharaan Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/reserve"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Calendar size={18} />
                <span>Buat Janji Sekarang</span>
              </Link>
              
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all duration-150"
              >
                <span>Lihat Layanan</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Micro metrics / badges */}
            <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-slate-900">4+</p>
                <p className="text-xs text-slate-500 font-medium">Dokter Ahli</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">8+</p>
                <p className="text-xs text-slate-500 font-medium">Layanan Utama</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Kasih Sayang</p>
              </div>
            </div>
          </div>

          {/* Graphical Content */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual background circle */}
            <div className="absolute -inset-4 rounded-full bg-teal-500/10 blur-2xl" />
            
            {/* Main Picture Frame */}
            <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl w-full max-w-md aspect-[4/3] sm:aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=600&auto=format&fit=crop"
                alt="Dokter hewan merawat anjing peliharaan"
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Overlap float badge */}
            <div className="absolute -bottom-4 -left-4 sm:left-4 bg-white/95 rounded-xl border border-slate-100 p-4 shadow-xl flex items-center gap-3 backdrop-blur-sm">
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Peralatan Modern</span>
                <span className="text-[10px] text-slate-500">Standar Medis Terbaik</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
