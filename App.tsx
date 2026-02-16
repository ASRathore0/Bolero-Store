
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Layout } from './components/Layout.tsx';
import { UserRole } from './types.ts';
import { LandingPage } from './pages/LandingPage.tsx';
import { CustomerDashboard } from './pages/CustomerDashboard.tsx';
import { BarberDashboard } from './pages/BarberDashboard.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { BookingFlow } from './components/BookingFlow.tsx';

const Main: React.FC = () => {
  const { currentUser } = useApp();
  const [view, setView] = useState<'home' | 'booking'>('home');

  if (!currentUser) {
    if (view === 'booking') {
      return (
        <Layout>
          <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Please login to book</h1>
                <p className="text-slate-500 dark:text-slate-400">You must be logged in as a customer to schedule an appointment.</p>
              </div>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setView('home')}
                  className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </Layout>
      );
    }
    return <Layout><LandingPage onBookNow={() => setView('booking')} /></Layout>;
  }

  // Dashboard views based on role
  return (
    <Layout>
      {currentUser.role === UserRole.CUSTOMER && (
        <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
          {view === 'booking' ? (
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tighter font-playfair">Book Your Session</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Complete the four steps below to secure your spot with one of our master barbers.</p>
              </div>
              <BookingFlow onComplete={() => setView('home')} />
              <div className="mt-12 text-center">
                <button onClick={() => setView('home')} className="text-slate-400 dark:text-slate-600 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition underline underline-offset-4 decoration-2">Return to my dashboard</button>
              </div>
            </div>
          ) : (
            <>
              <CustomerDashboard onBookNew={() => setView('booking')} />
              <div className="fixed bottom-8 right-8 animate-bounce z-40">
                <button 
                  onClick={() => setView('booking')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition"
                >
                  Book Now
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {currentUser.role === UserRole.BARBER && <BarberDashboard />}
      {currentUser.role === UserRole.ADMIN && <AdminDashboard />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
};

export default App;
