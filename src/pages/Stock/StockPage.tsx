import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiPlus,
  FiAlertTriangle,
  FiTrendingUp,
} from "react-icons/fi";
import type { Product, StockStats, StockAlert } from "../../types/stock";
import { stockService } from "../../services/stockService";
import { ProductList } from "./ProductList/ProductList";
import { ProductForm } from "./ProductForm/ProductForm";
import { MovementForm } from "./MovementForm/MovementForm";
import { StockAlerts } from "./StockAlerts/StockAlerts";
import { StockStats as StockStatsComponent } from "./StockStats/StockStats";
import { Layout } from "../../components/layout";
import "./StockPage.css";

type ViewMode = "list" | "add-product" | "add-movement" | "alerts";

export const StockPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<StockStats | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, statsData, alertsData] = await Promise.all([
        stockService.getProducts(),
        stockService.getStockStats(),
        stockService.getAlerts(),
      ]);

      setProducts(productsData);
      setStats(statsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error("Erro ao carregar dados do estoque:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductCreated = () => {
    refreshData();
    setViewMode("list");
  };

  const handleMovementCreated = () => {
    refreshData();
    setViewMode("list");
  };

  const handleAlertRead = async (alertId: string) => {
    await stockService.markAlertAsRead(alertId);
    refreshData();
  };

  if (loading) {
    return (
      <div className="stock-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="stock-page">
        <div className="stock-header">
          <div className="header-title">
            <FiPackage className="header-icon" />
            <h1>Gestão de Estoque</h1>
          </div>

          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setViewMode("alerts")}
              title="Ver alertas"
            >
              <FiAlertTriangle />
              {alerts.filter((a) => !a.isRead).length > 0 && (
                <span className="alert-badge">
                  {alerts.filter((a) => !a.isRead).length}
                </span>
              )}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setViewMode("add-product")}
            >
              <FiPlus />
              Novo Produto
            </button>
          </div>
        </div>

        {stats && (
          <StockStatsComponent
            stats={stats}
            onRefresh={refreshData}
            refreshing={refreshing}
          />
        )}

        <div className="stock-content">
          <div className="content-sidebar">
            <div className="sidebar-section">
              <h3>Navegação</h3>
              <nav className="sidebar-nav">
                <button
                  className={`nav-item ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <FiPackage />
                  Lista de Produtos
                </button>

                <button
                  className={`nav-item ${
                    viewMode === "add-product" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("add-product")}
                >
                  <FiPlus />
                  Cadastrar Produto
                </button>

                <button
                  className={`nav-item ${
                    viewMode === "add-movement" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("add-movement")}
                >
                  <FiTrendingUp />
                  Movimentação
                </button>

                <button
                  className={`nav-item ${
                    viewMode === "alerts" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("alerts")}
                >
                  <FiAlertTriangle />
                  Alertas
                  {alerts.filter((a) => !a.isRead).length > 0 && (
                    <span className="nav-badge">
                      {alerts.filter((a) => !a.isRead).length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          <div className="content-main">
            {viewMode === "list" && (
              <ProductList
                products={products}
                onRefresh={refreshData}
                onAddMovement={() => setViewMode("add-movement")}
              />
            )}

            {viewMode === "add-product" && (
              <ProductForm
                onProductCreated={handleProductCreated}
                onCancel={() => setViewMode("list")}
              />
            )}

            {viewMode === "add-movement" && (
              <MovementForm
                products={products}
                onMovementCreated={handleMovementCreated}
                onCancel={() => setViewMode("list")}
              />
            )}

            {viewMode === "alerts" && (
              <StockAlerts
                alerts={alerts}
                onAlertRead={handleAlertRead}
                onRefresh={refreshData}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
