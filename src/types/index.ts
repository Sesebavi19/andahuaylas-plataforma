export enum PlaceCategory {
  TURISMO = 'turismo',
  GASTRONOMIA = 'gastronomia',
  COMERCIO = 'comercio',
  HOSPEDAJE = 'hospedaje',
}

export enum PlaceStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  subcategory?: string;
  district: string;
  address?: string;
  phone?: string;
  website?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  gallery?: string[];
  hours?: string;
  priceRange?: string;
  tags?: string[];
  status: PlaceStatus;
  createdAt: string;
}

export interface Stats {
  totalPlaces: number;
  weeklyVisits: string;
  availability: string;
  pendingItems: number;
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}
