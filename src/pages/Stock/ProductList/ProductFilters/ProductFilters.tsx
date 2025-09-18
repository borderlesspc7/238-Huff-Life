import React, { useState, useEffect } from "react";
import { FiX, FiFilter } from "react-icons/fi";
import type { StockFilters } from "../../../../types/stock";
import { stockService } from "../../../../services/stockService";
import "./ProductFilters.css";

interface ProductFiltersProps {
  filters: StockFilters;
  onFiltersChange: (filters: StockFilters) => void;
  onClose: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<StockFilters>(filters);
  const [categories, setCategories] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    setLoading(true);
    try {
      const [categoriesData, unitsData] = await Promise.all([
        stockService.getCategories(),
        Promise.resolve(stockService.getUnits()),
      ]);
      setCategories(categoriesData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Erro ao carregar opções de filtro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof StockFilters,
    value: string | boolean | undefined
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: StockFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== undefined && value !== "" && value !== false
  );

  return (
    <div className="product-filters">
      <div className="filters-header">
        <div className="filters-title">
          <FiFilter />
          <h3>Filtros</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>
      </div>

      <div className="filters-content">
        <div className="filter-group">
          <label className="filter-label">Unidade</label>
          <select
            value={localFilters.unit || ""}
            onChange={(e) =>
              handleFilterChange("unit", e.target.value || undefined)
            }
            className="filter-select"
          >
            <option value="">Todas as unidades</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Categoria</label>
          <select
            value={localFilters.category || ""}
            onChange={(e) =>
              handleFilterChange("category", e.target.value || undefined)
            }
            className="filter-select"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Número do Lote</label>
          <input
            type="text"
            value={localFilters.batchNumber || ""}
            onChange={(e) =>
              handleFilterChange("batchNumber", e.target.value || undefined)
            }
            placeholder="Digite o número do lote"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={localFilters.lowStock || false}
              onChange={(e) => handleFilterChange("lowStock", e.target.checked)}
            />
            <span className="checkmark"></span>
            Estoque baixo
          </label>
        </div>

        <div className="filter-group">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={localFilters.expiringSoon || false}
              onChange={(e) =>
                handleFilterChange("expiringSoon", e.target.checked)
              }
            />
            <span className="checkmark"></span>
            Próximos do vencimento
          </label>
        </div>
      </div>

      <div className="filters-footer">
        <button
          className="btn btn-secondary"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          Limpar Filtros
        </button>
        <button
          className="btn btn-primary"
          onClick={handleApplyFilters}
          disabled={loading}
        >
          {loading ? "Aplicando..." : "Aplicar Filtros"}
        </button>
      </div>
    </div>
  );
};
