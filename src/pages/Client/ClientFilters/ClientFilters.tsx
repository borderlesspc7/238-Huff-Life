import React from "react";
import { Button } from "../../../components/ui/Button/Button";
import { Input } from "../../../components/ui/Input/Input";
import { FiSearch, FiFilter, FiX, FiCalendar, FiUser } from "react-icons/fi";
import "./ClientFilters.css";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: "all" | "active" | "inactive") => void;
  periodFilter: string;
  onPeriodChange: (value: "all" | "7days" | "30days" | "90days") => void;
  onClearFilters: () => void;
  onAddClient: () => void;
  totalClients: number;
  filteredClients: number;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  periodFilter,
  onPeriodChange,
  onClearFilters,
  totalClients,
  filteredClients,
}) => {
  const hasActiveFilters =
    searchTerm || statusFilter !== "all" || periodFilter !== "all";

  return (
    <div className="client-filters">
      <div className="filters-header">
        <div className="filters-header-icon">
          <FiFilter size={16} />
        </div>
        <h3>Filtros</h3>
        <div className="results-info">
          <span>
            {filteredClients} de {totalClients} clientes
          </span>
        </div>
      </div>
      <div className="filters-content">
        <div className="filter-group">
          <label className="filter-label">
            <FiSearch size={16} />
            Buscar
          </label>
          <Input
            type="text"
            placeholder="Nome, email ou telefone..."
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <FiUser size={16} />
            Status
          </label>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as "all" | "active" | "inactive")
            }
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <FiCalendar size={16} />
            Período
          </label>
          <select
            className="filter-select"
            value={periodFilter}
            onChange={(e) =>
              onPeriodChange(
                e.target.value as "all" | "7days" | "30days" | "90days"
              )
            }
          >
            <option value="all">Todos</option>
            <option value="last-month">Ultimo mês</option>
            <option value="last-quarter">Ultimo trimestre</option>
            <option value="last-year">Ultimo ano</option>
          </select>
        </div>

        <div className="filter-actions">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="clear-btn"
            >
              <FiX size={16} />
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
