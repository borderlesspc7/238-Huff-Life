import type {
  Product,
  ProductBatch,
  StockMovement,
  StockAlert,
  StockFilters,
  StockStats,
} from "../types/stock";

// Mock data - em produção, isso seria substituído por chamadas para API
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Arroz Integral",
    unit: "kg",
    totalQuantity: 150,
    batches: [
      {
        id: "1-1",
        productId: "1",
        batchNumber: "LOT001",
        quantity: 100,
        expirationDate: new Date("2024-12-31"),
        purchasePrice: 4.5,
        salePrice: 6.0,
        supplier: "Fornecedor A",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "1-2",
        productId: "1",
        batchNumber: "LOT002",
        quantity: 50,
        expirationDate: new Date("2025-03-15"),
        purchasePrice: 4.3,
        salePrice: 6.0,
        supplier: "Fornecedor B",
        createdAt: new Date("2024-02-10"),
      },
    ],
    category: "Grãos",
    description: "Arroz integral orgânico",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "2",
    name: "Leite Desnatado",
    unit: "litro",
    totalQuantity: 80,
    batches: [
      {
        id: "2-1",
        productId: "2",
        batchNumber: "LOT003",
        quantity: 80,
        expirationDate: new Date("2024-11-20"),
        purchasePrice: 3.2,
        salePrice: 4.5,
        supplier: "Laticínios XYZ",
        createdAt: new Date("2024-01-20"),
      },
    ],
    category: "Laticínios",
    description: "Leite desnatado UHT",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
];

const mockMovements: StockMovement[] = [];
const mockAlerts: StockAlert[] = [];

