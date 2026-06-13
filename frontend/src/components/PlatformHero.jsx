import { Link } from 'react-router-dom';

export default function PlatformHero() {
  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 mb-8 relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <span className="text-bts-gold font-bold text-[10px] uppercase tracking-widest mb-2 block">Knowledge Exchange</span>
        <h2 className="text-2xl font-extrabold text-brand-dark mb-3">Connect with Industry Experts &amp; Verified Scholars</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-lg">Unlock personalized guidance, technical reviews, and career roadmap sessions with the world's leading blockchain researchers.</p>
        <div className="flex gap-4">
          <Link to="/expert-mentors" className="bg-[#d4a017] text-white px-6 py-2.5 rounded-custom text-sm font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md">
            Find a Mentor
            <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
          </Link>
          <button className="border border-gray-200 text-brand-dark px-6 py-2.5 rounded-custom text-sm font-bold hover:bg-gray-50 transition-colors">
            Become a Mentor
          </button>
        </div>
      </div>
      {/* Background Pattern similar to dashboard style but keeping context */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d4a017 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
      </div>
    </section>
  );
}
