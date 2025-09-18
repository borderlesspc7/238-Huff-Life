import React from "react";
import {
  FiPackage,
  FiAlertTriangle,
  FiClock,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import type { StockStats as StockStatsType } from "../../../types/stock";
import "./StockStats.css";

interface StockStatsProps {
  stats: StockStatsType;
  onRefresh: () => void;
  refreshing: boolean;
}

export const StockStats: React.FC<StockStatsProps> = ({
  stats,
  onRefresh,
  refreshing,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="stock-stats">
      <div className="stats-header">
        <h2>Resumo do Estoque</h2>
        <button
          className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
          onClick={onRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw />
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Total de Produtos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon value">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
            <div className="stat-label">Valor Total</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.lowStockCount}</div>
            <div className="stat-label">Estoque Baixo</div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.expiringSoonCount}</div>
            <div className="stat-label">Próximos do Vencimento</div>
          </div>
        </div>

        <div className="stat-card critical">
          <div className="stat-icon">
            <FiX />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.expiredCount}</div>
            <div className="stat-label">Vencidos</div>
          </div>
        </div>
      </div>
    </div>
  );
};
