
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Booking, BookingStatus, Service } from '../types';
import { BARBERS, SERVICES } from '../constants';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  currentUser: User | null;
  bookings: Booking[];
  barbers: User[];
  services: Service[];
  notifications: Notification[];
  gallery: string[];
  theme: 'light' | 'dark';
  login: (role: UserRole) => void;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => boolean;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  addNotification: (userId: string, message: string, type: Notification['type']) => void;
  markNotificationsAsRead: () => void;
  toggleTheme: () => void;
  toggleBarberDayOff: (barberId: string, date: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  deleteService: (id: string) => void;
  addBarber: (barber: Omit<User, 'id' | 'role' | 'earnings' | 'rating'>) => void;
  deleteBarber: (id: string) => void;
  addToGallery: (url: string) => void;
  removeFromGallery: (index: number) => void;
  updateProfile: (updates: Partial<User>) => void;
  rateBarber: (bookingId: string, rating: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_BARBERS = 'barberflow_barbers_v1';
const STORAGE_KEY_SERVICES = 'barberflow_services_v1';
const STORAGE_KEY_GALLERY = 'barberflow_gallery_v1';
const STORAGE_KEY_BOOKINGS = 'barberflow_bookings_v1';

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=1000'
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [barbers, setBarbers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_BARBERS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse barbers from storage", e);
        }
      }
    }
    return BARBERS.map(b => ({ ...b, offDays: b.offDays || [] }));
  });
  
  const [services, setServices] = useState<Service[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse services from storage", e);
        }
      }
    }
    return SERVICES;
  });

  const [gallery, setGallery] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
      if (saved) return JSON.parse(saved);
    }
    return DEFAULT_GALLERY;
  });
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 
             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BARBERS, JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (role: UserRole) => {
    let mockUser: User;
    if (role === UserRole.BARBER) {
      const b = barbers[0] || BARBERS[0];
      mockUser = { ...b, role: UserRole.BARBER };
    } else if (role === UserRole.ADMIN) {
      mockUser = {
        id: 'admin-1',
        name: 'Salon Owner',
        email: 'admin@yoursbeauty.com',
        role: UserRole.ADMIN,
        avatar: 'https://picsum.photos/seed/admin/200'
      };
    } else {
      mockUser = {
        id: 'u1',
        name: 'Alex Customer',
        email: 'alex@example.com',
        role: UserRole.CUSTOMER,
        avatar: 'https://picsum.photos/seed/customer/200'
      };
    }
    setCurrentUser(mockUser);
  };

  const logout = () => setCurrentUser(null);

  const addNotification = (userId: string, message: string, type: Notification['type'] = 'info') => {
    const newNote: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleBarberDayOff = (barberId: string, date: string) => {
    let updatedUser: User | null = null;
    
    setBarbers(prev => prev.map(b => {
      if (b.id === barberId) {
        const offDays = b.offDays || [];
        const newOffDays = offDays.includes(date) 
          ? offDays.filter(d => d !== date)
          : [...offDays, date];
        const updated = { ...b, offDays: newOffDays };
        if (currentUser && currentUser.id === barberId) {
          updatedUser = updated;
        }
        return updated;
      }
      return b;
    }));

    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
  };

  const addBooking = (newBooking: Omit<Booking, 'id' | 'createdAt' | 'status'>): boolean => {
    const barber = barbers.find(b => b.id === newBooking.barberId);
    if (barber?.offDays?.includes(newBooking.date)) return false;

    const isTaken = bookings.some(b => 
      b.barberId === newBooking.barberId && 
      b.date === newBooking.date && 
      b.timeSlot === newBooking.timeSlot &&
      b.status !== BookingStatus.CANCELLED
    );

    if (isTaken) return false;

    const booking: Booking = {
      ...newBooking,
      id: `bk-${Math.random().toString(36).substr(2, 9)}`,
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [...prev, booking]);
    addNotification('admin-1', `New booking for ${newBooking.date} at ${newBooking.timeSlot}`, 'info');
    return true;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    
    if (status === BookingStatus.CONFIRMED) {
      addNotification(booking.customerId, `Your booking for ${booking.timeSlot} on ${booking.date} is CONFIRMED!`, 'success');
    }
  };

  const rateBarber = (bookingId: string, rating: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== BookingStatus.COMPLETED) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, rating } : b));

    // Update barber average rating
    setBarbers(prev => prev.map(barber => {
      if (barber.id === booking.barberId) {
        const barberBookings = bookings.filter(b => b.barberId === barber.id && b.rating);
        const allRatings = [...barberBookings.map(b => b.rating!), rating];
        const newAvg = allRatings.reduce((acc, curr) => acc + curr, 0) / allRatings.length;
        return { ...barber, rating: Number(newAvg.toFixed(1)) };
      }
      return barber;
    }));
  };

  const addService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: `s-${Math.random().toString(36).substr(2, 9)}`,
    };
    setServices(prev => [...prev, service]);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addBarber = (newBarber: Omit<User, 'id' | 'role' | 'earnings' | 'rating'>) => {
    const barber: User = {
      ...newBarber,
      id: `b-${Math.random().toString(36).substr(2, 9)}`,
      role: UserRole.BARBER,
      earnings: 0,
      rating: 5.0,
      offDays: []
    };
    setBarbers(prev => [...prev, barber]);
  };

  const deleteBarber = (id: string) => {
    setBarbers(prev => prev.filter(b => b.id !== id));
  };

  const addToGallery = (url: string) => {
    setGallery(prev => [...prev, url]);
  };

  const removeFromGallery = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    // Also update in barbers list if it's a barber
    if (currentUser.role === UserRole.BARBER) {
      setBarbers(prev => prev.map(b => b.id === currentUser.id ? updatedUser : b));
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      bookings,
      barbers,
      services,
      notifications,
      gallery,
      theme,
      login,
      logout,
      addBooking,
      updateBookingStatus,
      addNotification,
      markNotificationsAsRead,
      toggleTheme,
      toggleBarberDayOff,
      addService,
      deleteService,
      addBarber,
      deleteBarber,
      addToGallery,
      removeFromGallery,
      updateProfile,
      rateBarber
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
