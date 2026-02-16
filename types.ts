
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  BARBER = 'BARBER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  rating?: number;
  specialties?: string[];
  earnings?: number;
  offDays?: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  icon: string;
}

export interface Booking {
  id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  rating?: number; // Customer rating (1-5)
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}
