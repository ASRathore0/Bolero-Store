
import React from 'react';
import { Scissors, Star, ArrowRight, Settings, Sparkles, ShieldCheck, MapPin, Phone, Instagram } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ICON_MAP } from '../constants';
import { UserRole } from '../types';

export const LandingPage: React.FC<{ onBookNow: () => void }> = ({ onBookNow }) => {
  const { barbers, services, currentUser, gallery } = useApp();

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section - High Impact & Centered */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2074" 
            className="w-full h-full object-cover brightness-[0.3]"
            alt="Yours Beauty Experience" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" />
              The Art of Grooming
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-10 leading-[1.1] tracking-tight font-playfair">
              Elevate Your <span className="text-indigo-500 italic">Signature</span> Style
            </h1>
            
            <p className="text-slate-300 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed opacity-90">
              Modern precision meets classic comfort in the city's most exclusive artisan grooming studio.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onBookNow}
                className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-indigo-700 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center group active:scale-95"
              >
                BOOK YOUR CUT
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
              </button>
              
              <button 
                onClick={scrollToServices}
                className="w-full sm:w-auto px-10 py-6 bg-white/5 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/15 transition-all active:scale-95"
              >
                VIEW SERVICES
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden sm:block">
          <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent rounded-full"></div>
        </div>
      </section>

      {/* Philosophy Section - Modern Minimalist */}
      <section className="py-24 sm:py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 text-center">
            {[
              { icon: ShieldCheck, title: "Artisan Expertise", desc: "Every barber is a master of their craft with years of precision training." },
              { icon: Star, title: "Premium Products", desc: "We exclusively use organic, high-end grooming essentials for your skin & hair." },
              { icon: Sparkles, title: "Luxury Atmosphere", desc: "Our studio is designed for relaxation with marble accents and halo lighting." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Redesigned to match Screenshot */}
      <section className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-300" id="services">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 sm:mb-24">
            <h2 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight font-playfair">Signature Menu</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full mb-8"></div>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Tailored grooming experiences designed for the modern gentleman.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {services.map((service) => {
              const ServiceIcon = ICON_MAP[service.icon] || Scissors;
              return (
                <div key={service.id} className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group flex flex-col h-full min-h-[380px]">
                  <div className="w-16 h-16 bg-slate-950 text-indigo-400 rounded-2xl flex items-center justify-center mb-10 shadow-lg">
                    <ServiceIcon size={32} />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight font-playfair">{service.name}</h3>
                  <p className="text-slate-500 dark:text-slate-300 mb-auto text-base sm:text-lg leading-relaxed font-medium">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center pt-10 border-t border-slate-100 dark:border-slate-700/50 mt-10">
                    <span className="text-indigo-400 font-bold text-4xl font-playfair tracking-tight">₹{service.price}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{service.durationMinutes} MIN</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Luxury Gallery Section - Staggered Grid */}
      <section className="py-24 sm:py-32 bg-white dark:bg-slate-950 transition-colors duration-300" id="gallery">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 sm:mb-24 gap-8">
            <div className="text-left">
              <h2 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight font-playfair">The Studio</h2>
              <div className="w-20 h-1.5 bg-indigo-600 rounded-full mb-8"></div>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                Step into a realm of luxury where premium marble finishes and signature lighting set the stage for your transformation.
              </p>
            </div>
            <button 
              onClick={onBookNow}
              className="px-8 py-4 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95"
            >
              Start Experience
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.map((img, idx) => (
              <div key={idx} className={`relative group overflow-hidden rounded-[2rem] shadow-2xl transition-all hover:scale-[1.03] active:scale-95 ${idx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <img src={img} className="w-full h-full object-cover aspect-video sm:aspect-auto sm:h-full min-h-[350px]" alt={`Studio view ${idx + 1}`} />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                   <div className="text-center p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Our Workspace</p>
                      <h4 className="text-2xl font-bold text-white font-playfair">Premium Design</h4>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Artisan Display */}
      <section className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 sm:mb-24">
            <h2 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight font-playfair">Master Artisans</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full mb-8"></div>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Meet the specialists behind the chair. Crafting excellence with every cut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {barbers.map((barber) => (
              <div key={barber.id} className="group text-center">
                <div className="relative mb-8 rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl border-4 border-white dark:border-slate-800 transition-all group-hover:border-indigo-600 group-hover:shadow-indigo-500/20">
                  <img src={barber.avatar} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt={barber.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-10 left-0 right-0 px-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white tracking-tight font-playfair mb-2">{barber.name}</h3>
                    <div className="flex justify-center items-center gap-1.5">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-white text-xs font-black">{barber.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4">
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {barber.specialties?.slice(0, 2).map(spec => (
                      <span key={spec} className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 group-hover:text-indigo-500 transition-colors rounded-full">{spec}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Sophisticated Closure */}
      <section className="py-24 sm:py-40 bg-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-10 tracking-tight font-playfair">Ready for Your Transformation?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-xl mx-auto font-medium">
            Slots are highly limited. Secure your preferred time with an artisan today.
          </p>
          <button 
            onClick={onBookNow}
            className="px-16 py-8 bg-white text-indigo-600 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-slate-50 hover:shadow-2xl transition-all active:scale-95 shadow-xl"
          >
            BOOK NOW
          </button>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/20 pt-16">
            <div className="flex items-center justify-center gap-3 text-white/90 font-bold text-sm">
              <MapPin size={20} className="text-white/60" /> Sareen Farm, Police Line, EcoTech-lll Greater Noida.
            </div>
            <div className="flex items-center justify-center gap-3 text-white/90 font-bold text-sm">
              <Phone size={20} className="text-white/60" /> +91 7837861533
            </div>
            <div className="flex items-center justify-center gap-3 text-white/90 font-bold text-sm cursor-pointer hover:text-white">
              <Instagram size={20} className="text-white/60" /> @YoursBeautySaloon
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
