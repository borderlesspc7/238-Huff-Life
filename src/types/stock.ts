export interface Product {
  id: string;
  name: string;
  unit: "unidade" | "kg" | "litro" | "metro" | "caixa" | "pacote";
  totalQuantity: number;
  batches: ProductBatch[];
  category?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: Date;
  purchasePrice?: number;
  salePrice?: number;
  supplier?: string;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  batchId: string;
  type: "entrada" | "saida";
  quantity: number;
  reason: string;
  userId: string;
  createdAt: Date;
  notes?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  batchId: string;
  type: "low_stock" | "expiring_soon" | "expired";
  message: string;
  severity: "low" | "medium" | "high";
  isRead: boolean;
  createdAt: Date;
}

export interface StockFilters {
  unit?: string;
  batchNumber?: string;
  category?: string;
  lowStock?: boolean;
  expiringSoon?: boolean;
  search?: string;
}

export interface StockStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  expiringSoonCount: number;
  expiredCount: number;
}
