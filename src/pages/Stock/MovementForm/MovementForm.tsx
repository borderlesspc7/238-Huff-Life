import React, { useState, useEffect } from "react";
import { FiSave, FiX, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import type {
  Product,
  ProductBatch,
  StockMovement,
} from "../../../types/stock";
import { stockService } from "../../../services/stockService";
import "./MovementForm.css";

interface MovementFormProps {
  products: Product[];
  onMovementCreated: () => void;
  onCancel: () => void;
}

export const MovementForm: React.FC<MovementFormProps> = ({
  products,
  onMovementCreated,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    productId: "",
    batchId: "",
    type: "entrada" as "entrada" | "saida",
    quantity: 0,
    reason: "",
    notes: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableBatches, setAvailableBatches] = useState<ProductBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const movementReasons = {
    entrada: [
      "Compra de fornecedor",
      "Devolução de cliente",
      "Ajuste de inventário",
      "Transferência entre filiais",
      "Outros",
    ],
    saida: [
      "Venda",
      "Perda/Quebra",
      "Transferência entre filiais",
      "Ajuste de inventário",
      "Uso interno",
      "Outros",
    ],
  };

  useEffect(() => {
    if (formData.productId) {
      const product = products.find((p) => p.id === formData.productId);
      setSelectedProduct(product || null);

      if (product) {
        setAvailableBatches(product.batches);
        // Reset batch selection when product changes
        setFormData((prev) => ({ ...prev, batchId: "" }));
      }
    } else {
      setSelectedProduct(null);
      setAvailableBatches([]);
    }
  }, [formData.productId, products]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = "Produto é obrigatório";
    }

    if (!formData.batchId) {
      newErrors.batchId = "Lote é obrigatório";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantidade deve ser maior que zero";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Motivo é obrigatório";
    }

    // Validate if there's enough stock for output
    if (formData.type === "saida" && formData.batchId) {
      const batch = availableBatches.find((b) => b.id === formData.batchId);
      if (batch && formData.quantity > batch.quantity) {
        newErrors.quantity = `Quantidade disponível: ${batch.quantity}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    // Convert quantity to number
    if (field === "quantity") {
      setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const movementData: Omit<StockMovement, "id" | "createdAt"> = {
        ...formData,
        userId: "current-user-id", // TODO: Get from auth context
      };

      await stockService.createMovement(movementData);
      onMovementCreated();
    } catch (error) {
      console.error("Erro ao criar movimentação:", error);
      alert("Erro ao criar movimentação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getMaxQuantity = () => {
    if (formData.type === "entrada") return undefined;
    const batch = availableBatches.find((b) => b.id === formData.batchId);
    return batch ? batch.quantity : 0;
  };

  const getTotalAfterMovement = () => {
    if (!selectedProduct || !formData.batchId) return 0;

    const batch = availableBatches.find((b) => b.id === formData.batchId);
    if (!batch) return 0;

    if (formData.type === "entrada") {
      return batch.quantity + formData.quantity;
    } else {
      return Math.max(0, batch.quantity - formData.quantity);
    }
  };

  return (
    <div className="movement-form">
      <div className="form-header">
        <h2>Movimentação de Estoque</h2>
        <button className="close-btn" onClick={onCancel}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="movement-type-selector">
          <button
            type="button"
            className={`type-btn ${
              formData.type === "entrada" ? "active" : ""
            }`}
            onClick={() => handleInputChange("type", "entrada")}
          >
            <FiTrendingUp />
            Entrada
          </button>
          <button
            type="button"
            className={`type-btn ${formData.type === "saida" ? "active" : ""}`}
            onClick={() => handleInputChange("type", "saida")}
          >
            <FiTrendingDown />
            Saída
          </button>
        </div>

        <div className="form-section">
          <h3>Informações da Movimentação</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Produto *</label>
              <select
                value={formData.productId}
                onChange={(e) => handleInputChange("productId", e.target.value)}
                className={`form-select ${errors.productId ? "error" : ""}`}
              >
                <option value="">Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.totalQuantity} {product.unit})
                  </option>
                ))}
              </select>
              {errors.productId && (
                <span className="error-message">{errors.productId}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Lote *</label>
              <select
                value={formData.batchId}
                onChange={(e) => handleInputChange("batchId", e.target.value)}
                className={`form-select ${errors.batchId ? "error" : ""}`}
                disabled={!selectedProduct}
              >
                <option value="">Selecione um lote</option>
                {availableBatches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batchNumber} - {batch.quantity}{" "}
                    {selectedProduct?.unit}
                    (Vence:{" "}
                    {new Date(batch.expirationDate).toLocaleDateString("pt-BR")}
                    )
                  </option>
                ))}
              </select>
              {errors.batchId && (
                <span className="error-message">{errors.batchId}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantidade *</label>
              <input
                type="number"
                min="0"
                max={getMaxQuantity()}
                step="0.01"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className={`form-input ${errors.quantity ? "error" : ""}`}
                placeholder="0"
              />
              {errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
              {formData.type === "saida" && formData.batchId && (
                <div className="input-hint">
                  Disponível:{" "}
                  {availableBatches.find((b) => b.id === formData.batchId)
                    ?.quantity || 0}{" "}
                  {selectedProduct?.unit}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Motivo *</label>
              <select
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                className={`form-select ${errors.reason ? "error" : ""}`}
              >
                <option value="">Selecione um motivo</option>
                {movementReasons[formData.type].map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <span className="error-message">{errors.reason}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="form-textarea"
              placeholder="Observações adicionais sobre a movimentação"
              rows={3}
            />
          </div>
        </div>

        {selectedProduct && formData.batchId && (
          <div className="movement-summary">
            <h3>Resumo da Movimentação</h3>
            <div className="summary-content">
              <div className="summary-item">
                <span className="summary-label">Produto:</span>
                <span className="summary-value">{selectedProduct.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Lote:</span>
                <span className="summary-value">
                  {
                    availableBatches.find((b) => b.id === formData.batchId)
                      ?.batchNumber
                  }
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Quantidade Atual:</span>
                <span className="summary-value">
                  {
                    availableBatches.find((b) => b.id === formData.batchId)
                      ?.quantity
                  }{" "}
                  {selectedProduct.unit}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Movimentação:</span>
                <span
                  className={`summary-value ${
                    formData.type === "entrada" ? "positive" : "negative"
                  }`}
                >
                  {formData.type === "entrada" ? "+" : "-"}
                  {formData.quantity} {selectedProduct.unit}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Quantidade Final:</span>
                <span className="summary-value">
                  {getTotalAfterMovement()} {selectedProduct.unit}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="form-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiSave />
            {loading ? "Salvando..." : "Salvar Movimentação"}
          </button>
        </div>
      </form>
    </div>
  );
};