class StockService {
  // Produtos
  async getProducts(filters?: StockFilters): Promise<Product[]> {
    let filteredProducts = [...mockProducts];

    if (filters) {
      if (filters.unit) {
        filteredProducts = filteredProducts.filter(
          (p) => p.unit === filters.unit
        );
      }

      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === filters.category
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.lowStock) {
        filteredProducts = filteredProducts.filter((p) => p.totalQuantity < 50);
      }

      if (filters.expiringSoon) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        filteredProducts = filteredProducts.filter((p) =>
          p.batches.some((batch) => batch.expirationDate <= thirtyDaysFromNow)
        );
      }
    }

    return filteredProducts;
  }

  async getProductById(id: string): Promise<Product | null> {
    return mockProducts.find((p) => p.id === id) || null;
  }

  async createProduct(
    productData: Omit<
      Product,
      "id" | "createdAt" | "updatedAt" | "totalQuantity" | "batches"
    >
  ): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      totalQuantity: 0,
      batches: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProducts.push(newProduct);
    return newProduct;
  }

  async updateProduct(
    id: string,
    updates: Partial<Product>
  ): Promise<Product | null> {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    mockProducts[index] = {
      ...mockProducts[index],
      ...updates,
      updatedAt: new Date(),
    };

    return mockProducts[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    mockProducts.splice(index, 1);
    return true;
  }

  // Lotes
  async addBatch(
    productId: string,
    batchData: Omit<ProductBatch, "id" | "productId" | "createdAt">
  ): Promise<ProductBatch> {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) throw new Error("Produto não encontrado");

    const newBatch: ProductBatch = {
      ...batchData,
      id: `${productId}-${Date.now()}`,
      productId,
      createdAt: new Date(),
    };

    product.batches.push(newBatch);
    product.totalQuantity += newBatch.quantity;
    product.updatedAt = new Date();

    return newBatch;
  }

  async updateBatch(
    productId: string,
    batchId: string,
    updates: Partial<ProductBatch>
  ): Promise<ProductBatch | null> {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return null;

    const batchIndex = product.batches.findIndex((b) => b.id === batchId);
    if (batchIndex === -1) return null;

    const oldQuantity = product.batches[batchIndex].quantity;
    product.batches[batchIndex] = {
      ...product.batches[batchIndex],
      ...updates,
    };
    const newQuantity = product.batches[batchIndex].quantity;

    product.totalQuantity = product.totalQuantity - oldQuantity + newQuantity;
    product.updatedAt = new Date();

    return product.batches[batchIndex];
  }

  // Movimentações
  async createMovement(
    movementData: Omit<StockMovement, "id" | "createdAt">
  ): Promise<StockMovement> {
    const newMovement: StockMovement = {
      ...movementData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    // Atualizar quantidade do lote
    const product = mockProducts.find((p) => p.id === movementData.productId);
    if (product) {
      const batch = product.batches.find((b) => b.id === movementData.batchId);
      if (batch) {
        if (movementData.type === "entrada") {
          batch.quantity += movementData.quantity;
        } else {
          batch.quantity -= movementData.quantity;
        }

        // Recalcular quantidade total do produto
        product.totalQuantity = product.batches.reduce(
          (sum, b) => sum + b.quantity,
          0
        );
        product.updatedAt = new Date();
      }
    }

    mockMovements.push(newMovement);
    return newMovement;
  }

  async getMovements(productId?: string): Promise<StockMovement[]> {
    if (productId) {
      return mockMovements.filter((m) => m.productId === productId);
    }
    return [...mockMovements];
  }

  // Alertas
  async getAlerts(): Promise<StockAlert[]> {
    const alerts: StockAlert[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    for (const product of mockProducts) {
      for (const batch of product.batches) {
        // Estoque baixo
        if (batch.quantity < 20) {
          alerts.push({
            id: `low-${batch.id}`,
            productId: product.id,
            batchId: batch.id,
            type: "low_stock",
            message: `${product.name} (Lote ${batch.batchNumber}) está com estoque baixo: ${batch.quantity} unidades`,
            severity: batch.quantity < 10 ? "high" : "medium",
            isRead: false,
            createdAt: new Date(),
          });
        }

        // Próximo do vencimento
        if (
          batch.expirationDate <= thirtyDaysFromNow &&
          batch.expirationDate > now
        ) {
          alerts.push({
            id: `expiring-${batch.id}`,
            productId: product.id,
            batchId: batch.id,
            type: "expiring_soon",
            message: `${product.name} (Lote ${
              batch.batchNumber
            }) vence em ${Math.ceil(
              (batch.expirationDate.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            )} dias`,
            severity:
              batch.expirationDate <=
              new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                ? "high"
                : "medium",
            isRead: false,
            createdAt: new Date(),
          });
        }

        // Vencido
        if (batch.expirationDate <= now) {
          alerts.push({
            id: `expired-${batch.id}`,
            productId: product.id,
            batchId: batch.id,
            type: "expired",
            message: `${product.name} (Lote ${
              batch.batchNumber
            }) está vencido desde ${batch.expirationDate.toLocaleDateString()}`,
            severity: "high",
            isRead: false,
            createdAt: new Date(),
          });
        }
      }
    }

    return alerts;
  }

  async markAlertAsRead(alertId: string): Promise<boolean> {
    const alert = mockAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      return true;
    }
    return false;
  }

  // Estatísticas
  async getStockStats(): Promise<StockStats> {
    const products = await this.getProducts();
    const alerts = await this.getAlerts();

    const totalValue = products.reduce((sum, product) => {
      return (
        sum +
        product.batches.reduce((batchSum, batch) => {
          return batchSum + batch.quantity * (batch.purchasePrice || 0);
        }, 0)
      );
    }, 0);

    return {
      totalProducts: products.length,
      totalValue,
      lowStockCount: alerts.filter((a) => a.type === "low_stock").length,
      expiringSoonCount: alerts.filter((a) => a.type === "expiring_soon")
        .length,
      expiredCount: alerts.filter((a) => a.type === "expired").length,
    };
  }

  // Categorias
  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    mockProducts.forEach((product) => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories);
  }

  // Unidades
  getUnits(): string[] {
    return ["unidade", "kg", "litro", "metro", "caixa", "pacote"];
  }
}

export const stockService = new StockService();
