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

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-10">
        {/* Background glow effects */}
        
        <div className="relative text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom duration-500">
            <Zap size={12} fill="currentColor" /> Smart Food Security Monitoring
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            Pantau Ketahanan Pangan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Secara Real-Time.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Platform intelijen data komoditas pangan untuk memonitor distribusi,
            fluktuasi harga, dan prediksi pasar di seluruh wilayah Jawa Timur.
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
              href="#features"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm border border-white/5 hover:border-white/10 transition-all"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tight">Teknologi Mutakhir</h2>
          <p className="text-gray-500 font-medium">Solusi cerdas untuk manajemen data pangan nasional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Geospatial Visualizer",
              desc: "Pemetaan interaktif berbasis TopoJSON yang memungkinkan Anda melihat distribusi surplus dan defisit komoditas per wilayah.",
              icon: MapIcon,
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            },
            {
              title: "Price Forecasting",
              desc: "Analisis prediksi harga menggunakan algoritma cerdas untuk membantu Anda mengantisipasi fluktuasi pasar di masa depan.",
              icon: BarChart3,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10"
            },
            {
              title: "Enterprise Security",
              desc: "Keamanan data tingkat tinggi dengan autentikasi JWT dan enkripsi untuk melindungi integritas informasi pangan nasional.",
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

      {/* How it Works */}
      <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Layers size={200} className="text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Dapatkan Wawasan <br /> dalam Hitungan Detik.
            </h2>
            <p className="text-gray-400 font-medium text-lg leading-relaxed">
              SIPANGAN dirancang untuk memberikan kemudahan bagi pemerintah, akademisi,
              maupun pelaku pasar dalam memahami ekosistem pangan.
            </p>
            <div className="space-y-4 pt-4">
              {[
                "Pilih komoditas dari katalog lengkap.",
                "Analisis tren harga historis dan masa depan.",
                "Lihat peta persebaran wilayah secara detail.",
                "Ekspor data untuk kebutuhan riset dan kebijakan."
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-300 font-bold">{step}</span>
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
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Market Trend</span>
                    <span className="text-[10px] font-black text-emerald-500">+12.5%</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[65%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="text-center py-20 relative">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-black text-white tracking-tight">Siap Memulai Analisis?</h2>
          <p className="text-gray-500 font-medium">
            Bergabunglah dengan ribuan pengguna yang telah menggunakan SIPANGAN untuk
            keputusan yang lebih cerdas dan tepat sasaran.
          </p>
          <Link
            to="/map"
            className="inline-flex px-10 py-5 bg-white text-gray-950 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-500 hover:text-white hover:scale-[1.05] active:scale-[0.95] transition-all"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
