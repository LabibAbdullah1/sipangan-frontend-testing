import React from 'react';
import { Link } from 'react-router-dom';
import {
  Map as MapIcon,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import PriceMarquee from '../../components/PriceMarquee';

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-10">
        <div className="relative text-center space-y-8 max-w-4xl mx-auto px-4 md:px-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom duration-500">
            <Zap size={12} fill="currentColor" /> Capstone Project - Coding Camp 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            Sistem Informasi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Ketahanan Pangan.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            SIPANGAN adalah aplikasi inovatif hasil pengembangan Capstone Project untuk memonitor distribusi, fluktuasi harga, dan prediksi ketahanan komoditas pasar secara Real-Time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Link
              to="/map"
              className="group relative px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
            >
              Buka Peta Interaktif
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm border border-white/5 hover:border-white/10 transition-all"
            >
              Tentang Proyek
            </a>
          </div>
        </div>
      </section>

      {/* Live Ticker Section */}
      <section className="relative w-full overflow-hidden">
        <PriceMarquee />
      </section>

      {/* About Project */}
      <section id="about" className="bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden mx-4 md:mx-0">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Layers size={200} className="text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-[10px] font-black uppercase tracking-widest">
              Latar Belakang
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Membangun Ekosistem <br /> Pangan yang Transparan.
            </h2>
            <p className="text-gray-400 font-medium text-lg leading-relaxed">
              Aplikasi ini dikembangkan secara khusus sebagai pemenuhan tugas akhir (Capstone Project) dari program <strong>Coding Camp 2026</strong>. 
              Fokus utama kami adalah mengatasi ketimpangan informasi harga pangan dan mendeteksi secara dini potensi kelangkaan komoditas di wilayah Jawa Timur.
            </p>
            <div className="space-y-4 pt-4">
              {[
                "Memanfaatkan data historis untuk mendeteksi anomali harga.",
                "Memberikan peringatan dini (Alert) saat terjadi lonjakan ekstrem.",
                "Menampilkan pemetaan spasial surplus/defisit pangan antar daerah.",
                "Sistem manajemen data admin yang terintegrasi dan aman."
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 shrink-0 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-300 font-bold leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
            <div className="relative bg-gray-950 border border-white/10 rounded-[2rem] p-2 overflow-hidden shadow-2xl">
              <div className="bg-gray-900 h-64 md:h-80 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden">
                <TrendingUp size={120} className="text-emerald-500/20 animate-pulse" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-gray-950/80 backdrop-blur border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Akurasi Deteksi</span>
                    <span className="text-[10px] font-black text-emerald-500">REAL-TIME</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[100%] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="relative px-4 md:px-0">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tight">Teknologi & Fitur Mutakhir</h2>
          <p className="text-gray-500 font-medium">Solusi arsitektur cerdas yang menenagai SIPANGAN.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Geospatial Visualizer",
              desc: "Pemetaan interaktif berbasis TopoJSON yang memungkinkan Anda melihat distribusi surplus dan defisit harga komoditas per wilayah secara langsung.",
              icon: MapIcon,
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            },
            {
              title: "Automated Early Warning",
              desc: "Sistem pendeteksi anomali harga otomatis. Operator tidak perlu mengecek manual; sistem akan membunyikan 'Alert' bila terdeteksi lonjakan harga kritis.",
              icon: Zap,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10"
            },
            {
              title: "Enterprise Security",
              desc: "Keamanan data tingkat tinggi dengan autentikasi JWT Multi-Role (Super Admin, Admin, Operator) dan enkripsi untuk melindungi integritas sistem.",
              icon: ShieldCheck,
              color: "text-amber-500",
              bg: "bg-amber-500/10"
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] hover:border-white/10 transition-all group">
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 border border-white/5`}>
                <feature.icon size={28} className={feature.color} />
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Developer Info */}
      <section className="text-center py-20 relative border-t border-white/5 px-4 md:px-0 mt-20">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
            <span className="text-2xl font-black text-blue-500">C26</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Dikembangkan Oleh Tim Capstone</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Terima kasih telah menggunakan SIPANGAN. Proyek ini merupakan bagian dari karya inovasi di <strong>Coding Camp 2026</strong>. 
            Jika Anda memiliki pertanyaan, masukan, atau tawaran kerja sama untuk mengembangkan platform ini ke skala nasional, silakan hubungi kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a href="mailto:contact@sipangan.id" className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.05] transition-all flex items-center justify-center gap-2">
              📧 Hubungi via Email
            </a>
            <a href="https://github.com/labib-project/sipangan" target="_blank" rel="noreferrer" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2">
              💻 GitHub Repository
            </a>
          </div>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-10">
            &copy; 2026 SIPANGAN - Coding Camp Capstone Project. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
