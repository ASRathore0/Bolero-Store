
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, LogOut, Moon, Sun, User, UserCheck, Shield, MoreVertical, X } from 'lucide-react';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, login, theme, toggleTheme } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const RoleButtons = ({ mobile = false }: { mobile?: boolean }) => {
    const btnClass = mobile 
      ? "flex items-center gap-3 w-full px-4 py-3 text-sm font-bold transition-colors" 
      : "flex items-center gap-1.5 px-3 py-2 transition font-bold text-xs";

    return (
      <>
        <button 
          onClick={() => { login(UserRole.CUSTOMER); setIsMenuOpen(false); }}
          className={`${btnClass} ${mobile ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
        >
          <User size={16} />
          <span>{mobile ? 'Customer' : 'User'}</span>
        </button>
        <button 
          onClick={() => { login(UserRole.BARBER); setIsMenuOpen(false); }}
          className={`${btnClass} ${mobile ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <UserCheck size={16} />
          <span>{mobile ? 'Barber / Staff' : 'Staff'}</span>
        </button>
        <button 
          onClick={() => { login(UserRole.ADMIN); setIsMenuOpen(false); }}
          className={`${btnClass} ${mobile ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg hover:bg-slate-800'}`}
        >
          <Shield size={16} />
          <span>{mobile ? 'Salon Owner' : 'Admin'}</span>
        </button>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                <Scissors size={24} className="sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none font-playfair">
                  Yours Beauty
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">
                  Makeup Studio & Unisex Saloon
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Responsive Login / Account Actions */}
              <div className="relative" ref={menuRef}>
                {!currentUser ? (
                  <>
                    {/* Desktop Role Selector */}
                    <div className="hidden sm:flex items-center space-x-2 ml-2">
                      <RoleButtons />
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button 
                      onClick={toggleMenu}
                      className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                      {isMenuOpen ? <X size={20} /> : <MoreVertical size={20} />}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 sm:space-x-4 ml-2">
                    <div className="hidden sm:flex items-center space-x-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Hi, <span className="font-bold text-slate-900 dark:text-white">{currentUser.name.split(' ')[0]}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded border border-indigo-100 dark:border-indigo-900/50">
                        {currentUser.role}
                      </span>
                    </div>
                    
                    <button 
                      onClick={logout}
                      className="hidden sm:flex p-2 text-slate-400 hover:text-red-500 transition"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>

                    <button 
                      onClick={toggleMenu}
                      className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                      {isMenuOpen ? <X size={20} /> : <MoreVertical size={20} />}
                    </button>
                  </div>
                )}

                {/* Dropdown Menu (Mobile/Desktop) */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">
                        {currentUser ? 'Account' : 'Login As'}
                      </p>
                    </div>
                    
                    {!currentUser ? (
                      <div className="flex flex-col">
                        <RoleButtons mobile />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="px-4 py-3 sm:hidden border-b border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{currentUser.name}</p>
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{currentUser.role}</span>
                        </div>
                        <button 
                          onClick={() => { logout(); setIsMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 sm:py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                   <Scissors size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-playfair leading-none">Yours Beauty</span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Makeup Studio & Unisex Saloon</span>
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
                Elevate your grooming experience with the city's finest artists. 
                Modern style meets traditional craftsmanship.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-900 dark:text-white text-sm uppercase tracking-widest">Salon</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-indigo-600 transition">Our Services</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Master Artists</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">User Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-900 dark:text-white text-sm uppercase tracking-widest">Connect</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-indigo-600 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            © 2024 Yours Beauty. Designed for Excellence.
          </div>
        </div>
      </footer>
    </div>
  );
};
