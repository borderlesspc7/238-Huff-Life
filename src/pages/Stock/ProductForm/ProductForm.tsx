import React, { useState } from "react";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import type { ProductBatch } from "../../../types/stock";
import { stockService } from "../../../services/stockService";
import "./ProductForm.css";

interface ProductFormProps {
  onProductCreated: () => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onProductCreated,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    unit: "unidade" as const,
    category: "",
    description: "",
  });

  const [batches, setBatches] = useState<
    Omit<ProductBatch, "id" | "productId" | "createdAt">[]
  >([
    {
      batchNumber: "",
      quantity: 0,
      expirationDate: new Date(),
      purchasePrice: 0,
      salePrice: 0,
      supplier: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const units = stockService.getUnits();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do produto é obrigatório";
    }

    if (!formData.unit) {
      newErrors.unit = "Unidade é obrigatória";
    }

    batches.forEach((batch, index) => {
      if (!batch.batchNumber.trim()) {
        newErrors[`batch_${index}_number`] = "Número do lote é obrigatório";
      }

      if (batch.quantity <= 0) {
        newErrors[`batch_${index}_quantity`] =
          "Quantidade deve ser maior que zero";
      }

      if (batch.expirationDate <= new Date()) {
        newErrors[`batch_${index}_expiration`] =
          "Data de vencimento deve ser futura";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBatchChange = (index: number, field: string, value: string) => {
    const newBatches = [...batches];

    // Convert values based on field type
    if (
      field === "quantity" ||
      field === "purchasePrice" ||
      field === "salePrice"
    ) {
      newBatches[index] = {
        ...newBatches[index],
        [field]: parseFloat(value) || 0,
      };
    } else if (field === "expirationDate") {
      newBatches[index] = { ...newBatches[index], [field]: new Date(value) };
    } else {
      newBatches[index] = { ...newBatches[index], [field]: value };
    }

    setBatches(newBatches);

    const errorKey = `batch_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addBatch = () => {
    setBatches((prev) => [
      ...prev,
      {
        batchNumber: "",
        quantity: 0,
        expirationDate: new Date(),
        purchasePrice: 0,
        salePrice: 0,
        supplier: "",
      },
    ]);
  };

  const removeBatch = (index: number) => {
    if (batches.length > 1) {
      setBatches((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Criar produto
      const product = await stockService.createProduct(formData);

      // Adicionar lotes
      for (const batchData of batches) {
        await stockService.addBatch(product.id, batchData);
      }

      onProductCreated();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <div className="form-header">
        <h2>Cadastrar Novo Produto</h2>
        <button className="close-btn" onClick={onCancel}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <h3>Informações do Produto</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome do Produto *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Ex: Arroz Integral"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Unidade *</label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                className={`form-select ${errors.unit ? "error" : ""}`}
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <span className="error-message">{errors.unit}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="form-input"
                placeholder="Ex: Grãos, Laticínios"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="form-textarea"
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Lotes de Estoque</h3>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addBatch}
            >
              <FiPlus />
              Adicionar Lote
            </button>
          </div>

          {batches.map((batch, index) => (
            <div key={index} className="batch-form">
              <div className="batch-header">
                <h4>Lote {index + 1}</h4>
                {batches.length > 1 && (
                  <button
                    type="button"
                    className="remove-batch-btn"
                    onClick={() => removeBatch(index)}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Número do Lote *</label>
                  <input
                    type="text"
                    value={batch.batchNumber}
                    onChange={(e) =>
                      handleBatchChange(index, "batchNumber", e.target.value)
                    }
                    className={`form-input ${
                      errors[`batch_${index}_number`] ? "error" : ""
                    }`}
                    placeholder="Ex: LOT001"
                  />
                  {errors[`batch_${index}_number`] && (
                    <span className="error-message">
                      {errors[`batch_${index}_number`]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Quantidade *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={batch.quantity}
                    onChange={(e) =>
                      handleBatchChange(index, "quantity", e.target.value)
                    }
                    className={`form-input ${
                      errors[`batch_${index}_quantity`] ? "error" : ""
                    }`}
                    placeholder="0"
                  />
                  {errors[`batch_${index}_quantity`] && (
                    <span className="error-message">
                      {errors[`batch_${index}_quantity`]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Vencimento *</label>
                  <input
                    type="date"
                    value={batch.expirationDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleBatchChange(index, "expirationDate", e.target.value)
                    }
                    className={`form-input ${
                      errors[`batch_${index}_expiration`] ? "error" : ""
                    }`}
                  />
                  {errors[`batch_${index}_expiration`] && (
                    <span className="error-message">
                      {errors[`batch_${index}_expiration`]}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preço de Compra</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={batch.purchasePrice || ""}
                    onChange={(e) =>
                      handleBatchChange(index, "purchasePrice", e.target.value)
                    }
                    className="form-input"
                    placeholder="0,00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preço de Venda</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={batch.salePrice || ""}
                    onChange={(e) =>
                      handleBatchChange(index, "salePrice", e.target.value)
                    }
                    className="form-input"
                    placeholder="0,00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fornecedor</label>
                  <input
                    type="text"
                    value={batch.supplier || ""}
                    onChange={(e) =>
                      handleBatchChange(index, "supplier", e.target.value)
                    }
                    className="form-input"
                    placeholder="Nome do fornecedor"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

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
            {loading ? "Salvando..." : "Salvar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
};
