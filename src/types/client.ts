export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastPurchase?: Date;
  totalPurchases: number;
  status: "active" | "inactive";
}

export interface ClientPurchase {
  id: string;
  clientId: string;
  date: Date;
  value: number;
  products: string[];
  status: "completed" | "pending" | "cancelled";
}
