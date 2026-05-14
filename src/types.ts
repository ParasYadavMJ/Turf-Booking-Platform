export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  createdAt: any;
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  sports: string[];
  description: string;
  pricePerHour: number;
  imageUrls: string[];
  amenities: string[];
  rating: number;
  pitchArea?: string;
  originalPrice?: number;
}

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  turfName: string;
  sport: string;
  startTime: any;
  endTime: any;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: any;
}
