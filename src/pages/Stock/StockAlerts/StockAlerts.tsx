import React, { useState } from "react";
import {
  FiAlertTriangle,
  FiClock,
  FiX,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import type { StockAlert } from "../../../types/stock";
import "./StockAlerts.css";

interface StockAlertsProps {
  alerts: StockAlert[];
  onAlertRead: (alertId: string) => void;
  onRefresh: () => void;
}

export const StockAlerts: React.FC<StockAlertsProps> = ({
  alerts,
  onAlertRead,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<
    "all" | "unread" | "low_stock" | "expiring_soon" | "expired"
  >("all");
  const [showRead, setShowRead] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    if (!showRead && alert.isRead) return false;
    if (filter === "unread") return !alert.isRead;
    if (filter === "all") return true;
    return alert.type === filter;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <FiAlertTriangle className="alert-icon low-stock" />;
      case "expiring_soon":
        return <FiClock className="alert-icon expiring" />;
      case "expired":
        return <FiX className="alert-icon expired" />;
      default:
        return <FiAlertTriangle className="alert-icon" />;
    }
  };

  const getAlertSeverity = (severity: string) => {
    switch (severity) {
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "low";
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "low_stock":
        return "Estoque Baixo";
      case "expiring_soon":
        return "Próximo do Vencimento";
      case "expired":
        return "Vencido";
      default:
        return "Alerta";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const handleMarkAsRead = async (alertId: string) => {
    await onAlertRead(alertId);
  };

  const handleMarkAllAsRead = async () => {
    const unreadAlerts = alerts.filter((alert) => !alert.isRead);
    for (const alert of unreadAlerts) {
      await onAlertRead(alert.id);
    }
  };

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;
  const lowStockCount = alerts.filter(
    (alert) => alert.type === "low_stock"
  ).length;
  const expiringCount = alerts.filter(
    (alert) => alert.type === "expiring_soon"
  ).length;
  const expiredCount = alerts.filter(
    (alert) => alert.type === "expired"
  ).length;

  return (
    <div className="stock-alerts">
      <div className="alerts-header">
        <div className="header-info">
          <h2>Alertas de Estoque</h2>
          <div className="alerts-count">
            {filteredAlerts.length} de {alerts.length} alertas
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowRead(!showRead)}
            title={showRead ? "Ocultar lidos" : "Mostrar lidos"}
          >
            {showRead ? <FiEyeOff /> : <FiEye />}
            {showRead ? "Ocultar Lidos" : "Mostrar Lidos"}
          </button>

          {unreadCount > 0 && (
            <button className="btn btn-primary" onClick={handleMarkAllAsRead}>
              Marcar Todos como Lidos
            </button>
          )}

          <button className="btn btn-secondary" onClick={onRefresh}>
            <FiRefreshCw />
            Atualizar
          </button>
        </div>
      </div>

      <div className="alerts-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({alerts.length})
          </button>
          <button
            className={`filter-tab ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Não Lidos ({unreadCount})
          </button>
          <button
            className={`filter-tab ${filter === "low_stock" ? "active" : ""}`}
            onClick={() => setFilter("low_stock")}
          >
            <FiAlertTriangle />
            Estoque Baixo ({lowStockCount})
          </button>
          <button
            className={`filter-tab ${
              filter === "expiring_soon" ? "active" : ""
            }`}
            onClick={() => setFilter("expiring_soon")}
          >
            <FiClock />
            Próximos do Vencimento ({expiringCount})
          </button>
          <button
            className={`filter-tab ${filter === "expired" ? "active" : ""}`}
            onClick={() => setFilter("expired")}
          >
            <FiX />
            Vencidos ({expiredCount})
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="empty-state">
          <FiAlertTriangle className="empty-icon" />
          <h3>Nenhum alerta encontrado</h3>
          <p>
            {filter === "unread"
              ? "Todos os alertas foram lidos"
              : "Não há alertas para os filtros selecionados"}
          </p>
        </div>
      ) : (
        <div className="alerts-list">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card ${
                alert.isRead ? "read" : ""
              } ${getAlertSeverity(alert.severity)}`}
            >
              <div className="alert-content">
                <div className="alert-icon-container">
                  {getAlertIcon(alert.type)}
                </div>

                <div className="alert-details">
                  <div className="alert-header">
                    <span className="alert-type">
                      {getAlertTypeLabel(alert.type)}
                    </span>
                    <span className="alert-severity">
                      {alert.severity === "high"
                        ? "Alto"
                        : alert.severity === "medium"
                        ? "Médio"
                        : "Baixo"}
                    </span>
                  </div>

                  <p className="alert-message">{alert.message}</p>

                  <div className="alert-meta">
                    <span className="alert-date">
                      {formatDate(alert.createdAt)}
                    </span>
                    {alert.isRead && <span className="alert-status">Lido</span>}
                  </div>
                </div>
              </div>

              {!alert.isRead && (
                <div className="alert-actions">
                  <button
                    className="mark-read-btn"
                    onClick={() => handleMarkAsRead(alert.id)}
                    title="Marcar como lido"
                  >
                    <FiEye />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
