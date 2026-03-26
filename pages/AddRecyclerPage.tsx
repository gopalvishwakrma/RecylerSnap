
import React, { useState } from 'react';
import { WasteCategory } from '../types';

const AddRecyclerPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Submission Received!</h2>
        <p className="text-slate-500 mb-8">Thank you for contributing. Our team will review the recycler information and update the map within 24-48 hours.</p>
        <button onClick={() => window.history.back()} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">
          Back to Map
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="bg-white rounded-[32px] border border-stone-200 shadow-xl overflow-hidden">
        <div className="p-10 bg-emerald-900 text-white">
          <h1 className="text-3xl font-black mb-2">Contribute a Recycler</h1>
          <p className="text-emerald-100 opacity-80">Help others find sustainable disposal points in their community.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase mb-2">Center Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Westside Metals"
                className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase mb-2">Phone Number</label>
              <input 
                type="tel" 
                placeholder="+1 (555) 000-0000"
                className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-400 uppercase mb-2">Full Address</label>
            <input 
              type="text" 
              required 
              placeholder="Street, City, Zip Code"
              className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-400 uppercase mb-4">Accepted Materials</label>
            <div className="flex flex-wrap gap-3">
              {Object.values(WasteCategory).map(cat => (
                <label key={cat} className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-full border border-stone-100 cursor-pointer hover:bg-emerald-50 transition-colors">
                  <input type="checkbox" className="accent-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-400 uppercase mb-2">Operating Hours</label>
            <textarea 
              rows={2} 
              placeholder="e.g. Mon-Fri 8am-4pm, Sat 10am-2pm"
              className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-stone-100">
             <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
                Submit for Approval
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecyclerPage;
