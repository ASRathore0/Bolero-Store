
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Settings, Users, Scissors, DollarSign, TrendingUp, Download, Star, Plus, X, Zap, Droplets, Wind, User, Clock, Trash2, UserPlus, Image as ImageIcon, Upload, Camera, Check } from 'lucide-react';
import { ICON_MAP } from '../constants.tsx';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'];

export const AdminDashboard: React.FC = () => {
  const { barbers, services, bookings, theme, addService, deleteService, addBarber, deleteBarber, gallery, addToGallery, removeFromGallery } = useApp();
  const [modalType, setModalType] = useState<'none' | 'service' | 'barber' | 'gallery'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 30,
    durationMinutes: 45,
    icon: 'Scissors'
  });

  const [newBarber, setNewBarber] = useState({
    name: '',
    email: '',
    avatar: 'https://picsum.photos/seed/newbarber/200',
    specialties: ''
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addService(newService);
    setModalType('none');
    setNewService({ name: '', description: '', price: 30, durationMinutes: 45, icon: 'Scissors' });
  };

  const handleBarberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBarber({
      name: newBarber.name,
      email: newBarber.email,
      avatar: newBarber.avatar,
      specialties: newBarber.specialties.split(',').map(s => s.trim())
    });
    setModalType('none');
    setNewBarber({ name: '', email: '', avatar: 'https://picsum.photos/seed/newbarber/200', specialties: '' });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBarber(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGalleryUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGalleryUrl) {
      addToGallery(newGalleryUrl);
      setNewGalleryUrl('');
      setModalType('none');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 font-playfair tracking-tight">Salon Operations</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Global management for Yours Beauty Unisex Saloon</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setModalType('gallery')}
            className="flex items-center space-x-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm active:scale-95"
          >
            <ImageIcon size={16} />
            <span>Edit Gallery</span>
          </button>
          <button 
            onClick={() => setModalType('barber')}
            className="flex items-center space-x-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm active:scale-95"
          >
            <UserPlus size={16} />
            <span>Recruit Barber</span>
          </button>
          <button 
            onClick={() => setModalType('service')}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={16} />
            <span>New Service</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <DollarSign className="text-indigo-600 mb-4" size={24} />
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Gross</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">₹24,450</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <Users className="text-blue-500 mb-4" size={24} />
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Staff</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{barbers.length} Artisans</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <Scissors className="text-amber-500 mb-4" size={24} />
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bookings</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{bookings.length} Orders</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <Settings className="text-slate-500 mb-4" size={24} />
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Services</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{services.length} Skus</div>
        </div>
      </div>

      {/* Staff Management */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="text-indigo-600" size={24} />
            Master Team Members
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <div key={barber.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <img src={barber.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover ring-4 ring-slate-50 dark:ring-slate-800" />
                <div className="flex-grow">
                  <h3 className="font-black text-slate-900 dark:text-white text-lg">{barber.name}</h3>
                  <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs">
                    <Star size={12} className="fill-amber-400" />
                    {barber.rating}
                  </div>
                </div>
                <button 
                  onClick={() => deleteBarber(barber.id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {barber.specialties?.map(s => (
                  <span key={s} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-700">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Management Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 font-playfair tracking-tight">
          <ImageIcon className="text-indigo-600" size={24} />
          Salon Portfolio
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {gallery.map((img, idx) => (
            <div key={idx} className="relative aspect-square group overflow-hidden rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm">
              <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
              <button 
                onClick={() => removeFromGallery(idx)}
                className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setModalType('gallery')}
            className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition group"
          >
            <Plus size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
          </button>
        </div>
      </section>

      {/* Service Menu */}
      <section className="mb-12">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <Scissors className="text-indigo-600" size={24} />
          Active Service Menu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all relative">
              <button 
                onClick={() => deleteService(service.id)}
                className="absolute top-4 right-4 p-2 text-slate-200 hover:text-rose-500 transition"
              >
                <X size={16} />
              </button>
              <div className="text-2xl font-black text-indigo-600 mb-1">₹{service.price}</div>
              <h3 className="font-black text-slate-900 dark:text-white mb-3 text-lg leading-tight">{service.name}</h3>
              <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2">{service.description}</p>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                <Clock size={12} /> {service.durationMinutes} Minutes
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      {modalType === 'gallery' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setModalType('none')}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 sm:p-10 border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 font-playfair tracking-tight">Add Salon Photo</h2>
            <form onSubmit={handleGallerySubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL (Direct link)</label>
                <input 
                  autoFocus 
                  type="url" 
                  placeholder="https://your-image-url.jpg" 
                  value={newGalleryUrl.startsWith('data:') ? '' : newGalleryUrl} 
                  onChange={e => setNewGalleryUrl(e.target.value)} 
                  disabled={newGalleryUrl.startsWith('data:')}
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white text-sm disabled:opacity-50" 
                />
                {newGalleryUrl.startsWith('data:') && (
                  <div className="flex items-center gap-2 text-xs font-bold text-green-500 mt-2">
                    <Check size={14} /> 
                    <span>Image Selected from Device</span>
                    <button 
                      type="button" 
                      onClick={() => { setNewGalleryUrl(''); if (galleryFileInputRef.current) galleryFileInputRef.current.value = ''; }}
                      className="ml-auto text-slate-400 hover:text-rose-500 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload from Device</label>
                <div 
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition group"
                >
                  {newGalleryUrl.startsWith('data:') ? (
                    <img src={newGalleryUrl} alt="Preview" className="h-32 object-contain rounded-lg mb-2 shadow-sm" />
                  ) : (
                    <Upload className="text-slate-300 group-hover:text-indigo-500 mb-2 transition-colors" size={32} />
                  )}
                  <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-500 transition-colors">
                    {newGalleryUrl.startsWith('data:') ? 'Change Photo' : 'Click to Upload'}
                  </span>
                </div>
                <input 
                  type="file" 
                  ref={galleryFileInputRef}
                  onChange={handleGalleryImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="pt-2">
                 <p className="text-[10px] text-slate-400 font-medium mb-4">Use professional photos of your marble styling stations, gold accents, and halo mirrors.</p>
                 <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]">Update Portfolio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === 'service' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setModalType('none')}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden p-8 sm:p-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 font-playfair tracking-tight">Add New Service</h2>
            <form onSubmit={handleServiceSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                  <input required type="text" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</label>
                  <input required type="number" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white text-sm min-h-[100px] resize-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition">Publish Service</button>
            </form>
          </div>
        </div>
      )}

      {/* RECRUIT NEW BARBER MODAL - UPDATED STYLE & UPLOAD OPTION */}
      {modalType === 'barber' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg" onClick={() => setModalType('none')}></div>
          <div className="relative bg-[#0f172a] w-full max-w-xl rounded-[2rem] shadow-2xl p-10 border border-slate-800">
            <h2 className="text-3xl font-bold text-white mb-10 font-playfair tracking-tight">Recruit New Barber</h2>
            <form onSubmit={handleBarberSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Artisan Name</label>
                <input 
                  required 
                  type="text" 
                  value={newBarber.name} 
                  onChange={e => setNewBarber({...newBarber, name: e.target.value})} 
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white text-base placeholder-slate-600" 
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Work Email</label>
                <input 
                  required 
                  type="email" 
                  value={newBarber.email} 
                  onChange={e => setNewBarber({...newBarber, email: e.target.value})} 
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white text-base placeholder-slate-600" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avatar Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img 
                      src={newBarber.avatar} 
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all shadow-xl" 
                      alt="Avatar Preview" 
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera size={20} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-5 py-3 bg-[#1e293b] text-slate-300 border border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                    >
                      <Upload size={14} />
                      Upload Photo
                    </button>
                    <p className="text-[9px] text-slate-500 mt-2 font-medium">Recommended: Square headshot, min 400x400px</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Specialties (comma separated)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Skin Fades, Beard Art, Shaves" 
                  value={newBarber.specialties} 
                  onChange={e => setNewBarber({...newBarber, specialties: e.target.value})} 
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white text-base placeholder-slate-600" 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
              >
                Hire Artisan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
