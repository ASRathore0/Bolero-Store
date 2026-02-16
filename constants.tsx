
import React from 'react';
import { Scissors, Zap, Wind, User, Droplets, LucideIcon } from 'lucide-react';
import { UserRole, Service, User as UserType } from './types';

export const ICON_MAP: Record<string, LucideIcon> = {
  Scissors,
  Zap,
  Wind,
  User,
  Droplets
};

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Classic Haircut',
    description: 'A precision cut tailored to your face shape and style.',
    price: 35,
    durationMinutes: 45,
    icon: 'Scissors'
  },
  {
    id: 's2',
    name: 'Beard Sculpting',
    description: 'Expert beard trimming and shaping with hot towel finish.',
    price: 25,
    durationMinutes: 30,
    icon: 'Zap'
  },
  {
    id: 's3',
    name: 'The Royal Shave',
    description: 'Traditional straight razor shave with premium oils.',
    price: 45,
    durationMinutes: 60,
    icon: 'Droplets'
  },
  {
    id: 's4',
    name: 'Full Grooming',
    description: 'Haircut, beard sculpt, and mini-facial combo.',
    price: 75,
    durationMinutes: 90,
    icon: 'User'
  }
];

export const BARBERS: UserType[] = [
  {
    id: 'b1',
    name: 'Marco Rossi',
    email: 'marco@yoursbeauty.com',
    role: UserRole.BARBER,
    avatar: 'https://picsum.photos/seed/marco/200',
    rating: 4.9,
    specialties: ['Classic Fades', 'Scissor Cuts'],
    earnings: 2450
  },
  {
    id: 'b2',
    name: 'Sasha Vance',
    email: 'sasha@yoursbeauty.com',
    role: UserRole.BARBER,
    avatar: 'https://picsum.photos/seed/sasha/200',
    rating: 4.8,
    specialties: ['Modern Styles', 'Beard Art'],
    earnings: 1980
  },
  {
    id: 'b3',
    name: 'James Dean',
    email: 'james@yoursbeauty.com',
    role: UserRole.BARBER,
    avatar: 'https://picsum.photos/seed/james/200',
    rating: 4.7,
    specialties: ['Straight Razor', 'Skin Fades'],
    earnings: 2100
  }
];

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM'
];
