
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  Calendar as CalendarIcon, 
  Send, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight, 
  Coffee, 
  Award, 
  ShieldCheck, 
  ExternalLink,
  MapPin,
  Briefcase,
  ChevronRight,
  BellRing,
  Lock,
  CalendarX,
  Camera,
  Upload
} from 'lucide-react';
import { BookingStatus } from '../types.ts';
import { TIME_SLOTS } from '../constants.tsx';

const MOCK_DATA = [
  { name: 'Mon', revenue: 240 },
  { name: 'Tue', revenue: 380 },
  { name: 'Wed', revenue: 320 },
  { name: 'Thu', revenue: 450 },
  { name: 'Fri', revenue: 590 },
  { name: 'Sat', revenue: 840 },
  { name: 'Sun', revenue: 150 },
];

export const BarberDashboard: React.FC = () => {
  const { bookings, services, currentUser, updateBookingStatus, theme, toggleBarberDayOff, updateProfile } = useApp();
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState<{ message: string; show: boolean; sub?: string }>({ message: '', show: false });
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [justConfirmedId, setJustConfirmedId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editProfileData, setEditProfileData] = useState({
    name: currentUser?.name || '',
    specialties: currentUser?.specialties?.join(', ') || '',
    avatar: currentUser?.avatar || ''
  });
  
  const agendaRef = useRef<HTMLElement>(null);
  const myBookings = bookings.filter(b => b.barberId === currentUser?.id);
  const getService = (id: string) => services.find(s => s.id === id);

  const isDayOff = currentUser?.offDays?.includes(viewDate);

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleDateClick = (date: string) => {
    setViewDate(date);
    agendaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleConfirm = async (id: string, clientName: string) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    updateBookingStatus(id, BookingStatus.CONFIRMED);
    setJustConfirmedId(id);
    
    setToast({ 
      message: "Booking Approved!", 
      sub: `Confirmation SMS & notification dispatched.`,
      show: true 
    });
    
    setProcessingId(null);
    setTimeout(() => setJustConfirmedId(null), 3000);
  };

  const handleToggleDayOff = () => {
    if (!currentUser) return;
    const hasBookings = myBookings.some(b => b.date === viewDate && b.status !== BookingStatus.CANCELLED);
    if (!isDayOff && hasBookings) {
      if (!confirm("Confirm rest day? Existing bookings will remain but no new ones can be made.")) return;
    }
    toggleBarberDayOff(currentUser.id, viewDate);
    setToast({
      message: isDayOff ? "Schedule Opened" : "Schedule Paused",
      sub: isDayOff ? "New slots are bookable." : "Public calendar blocked.",
      show: true
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfileData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editProfileData.name,
      specialties: editProfileData.specialties.split(',').map(s => s.trim()).filter(s => s !== ''),
      avatar: editProfileData.avatar
    });
    setIsEditingProfile(false);
    setToast({
      message: "Profile Updated",
      sub: "Changes saved to your public artisan card.",
      show: true
    });
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  const dayBookings = myBookings.filter(b => b.date === viewDate);

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 sm:p-3 rounded-2xl ${color}`}>
          <Icon size={20} className="text-white sm:w-[24px] sm:h-[24px]" />
        </div>
        <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
      <div className="text-[10px] text-slate-500 font-bold">{sub}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 transition-colors duration-300 relative">
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-4 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-slate-900 px-5 py-4 rounded-2xl sm:rounded-[2rem] shadow-2xl flex items-center space-x-4 border border-slate-800 dark:border-slate-200 min-w-0 sm:min-w-[320px] overflow-hidden">
            <div className="bg-indigo-600 p-2.5 rounded-full flex-shrink-0">
              <BellRing size={16} className="text-white animate-bounce" />
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="font-black text-xs sm:text-sm tracking-tight truncate">{toast.message}</p>
              <p className="text-[8px] sm:text-[10px] opacity-70 font-bold uppercase tracking-widest truncate mt-0.5">{toast.sub}</p>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} className="opacity-50">
              <XCircle size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="mb-8 sm:mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl -z-10 rounded-[3rem]"></div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-80 bg-slate-50/50 dark:bg-slate-800/30 p-6 sm:p-8 border-r border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img 
                  src={currentUser?.avatar} 
                  alt={currentUser?.name} 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl sm:rounded-[2.5rem] object-cover ring-4 sm:ring-8 ring-white dark:ring-slate-900 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 px-3 py-1 rounded-full border-2 sm:border-4 border-white dark:border-slate-900 flex items-center gap-1.5 shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-tighter">Active</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl text-base sm:text-lg font-black border border-amber-100 dark:border-amber-900/30">
                <Star size={16} className="fill-amber-600" />
                {currentUser?.rating || "4.9"}
              </div>
            </div>

            <div className="flex-grow p-6 sm:p-10">
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        {currentUser?.name}
                        <ShieldCheck size={24} className="text-indigo-500 shrink-0" />
                      </h1>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Master Artisan</p>
                    </div>
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentUser?.specialties?.map((spec) => (
                      <span key={spec} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                  {[
                    { l: 'Cuts', v: '1.2k+' },
                    { l: 'Retention', v: '98%' },
                    { l: 'Avg Time', v: '45m' },
                    { l: 'Rank', v: '#1' }
                  ].map(stat => (
                    <div key={stat.l}>
                      <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{stat.v}</div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <StatCard title="Today" value={myBookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length} sub="Scheduled sessions" icon={Clock} color="bg-indigo-600" />
        <StatCard title="Sales" value={`₹${currentUser?.earnings || 0}`} sub="Total revenue" icon={DollarSign} color="bg-green-500" />
        <StatCard title="Clients" value="142" sub="Unique visitors" icon={Users} color="bg-blue-500" />
        <StatCard title="Score" value={currentUser?.rating || "4.9"} sub="Client satisfaction" icon={Star} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Calendar */}
          <section className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <CalendarIcon className="mr-2 text-indigo-600" size={18} />
              Schedule Management
            </h2>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((date) => {
                const dateObj = new Date(date);
                const isSelected = date === viewDate;
                const dateOff = currentUser?.offDays?.includes(date);
                return (
                  <button
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`flex flex-col items-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900'
                    } ${dateOff ? 'opacity-50' : ''}`}
                  >
                    <span className={`text-[8px] uppercase font-black ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={`text-base sm:text-xl font-black ${isSelected ? 'text-indigo-600' : (dateOff ? 'text-rose-500' : 'text-slate-900 dark:text-slate-100')}`}>
                      {dateObj.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Agenda */}
          <section id="daily-agenda" ref={agendaRef} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-[1.2rem] text-white shadow-lg ${isDayOff ? 'bg-rose-500' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
                  {isDayOff ? <CalendarX size={24} /> : <CalendarIcon size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Daily Agenda</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(viewDate).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                </div>
              </div>
              <button 
                onClick={handleToggleDayOff}
                className={`flex items-center gap-4 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 ${isDayOff ? 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {isDayOff ? 'Rest Day Active' : 'Set Rest Day'}
                {isDayOff ? <ToggleRight size={28} className="text-rose-500" /> : <ToggleLeft size={28} className="opacity-50" />}
              </button>
            </div>

            <div className="space-y-4">
              {TIME_SLOTS.map((slot) => {
                const booking = dayBookings.find(b => b.timeSlot === slot && b.status !== BookingStatus.CANCELLED);
                const service = booking ? getService(booking.serviceId) : null;
                return (
                  <div key={slot} className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${booking ? 'bg-indigo-50/40 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900 shadow-sm' : 'bg-slate-50/40 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                    <div className="flex items-center gap-6">
                      <span className="text-[11px] sm:text-xs font-black text-slate-400 dark:text-slate-500 w-20 tracking-widest">{slot}</span>
                      {booking ? (
                        <div>
                          <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">{service?.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <div className={`w-1.5 h-1.5 rounded-full ${booking.status === BookingStatus.CONFIRMED ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{booking.status === BookingStatus.CONFIRMED ? 'Confirmed' : 'Pending Review'}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                           <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase italic tracking-widest">Available</span>
                        </div>
                      )}
                    </div>
                    {booking && booking.status === BookingStatus.PENDING && (
                      <button 
                        onClick={() => handleConfirm(booking.id, 'Client')}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all hover:bg-indigo-700"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/10 border border-slate-800">
            <h3 className="text-lg font-black mb-8 flex items-center gap-3">
              <Sparkles size={20} className="text-indigo-400" />
              Barber Insights
            </h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Peak Times</p>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">Friday slots are 90% full. Expect a high-volume session with recurring clients.</p>
              </div>
              <div className="bg-indigo-600/10 p-6 rounded-3xl border border-indigo-500/20">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">Goal Progress</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-indigo-400 rounded-full w-[78%]"></div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold">78% of monthly target reached</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg" onClick={() => setIsEditingProfile(false)}></div>
          <div className="relative bg-[#0f172a] w-full max-w-xl rounded-[2rem] shadow-2xl p-10 border border-slate-800">
            <h2 className="text-3xl font-bold text-white mb-10 font-playfair tracking-tight">Edit Your Profile</h2>
            <form onSubmit={handleProfileSave} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Display Name</label>
                <input 
                  required 
                  type="text" 
                  value={editProfileData.name} 
                  onChange={e => setEditProfileData({...editProfileData, name: e.target.value})} 
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white text-base" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Profile Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img 
                      src={editProfileData.avatar} 
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
                    <p className="text-[9px] text-slate-500 mt-2 font-medium">Headshot recommended (min 400x400px)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Specialties (comma separated)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Skin Fades, Beard Art, Shaves" 
                  value={editProfileData.specialties} 
                  onChange={e => setEditProfileData({...editProfileData, specialties: e.target.value})} 
                  className="w-full px-6 py-4 bg-[#1e293b] border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white text-base" 
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-5 bg-slate-800 text-slate-300 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
