
import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Calendar, Clock, History, Scissors, AlertCircle, Bell, Smartphone, XCircle, Star } from 'lucide-react';
import { BookingStatus, Booking } from '../types.ts';

interface CustomerDashboardProps {
  onBookNew: () => void;
}

const StarRating: React.FC<{ 
  rating: number; 
  onRate?: (r: number) => void;
  interactive?: boolean;
}> = ({ rating, onRate, interactive }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(i)}
          className={`transition-all ${interactive ? 'hover:scale-125' : ''}`}
        >
          <Star 
            size={interactive ? 18 : 14} 
            className={`${
              i <= (hovered || rating) 
                ? 'fill-amber-400 text-amber-400' 
                : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onBookNew }) => {
  const { bookings, barbers, services, currentUser, notifications, updateBookingStatus, rateBarber } = useApp();
  
  const customerBookings = bookings.filter(b => b.customerId === currentUser?.id);
  const myNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const upcomingBookings = customerBookings.filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING);
  const pastBookings = customerBookings.filter(b => b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CANCELLED);

  const getService = (id: string) => services.find(s => s.id === id);
  const getBarber = (id: string) => barbers.find(b => b.id === id);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
      updateBookingStatus(bookingId, BookingStatus.CANCELLED);
    }
  };

  const BookingCard: React.FC<{ booking: Booking; isPast?: boolean }> = ({ booking, isPast }) => {
    const service = getService(booking.serviceId);
    const barber = getBarber(booking.barberId);

    return (
      <div className={`p-6 rounded-2xl border transition-all ${
        isPast 
          ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
      } flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group`}>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Scissors size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{service?.name}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">with <span className="text-slate-900 dark:text-slate-200 font-semibold">{barber?.name}</span></p>
            <div className="flex items-center mt-2 space-x-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <span className="flex items-center"><Calendar size={14} className="mr-1" /> {booking.date}</span>
              <span className="flex items-center"><Clock size={14} className="mr-1" /> {booking.timeSlot}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 z-10">
          <div className="flex items-center gap-3">
            {booking.status === BookingStatus.COMPLETED && (
              <div className="flex flex-col items-end gap-1.5">
                {booking.rating ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rated</span>
                    <StarRating rating={booking.rating} />
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-[0.2em] mb-1">Rate your artisan</span>
                    <StarRating rating={0} interactive onRate={(r) => rateBarber(booking.id, r)} />
                  </div>
                )}
              </div>
            )}

            {!isPast && (
              <button 
                onClick={() => handleCancelBooking(booking.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                title="Cancel Appointment"
              >
                <XCircle size={18} />
              </button>
            )}
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              booking.status === BookingStatus.PENDING ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
              booking.status === BookingStatus.CANCELLED ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
              booking.status === BookingStatus.COMPLETED ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' :
              'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {booking.status}
            </span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">₹{booking.totalPrice}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-playfair tracking-tight">Client Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Elevate your grooming legacy with ease.</p>
        </div>
        <button 
          onClick={onBookNew}
          className="flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 cursor-pointer shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 outline-none focus:ring-4 focus:ring-indigo-500/30"
        >
          <Calendar size={18} />
          <span>New Session</span>
        </button>
      </div>

      <div className="space-y-12">
        {/* Notifications / SMS Alerts Section */}
        {myNotifications.length > 0 && (
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Bell size={80} className="text-indigo-600" />
             </div>
            <div className="flex items-center gap-3 mb-8 text-indigo-600 dark:text-indigo-400 relative">
              <Smartphone size={24} />
              <h2 className="text-2xl font-black font-playfair tracking-tight">Direct Updates</h2>
            </div>
            <div className="space-y-4 relative">
              {myNotifications.slice(0, 3).map(note => (
                <div key={note.id} className={`p-5 rounded-2xl flex items-start gap-4 transition-all border ${
                  note.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' :
                  'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'
                }`}>
                  <div className={`p-2.5 rounded-full flex-shrink-0 ${
                    note.type === 'success' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    <Bell size={16} />
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm font-bold tracking-tight mb-1 ${note.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-slate-700 dark:text-slate-300'}`}>
                      {note.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                      {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center space-x-3 mb-8 text-slate-900 dark:text-white">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Calendar size={20} />
            </div>
            <h2 className="text-2xl font-black font-playfair tracking-tight">Upcoming Sessions</h2>
          </div>
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-6">
              {upcomingBookings.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] p-16 text-center border-4 border-dashed border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active bookings</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Your next session is just a few clicks away. Secure your artisan today.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center space-x-3 mb-8 text-slate-900 dark:text-white">
            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 rounded-lg">
              <History size={20} />
            </div>
            <h2 className="text-2xl font-black font-playfair tracking-tight text-slate-500 dark:text-slate-400">Past Grooming</h2>
          </div>
          <div className="grid gap-6">
            {pastBookings.length > 0 ? (
              pastBookings.map(b => <BookingCard key={b.id} booking={b} isPast />)
            ) : (
              <p className="text-slate-400 dark:text-slate-600 font-medium italic px-4">Your transformation history starts here. Book your first visit.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
