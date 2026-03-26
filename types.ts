
export enum WasteCategory {
  PLASTIC = 'Plastic',
  PAPER = 'Paper',
  GLASS = 'Glass',
  METAL = 'Metal',
  ORGANIC = 'Organic',
  ELECTRONIC = 'Electronic',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  email: string;
  ecoScore: number;
  badges: string[];
  scanCount: number;
}

export interface Recycler {
  id: string;
  name: string;
  distance: string;
  acceptedTypes: WasteCategory[];
  hours: string;
  phone: string;
  rating: number;
  lat: number;
  lng: number;
  address: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  itemName: string;
  category: WasteCategory;
  isRecyclable: boolean;
  instructions: string;
  impactInfo: string;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
