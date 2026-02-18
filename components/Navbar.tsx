
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', auth: true },
    { name: 'Map', path: '/map', auth: true },
    { name: 'Learn', path: '/education', auth: false },
  ];

  const activeClass = "text-emerald-600 font-semibold";
  const inactiveClass = "text-slate-600 hover:text-emerald-500 transition-colors";

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-emerald-200 shadow-lg group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-recycle"></i>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Recycle<span className="text-emerald-600">Snap</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              (!link.auth || user) && (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={location.pathname === link.path ? activeClass : inactiveClass}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-emerald-800">{user.ecoScore} pts</span>
                </Link>
                <button onClick={onLogout} className="text-slate-500 hover:text-red-500 text-sm font-medium">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 font-medium hover:text-emerald-600">Log in</Link>
                <Link to="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-shadow shadow-md">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-600 p-2" onClick={() => setIsOpen(!isOpen)}>
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 py-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          {navLinks.map(link => (
            (!link.auth || user) && (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-lg ${location.pathname === link.path ? 'text-emerald-600 font-bold' : 'text-slate-600'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
          {user ? (
            <>
              <Link to="/profile" className="text-lg text-slate-600" onClick={() => setIsOpen(false)}>Profile Settings</Link>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-left text-lg text-red-500">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg text-slate-600" onClick={() => setIsOpen(false)}>Log in</Link>
              <Link to="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-center font-bold" onClick={() => setIsOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
