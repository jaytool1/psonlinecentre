import { Timestamp } from 'firebase/firestore';

export interface Service {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category?: string;
  description?: string;
}

export interface Application {
  id: string;
  serviceName: string;
  userName: string;
  userPhone: string;
  documentUrl: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: Timestamp | Date;
}

export interface Admin {
  email: string;
  role: 'admin';
}
