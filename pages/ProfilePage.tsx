
import React from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="bg-white rounded-[32px] border border-stone-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-emerald-900 relative">
          <div className="absolute -bottom-12 left-10 w-24 h-24 bg-emerald-600 text-white rounded-[24px] border-4 border-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="pt-16 px-10 pb-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
              <p className="text-slate-500">{user.email}</p>
            </div>
            <button className="bg-stone-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold hover:bg-stone-200 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest block mb-2">Notification Settings</span>
              <div className="space-y-4">
                <Toggle label="Email Summaries" checked />
                <Toggle label="Nearby Alerts" checked />
                <Toggle label="Reward Milestones" />
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
              <span className="text-xs font-black text-blue-700 uppercase tracking-widest block mb-2">Data & Privacy</span>
              <div className="space-y-4 text-sm text-blue-900">
                <p>Download your data</p>
                <p>Revoke camera access</p>
                <p className="text-red-600 font-bold">Delete account</p>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-10 flex justify-center">
            <button 
              onClick={onLogout}
              className="text-red-500 font-bold hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              Log Out Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ label: string; checked?: boolean }> = ({ label, checked = false }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-emerald-600' : 'bg-slate-300'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

export default ProfilePage;
