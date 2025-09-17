import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button/Button";
import { Input } from "../../../components/ui/Input/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/Card/Card";
import type { Client } from "../../../types/client";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiSave,
  FiX,
} from "react-icons/fi";
import "./ClientForm.css";

interface ClientFormProps {
  client?: Client;
  onSave: (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSave,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    status: "active" as "active" | "inactive",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address || "",
        notes: client.notes || "",
        status: client.status,
      });
    }
  }, [client]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const isEditing = !!client;

  return (
    <Card className="client-form-card">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <FiUser size={16} />
                Nome *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                required
                placeholder="Nome completo"
                className={errors.name ? "error" : ""}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">
                <FiMail size={16} />
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                required
                placeholder="seu@email.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">
                <FiPhone size={16} />
                Telefone *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                required
                placeholder="(11) 99999-9999"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">
                <FiMapPin size={16} />
                Endereço
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(value) => handleInputChange("address", value)}
                placeholder="Endereço completo"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              <FiFileText size={16} />
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Observações sobre o cliente"
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="form-select"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              <FiX size={16} />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <FiSave size={16} />
              {loading
                ? "Salvando..."
                : isEditing
                ? "Atualizar"
                : "Criar cliente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
