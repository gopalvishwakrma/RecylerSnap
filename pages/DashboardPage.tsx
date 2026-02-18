
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ScanResult } from '../types';
import { BADGES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardPageProps {
  user: User;
  history: ScanResult[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, history }) => {
  // Simple stats calculation
  const stats = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 2 },
    { name: 'Thu', count: 5 },
    { name: 'Fri', count: user.scanCount % 10 },
    { name: 'Sat', count: 0 },
    { name: 'Sun', count: 0 },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-8 py-4">
      {/* Sidebar: Profile & Badges */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center">
          <div className="w-24 h-24 bg-emerald-600 text-white rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-emerald-200">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 mb-6">Eco Member since 2024</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 p-4 rounded-2xl">
              <span className="block text-2xl font-black text-emerald-600">{user.ecoScore}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Eco Score</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl">
              <span className="block text-2xl font-black text-blue-600">{user.scanCount}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">Total Scans</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex justify-between items-center">
            Achievements
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">{user.badges.length}/{BADGES.length}</span>
          </h3>
          <div className="flex flex-wrap gap-4">
            {BADGES.map(badge => (
              <div 
                key={badge.id}
                title={badge.description}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${
                  user.badges.includes(badge.id) 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-300 grayscale opacity-50'
                }`}
              >
                <i className={`fa-solid ${badge.icon}`}></i>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main: Stats & History */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Weekly Recycling Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={40}>
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#10b981' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex-grow">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Recent Scans</h3>
            <Link to="/scanner" className="text-emerald-600 text-sm font-bold hover:underline">New Scan +</Link>
          </div>
          
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.slice(0, 5).map(scan => (
                <div key={scan.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                    scan.isRecyclable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <i className={`fa-solid ${scan.isRecyclable ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800">{scan.itemName}</h4>
                    <span className="text-xs text-slate-400">{new Date(scan.timestamp).toLocaleDateString()} • {scan.category}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${scan.isRecyclable ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {scan.isRecyclable ? '+10 pts' : '+2 pts'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mx-auto mb-4">
                <i className="fa-solid fa-ghost text-2xl"></i>
              </div>
              <p className="text-slate-500">No scans yet. Start by scanning your first item!</p>
              <Link to="/scanner" className="mt-6 inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-100">
                Open Scanner
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
