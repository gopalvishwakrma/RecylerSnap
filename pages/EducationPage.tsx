
import React from 'react';
import { EDUCATIONAL_ARTICLES } from '../constants';

const EducationPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-4">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Eco-Knowledge Hub</h1>
        <p className="text-lg text-slate-500 max-w-2xl">Learn how your actions contribute to a cleaner planet and master the art of waste segregation.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-emerald-600 rounded-[40px] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-6">Expert Guide</span>
            <h2 className="text-3xl font-black mb-6">Master Waste Segregation</h2>
            <p className="text-emerald-100 mb-10 leading-relaxed">Download our ultimate cheat sheet for sorting household waste. Learn the difference between types of plastics and avoid contamination.</p>
            <button className="bg-white text-emerald-700 px-8 py-3 rounded-2xl font-bold shadow-lg group-hover:scale-105 transition-transform">
              View Guide
            </button>
          </div>
          <i className="fa-solid fa-recycle absolute -bottom-10 -right-10 text-white/10 text-[200px] pointer-events-none group-hover:rotate-12 transition-transform duration-700"></i>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Tips</h3>
          <Tip icon="fa-water" text="Always rinse food containers before recycling to prevent contamination." color="blue" />
          <Tip icon="fa-box" text="Flatten cardboard boxes to save space in collection bins." color="amber" />
          <Tip icon="fa-battery-half" text="Keep electronics and batteries out of standard bins; they require special handling." color="red" />
          <Tip icon="fa-leaf" text="Organic waste can be composted at home to reduce methane emissions." color="emerald" />
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Latest Articles</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {EDUCATIONAL_ARTICLES.map(article => (
            <div key={article.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
              <div className="h-40 bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                <i className={`fa-solid ${article.icon} text-4xl text-emerald-600/30 group-hover:scale-110 group-hover:text-emerald-600 transition-all`}></i>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">{article.category}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{article.readTime} read</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{article.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{article.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Tip: React.FC<{ icon: string; text: string; color: string }> = ({ icon, text, color }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${colorClasses[color]}`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm shrink-0">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default EducationPage;
