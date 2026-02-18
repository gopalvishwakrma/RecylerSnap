
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ScanResult } from '../types';

interface ScanResultPageProps {
  result: ScanResult | null;
}

const ScanResultPage: React.FC<ScanResultPageProps> = ({ result }) => {
  if (!result) return <Navigate to="/scanner" />;

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col gap-8">
      {/* Result Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        <div className={`p-8 ${result.isRecyclable ? 'bg-emerald-600' : 'bg-slate-800'} text-white`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                Analysis Complete
              </span>
              <h2 className="text-4xl font-black mb-1">{result.itemName}</h2>
              <p className="text-lg opacity-90">{result.category} Material</p>
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-white/30 text-4xl bg-white/10`}>
              <i className={`fa-solid ${result.isRecyclable ? 'fa-recycle' : 'fa-trash-can'}`}></i>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {result.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-stone-100 shadow-inner">
                <img src={result.imageUrl} alt="Scanned item" className="w-full h-48 object-cover" />
              </div>
            )}
            
            <div className="flex flex-col justify-center">
              <div className={`p-6 rounded-2xl ${result.isRecyclable ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'} border ${result.isRecyclable ? 'border-emerald-100' : 'border-red-100'}`}>
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <i className={`fa-solid ${result.isRecyclable ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                  {result.isRecyclable ? 'Recyclable!' : 'Not Recyclable'}
                </h3>
                <p className="text-sm opacity-90">
                  {result.isRecyclable 
                    ? "Great news! This material can be repurposed if sorted correctly." 
                    : "This item cannot be recycled in standard facilities. Please dispose of it in general waste."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">How to Recycle</h4>
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <p className="text-slate-700 leading-relaxed italic">"{result.instructions}"</p>
              </div>
            </section>

            <section>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Environmental Impact</h4>
              <div className="flex gap-4 items-start bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <p className="text-sm text-blue-900 leading-relaxed">{result.impactInfo}</p>
              </div>
            </section>
          </div>
        </div>

        <div className="p-8 bg-stone-50 border-t border-stone-100 flex flex-col md:flex-row gap-4">
          <Link 
            to="/map" 
            className="flex-grow bg-emerald-600 text-white py-4 rounded-2xl font-bold text-center hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-map-pin"></i>
            Find Nearby Recycler
          </Link>
          <Link 
            to="/scanner" 
            className="bg-white text-slate-600 border border-stone-200 py-4 px-8 rounded-2xl font-bold text-center hover:bg-stone-100 transition-all"
          >
            Scan Another
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScanResultPage;
