export enum DeedStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  INVALID = 'INVALID'
}

export interface Reward {
  id: string;
  type: 'LETTER' | 'VOUCHER';
  title: string;
  issuedDate: string;
  description: string;
  code?: string;
}

export interface Deed {
  id: string;
  imageUrl: string;
  description: string;
  location: string;
  timestamp: string;
  status: DeedStatus;
  pointsAwarded: number;
  aiClassification?: string;
}

export interface CivicEvent {
  id: string;
  occasion: string;
  durationDays: number;
  multiplier: number;
  postedAt: string; // ISO string
  isActive: boolean;
}

export interface UserState {
  points: number;
  deeds: Deed[];
  rewards: Reward[];
}

export type AppView = 'USER' | 'NGO' | 'FORM' | 'HISTORY' | 'CERTIFICATE' | 'SETTINGS' | 'DEED_CATEGORIES';