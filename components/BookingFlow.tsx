
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, User, Calendar as CalendarIcon, Clock, CheckCircle, ChevronLeft, Sparkles, AlertTriangle, Lock, Ban, Star } from 'lucide-react';
import { SERVICES, BARBERS, TIME_SLOTS } from '../constants';
import { BookingStatus, Service, User as UserType } from '../types';
import { getStyleAdvice } from '../services/geminiService';

interface BookingFlowProps {
  onComplete: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onComplete }) => {
  const { addBooking, currentUser, bookings } = useApp();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<UserType | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleConsultation = async () => {
    if (!selectedService) return;
    setIsAiLoading(true);
    const advice = await getStyleAdvice(`I'm booking a ${selectedService.name}. What should I ask my barber for to get the best result?`);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  const handleBooking = () => {
    if (!selectedService || !selectedBarber || !selectedSlot || !currentUser) return;
    
    const success = addBooking({
      customerId: currentUser.id,
      barberId: selectedBarber.id,
      serviceId: selectedService.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      totalPrice: selectedService.price,
    });

    if (success) {
      setIsSuccess(true);
    } else {
      alert("This slot was just taken! Please choose another.");
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/10">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight font-playfair">Appointment Booked!</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">We've sent a confirmation message to your registered contact.</p>
        <button 
          onClick={onComplete}
          className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition shadow-2xl shadow-indigo-600/30 active:scale-[0.98]"
        >
          View Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`flex-1 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all
              ${step === s ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}
          >
            <span className="hidden sm:inline">Step </span>{s}
          </div>
        ))}
      </div>

      <div className="p-4 sm:p-8">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Scissors className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
              Select Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep(2); }}
                  className={`p-5 sm:p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] active:scale-95
                    ${selectedService?.id === s.id ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 ring-4 ring-indigo-50 dark:ring-indigo-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{s.name}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{s.price}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">{s.description}</p>
                  <div className="flex items-center text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                    <Clock size={12} className="mr-1.5" />
                    {s.durationMinutes} mins
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <User className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
              Choose Barber
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {BARBERS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBarber(b); setStep(3); }}
                  className={`flex flex-col items-center p-4 sm:p-6 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-95
                    ${selectedBarber?.id === b.id ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900'}`}
                >
                  <img src={b.avatar} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 object-cover ring-2 ring-white dark:ring-slate-700 shadow-md" alt={b.name} />
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1">{b.name}</span>
                  <div className="flex items-center text-[10px] text-amber-500 mb-2 font-black">
                    <Star size={10} className="mr-1 fill-amber-500" />
                    {b.rating}
                  </div>
                  <div className="hidden sm:flex flex-wrap gap-1 justify-center">
                    {b.specialties?.slice(0, 2).map(spec => (
                      <span key={spec} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[8px] rounded uppercase font-bold">{spec}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                <CalendarIcon className="mr-2 text-indigo-600 dark:text-indigo-400" size={20} />
                Select Date & Time
              </h2>
              <div className="flex items-center gap-3">
                 <input 
                   type="date" 
                   value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}
                   min={new Date().toISOString().split('T')[0]}
                   className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 font-bold text-sm"
                 />
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
              {TIME_SLOTS.map((slot) => {
                const isTaken = bookings.some(b => 
                  b.barberId === selectedBarber?.id && 
                  b.date === selectedDate && 
                  b.timeSlot === slot &&
                  b.status !== BookingStatus.CANCELLED
                );
                
                const isBarberOff = selectedBarber?.offDays?.includes(selectedDate);
                const isUnavailable = isTaken || isBarberOff;

                return (
                  <button
                    key={slot}
                    disabled={isUnavailable}
                    onClick={() => { setSelectedSlot(slot); setStep(4); }}
                    className={`py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all relative overflow-hidden group border-2 active:scale-95
                      ${isUnavailable 
                        ? 'bg-slate-50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-700 cursor-not-allowed border-slate-100 dark:border-slate-800/50' 
                        : selectedSlot === slot 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20 translate-y-[-2px]' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-indigo-400 hover:translate-y-[-1px]'
                      }`}
                  >
                    <span className={isUnavailable ? 'opacity-30' : ''}>{slot}</span>
                    {isTaken && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 dark:bg-black/20 backdrop-blur-[0.5px]">
                         <Lock size={12} className="text-slate-300 dark:text-slate-700" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-indigo-600 border border-indigo-600"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Lock size={6} className="text-slate-300" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Taken</span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8">Confirm Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <div className="space-y-4">
                  {[
                    { label: 'Service', value: selectedService?.name },
                    { label: 'Barber', value: selectedBarber?.name },
                    { label: 'Date', value: selectedDate },
                    { label: 'Time', value: selectedSlot }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs">Total</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-2xl">₹{selectedService?.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles size={18} />
                    <h4 className="font-bold text-sm">Style Consultation</h4>
                  </div>
                  {aiAdvice ? (
                    <div className="text-xs leading-relaxed whitespace-pre-line opacity-90 mb-4 bg-white/10 p-3 rounded-xl border border-white/10">
                      {aiAdvice}
                    </div>
                  ) : (
                    <p className="text-xs opacity-90 mb-6 font-medium leading-relaxed">
                      Our AI Barber analyzes your service choice to provide professional prep tips.
                    </p>
                  )}
                  <button 
                    onClick={handleConsultation}
                    disabled={isAiLoading}
                    className={`w-full py-2.5 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition active:scale-95 ${isAiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isAiLoading ? 'Consulting Experts...' : (aiAdvice ? 'Regenerate' : 'Ask AI Barber')}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-800 transition transform active:scale-[0.98]"
            >
              Confirm & Book Now
            </button>
          </div>
        )}

        {step > 1 && !isSuccess && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-8 flex items-center text-slate-400 dark:text-slate-600 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition"
          >
            <ChevronLeft size={14} className="mr-1" />
            Back to previous step
          </button>
        )}
      </div>
    </div>
  );
};
