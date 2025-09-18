import React, { useState } from "react";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";
import type { Product } from "../../../../types/stock";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDelete,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  const getLowStockBatches = () => {
    return product.batches.filter((batch) => batch.quantity < 20);
  };

  const getExpiringSoonBatches = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return product.batches.filter(
      (batch) =>
        batch.expirationDate <= thirtyDaysFromNow &&
        batch.expirationDate > new Date()
    );
  };

  const getExpiredBatches = () => {
    const now = new Date();
    return product.batches.filter((batch) => batch.expirationDate <= now);
  };

  const getTotalValue = () => {
    return product.batches.reduce((sum, batch) => {
      return sum + batch.quantity * (batch.purchasePrice || 0);
    }, 0);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o produto "${product.name}"?`
      )
    ) {
      onDelete(product.id);
    }
  };

  const lowStockBatches = getLowStockBatches();
  const expiringSoonBatches = getExpiringSoonBatches();
  const expiredBatches = getExpiredBatches();
  const hasAlerts =
    lowStockBatches.length > 0 ||
    expiringSoonBatches.length > 0 ||
    expiredBatches.length > 0;

  return (
    <div className={`product-card ${hasAlerts ? "has-alerts" : ""}`}>
      <div className="card-header">
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-meta">
            <span className="product-unit">{product.unit}</span>
            {product.category && (
              <span className="product-category">{product.category}</span>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button
            className="action-btn"
            onClick={() => setShowDetails(!showDetails)}
            title="Ver detalhes"
          >
            <FiEye />
          </button>
          <button
            className="action-btn"
            onClick={() => {
              /* TODO: Implementar edição */
            }}
            title="Editar produto"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn danger"
            onClick={handleDelete}
            title="Excluir produto"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="card-stats">
        <div className="stat">
          <div className="stat-value">{product.totalQuantity}</div>
          <div className="stat-label">Quantidade Total</div>
        </div>

        <div className="stat">
          <div className="stat-value">{product.batches.length}</div>
          <div className="stat-label">Lotes</div>
        </div>

        <div className="stat">
          <div className="stat-value">{formatCurrency(getTotalValue())}</div>
          <div className="stat-label">Valor Total</div>
        </div>
      </div>

      {hasAlerts && (
        <div className="card-alerts">
          {lowStockBatches.length > 0 && (
            <div className="alert low-stock">
              <FiAlertTriangle />
              <span>{lowStockBatches.length} lote(s) com estoque baixo</span>
            </div>
          )}

          {expiringSoonBatches.length > 0 && (
            <div className="alert expiring">
              <FiClock />
              <span>
                {expiringSoonBatches.length} lote(s) próximo(s) do vencimento
              </span>
            </div>
          )}

          {expiredBatches.length > 0 && (
            <div className="alert expired">
              <FiAlertTriangle />
              <span>{expiredBatches.length} lote(s) vencido(s)</span>
            </div>
          )}
        </div>
      )}

      {showDetails && (
        <div className="card-details">
          <div className="details-section">
            <h4>Lotes</h4>
            <div className="batches-list">
              {product.batches.map((batch) => {
                const isLowStock = batch.quantity < 20;
                const isExpiringSoon =
                  batch.expirationDate <=
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const isExpired = batch.expirationDate <= new Date();

                return (
                  <div
                    key={batch.id}
                    className={`batch-item ${isLowStock ? "low-stock" : ""} ${
                      isExpiringSoon ? "expiring" : ""
                    } ${isExpired ? "expired" : ""}`}
                  >
                    <div className="batch-header">
                      <span className="batch-number">{batch.batchNumber}</span>
                      <span className="batch-quantity">
                        {batch.quantity} {product.unit}
                      </span>
                    </div>
                    <div className="batch-details">
                      <div className="batch-date">
                        Vence: {formatDate(batch.expirationDate)}
                      </div>
                      {batch.purchasePrice && (
                        <div className="batch-price">
                          Preço: {formatCurrency(batch.purchasePrice)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {product.description && (
            <div className="details-section">
              <h4>Descrição</h4>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
