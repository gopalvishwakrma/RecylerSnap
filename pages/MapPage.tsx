
import React, { useState, useEffect } from 'react';
import { MOCK_RECYCLERS } from '../constants';
import { WasteCategory, Recycler } from '../types';

const MapPage: React.FC = () => {
  const [filter, setFilter] = useState<WasteCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedRecycler, setSelectedRecycler] = useState<Recycler | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate location loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredRecyclers = MOCK_RECYCLERS.filter(r => {
    const matchesFilter = filter === 'All' || r.acceptedTypes.includes(filter as WasteCategory);
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Find Recyclers</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search centers..."
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['All', ...Object.values(WasteCategory)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    filter === cat 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-stone-50 border-b border-stone-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredRecyclers.length} Results Near You
          </div>
          <div className="overflow-y-auto">
            {filteredRecyclers.map(r => (
              <button 
                key={r.id}
                onClick={() => setSelectedRecycler(r)}
                className={`w-full text-left p-6 border-b border-stone-50 hover:bg-emerald-50 transition-colors ${selectedRecycler?.id === r.id ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{r.name}</h4>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">{r.distance}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{r.address}</p>
                <div className="flex flex-wrap gap-1">
                  {r.acceptedTypes.slice(0, 3).map(type => (
                    <span key={type} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{type}</span>
                  ))}
                  {r.acceptedTypes.length > 3 && <span className="text-[9px] text-slate-400">+{r.acceptedTypes.length - 3}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-grow bg-white rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <i className="fa-solid fa-location-crosshairs fa-spin"></i>
            </div>
            <p className="text-slate-400 font-medium">Detecting Location...</p>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-100 relative">
            {/* Visual Mock of a map grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            {/* Markers */}
            {filteredRecyclers.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRecycler(r)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${(r.lng + 74.1) * 2000}%`, 
                  top: `${(40.8 - r.lat) * 2000}%` 
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedRecycler?.id === r.id ? 'bg-emerald-600 text-white scale-125 z-20' : 'bg-white text-emerald-600 shadow-lg scale-100 z-10'}`}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-30">
                  {r.name}
                </div>
              </button>
            ))}

            {/* User Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
               <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-ping absolute inset-0"></div>
               <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative"></div>
            </div>

            {/* Selection Detail Overlay */}
            {selectedRecycler && (
              <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96 bg-white p-6 rounded-2xl shadow-2xl border border-stone-100 animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedRecycler.name}</h3>
                    <p className="text-sm text-slate-500">{selectedRecycler.address}</p>
                  </div>
                  <button onClick={() => setSelectedRecycler(null)} className="text-slate-300 hover:text-slate-500">
                    <i className="fa-solid fa-circle-xmark text-xl"></i>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-sm">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Hours</span>
                    <span className="font-medium text-slate-700">{selectedRecycler.hours}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Rating</span>
                    <span className="font-bold text-amber-500">
                      <i className="fa-solid fa-star mr-1"></i>
                      {selectedRecycler.rating}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-grow bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <i className="fa-solid fa-diamond-turn-right"></i>
                    Directions
                  </button>
                  <button className="w-12 h-12 bg-stone-100 text-slate-600 rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center">
                    <i className="fa-solid fa-phone"></i>
                  </button>
                </div>
              </div>
            )}

            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600">
                <i className="fa-solid fa-plus"></i>
              </button>
              <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600">
                <i className="fa-solid fa-minus"></i>
              </button>
              <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600">
                <i className="fa-solid fa-location-crosshairs"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
