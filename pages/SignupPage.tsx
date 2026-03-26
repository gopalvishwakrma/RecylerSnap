
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface SignupPageProps {
  onLogin: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: 'u' + Date.now(),
      name,
      email,
      ecoScore: 0,
      badges: [],
      scanCount: 0
    };
    onLogin(mockUser);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-100">
            <i className="fa-solid fa-leaf text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Join the Mission</h1>
          <p className="text-slate-500 mt-2">Start scanning and earning eco-rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Alex Green"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Create Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" required className="mt-1 accent-emerald-600" id="terms" />
            <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
              I agree to the <span className="text-emerald-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-emerald-600 hover:underline cursor-pointer">Privacy Policy</span> regarding camera and location data.
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-4"
          >
            Create Account
            <i className="fa-solid fa-circle-check"></i>
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
