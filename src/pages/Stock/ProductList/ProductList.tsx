import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiPackage,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";
import type { Product, StockFilters } from "../../../types/stock";
import { stockService } from "../../../services/stockService";
import { ProductCard } from "./ProductCard/ProductCard";
import { ProductFilters } from "./ProductFilters/ProductFilters";
import "./ProductList.css";

interface ProductListProps {
  products: Product[];
  onRefresh: () => void;
  onAddMovement: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onRefresh,
  onAddMovement,
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState<StockFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setLoading(true);

    try {
      const searchFilters = { ...filters, search: term };
      const results = await stockService.getProducts(searchFilters);
      setFilteredProducts(results);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters: StockFilters) => {
    setFilters(newFilters);
    setLoading(true);

    try {
      const searchFilters = { ...newFilters, search: searchTerm };
      const results = await stockService.getProducts(searchFilters);
      setFilteredProducts(results);
    } catch (error) {
      console.error("Erro ao filtrar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await stockService.deleteProduct(productId);
        onRefresh();
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto");
      }
    }
  };

  const getLowStockCount = () => {
    return products.filter((p) => p.totalQuantity < 50).length;
  };

  const getExpiringSoonCount = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return products.filter((p) =>
      p.batches.some((batch) => batch.expirationDate <= thirtyDaysFromNow)
    ).length;
  };

  return (
    <div className="product-list">
      <div className="list-header">
        <div className="header-info">
          <h2>Produtos em Estoque</h2>
          <div className="product-count">
            {filteredProducts.length} de {products.length} produtos
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            Filtros
          </button>

          <button className="btn btn-primary" onClick={onAddMovement}>
            <FiPlus />
            Movimentação
          </button>
        </div>
      </div>

      {showFilters && (
        <ProductFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div className="search-section">
        <div className="search-input-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="quick-filters">
          <button
            className={`quick-filter ${filters.lowStock ? "active" : ""}`}
            onClick={() =>
              handleFiltersChange({ ...filters, lowStock: !filters.lowStock })
            }
          >
            <FiAlertTriangle />
            Estoque Baixo ({getLowStockCount()})
          </button>

          <button
            className={`quick-filter ${filters.expiringSoon ? "active" : ""}`}
            onClick={() =>
              handleFiltersChange({
                ...filters,
                expiringSoon: !filters.expiringSoon,
              })
            }
          >
            <FiClock />
            Próximos do Vencimento ({getExpiringSoonCount()})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <FiPackage className="empty-icon" />
          <h3>Nenhum produto encontrado</h3>
          <p>
            {searchTerm || Object.keys(filters).length > 0
              ? "Tente ajustar os filtros de busca"
              : "Comece adicionando seu primeiro produto"}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleProductDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
