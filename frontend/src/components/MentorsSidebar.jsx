export default function MentorsSidebar() {
  return (
    <>
      {/* Recent Mentors */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Mentors</h3>
          <a className="text-[10px] font-bold text-bts-gold hover:underline" href="#">View All</a>
        </div>
        <div className="space-y-5">
          <div className="flex items-center gap-4 group cursor-pointer">
            <img alt="Sophia Zhang" className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-yellow-100 transition-all object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNwdFcdty3Ro87T9huOEu1ggb4uSYlHpSE9110O-CToiQpGnI_xvtkMTHJJazL5l98T2ZeDL38nT590SodtBh0Op1azdfUbsT3K_eZ0niXDpUsnw8-PR83VwfGwpAaSFGsyNeiSjrGAKQON6BGkSaX_jwjXCYetL46CV0PlIOfKfnGWxiHe1Bc7HZaLyXAeZ_sPFnd3Eat19zDJyrqA8ZUfpQ91G9saaulPwe6z58IxBUmCetsZMnCx5mqtP53LovhI8nlD57Ki20"/>
            <div className="flex-1">
              <p className="font-bold text-xs text-brand-dark group-hover:text-bts-gold transition-colors">Sophia Zhang</p>
              <p className="text-[9px] text-gray-400">Last session: 2 days ago</p>
            </div>
            <span className="material-symbols-outlined !text-[16px] text-gray-300 group-hover:text-bts-gold">chat</span>
          </div>
          <div className="flex items-center gap-4 group cursor-pointer">
            <img alt="Dr. Robert Fox" className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-yellow-100 transition-all object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5zQc_E8ElFImsZ4sOb7mBx0rJre4RQtfXIfcIUvovlGMrvO5HE0JdlE7t1lMSfhGuXkeFI9ZhVTnU4JBke9VQ5UhQGVysBj0lKMyjKwGDA4VnRdNX_xrbBGeY-PZkIfn1ytNskKJcZHtpN5HQ5TpWw_YrXy7sCt1runVf6C4UVDXDiaCTe2Tn7lG7d-Nj-esXdWvRObBIwmz3i91vVHCPGTKhgXS_8Dn7LACwHNZ9mdCiH1EO0s5QGqMNT82W3fLUap0nkSQy_lU"/>
            <div className="flex-1">
              <p className="font-bold text-xs text-brand-dark group-hover:text-bts-gold transition-colors">Dr. Robert Fox</p>
              <p className="text-[9px] text-gray-400">Last session: Oct 12</p>
            </div>
            <span className="material-symbols-outlined !text-[16px] text-gray-300 group-hover:text-bts-gold">chat</span>
          </div>
        </div>
      </section>

      {/* Top Rated Elite */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-bts-gold !text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Rated Elite</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-xl font-extrabold italic text-gray-100 leading-none">01</span>
            <div className="flex-1">
              <p className="font-bold text-xs text-brand-dark">Elena Rodriguez</p>
              <p className="text-[9px] text-gray-400">AI / ML Lead • 5.0 ★</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-extrabold italic text-gray-100 leading-none">02</span>
            <div className="flex-1">
              <p className="font-bold text-xs text-brand-dark">Dr. Sarah Vance</p>
              <p className="text-[9px] text-gray-400">EVM Architect • 4.9 ★</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-extrabold italic text-gray-100 leading-none">03</span>
            <div className="flex-1">
              <p className="font-bold text-xs text-brand-dark">Prof. Amara Okafor</p>
              <p className="text-[9px] text-gray-400">Cryptography • 5.0 ★</p>
            </div>
          </div>
        </div>
      </section>

      {/* Help & FAQ Section */}
      <section className="bg-brand-dark rounded-2xl p-6 text-white relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-[10px] font-bold mb-4 uppercase tracking-widest flex items-center gap-2 text-yellow-500">
            <span className="material-symbols-outlined !text-[16px]">help</span>
            Help &amp; FAQ
          </h3>
          <ul className="space-y-3 mb-6">
            <li>
              <a className="flex justify-between items-center group/link hover:text-bts-gold transition-colors" href="#">
                <span className="text-[11px] font-medium">How do BTS credits work?</span>
                <span className="material-symbols-outlined !text-[14px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </li>
            <li>
              <a className="flex justify-between items-center group/link hover:text-bts-gold transition-colors" href="#">
                <span className="text-[11px] font-medium">Session cancellation policy</span>
                <span className="material-symbols-outlined !text-[14px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </li>
          </ul>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-[10px] font-bold mb-1">Need specialized assistance?</p>
            <p className="text-[9px] opacity-60 mb-3 leading-tight">Get in touch with our institutional success team.</p>
            <button className="w-full bg-white text-brand-dark text-[10px] font-extrabold py-2.5 rounded-lg hover:bg-bts-gold hover:text-white transition-all">Contact Support</button>
          </div>
        </div>
      </section>
    </>
  );
}
