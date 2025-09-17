import React from "react";
import { Button } from "../../../components/ui/Button/Button";
import type { Client } from "../../../types/client";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiMoreVertical,
  FiEdit,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import "./ClientCard.css";

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onToggleStatus: (client: Client) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className={`client-card ${client.status}`}>
      <div className="client-header">
        <div className="client-avatar">
          <FiUser size={20} />
        </div>
        <div className="client-info">
          <h3 className="client-name">{client.name}</h3>
          <div className="client-status">
            <span className={`status-badge ${client.status}`}>
              {client.status === "active" ? "Ativo" : "Inativo"}
            </span>
            <button
              className="status-toggle"
              onClick={() => onToggleStatus(client)}
              title={`${
                client.status === "active" ? "Desativar" : "Ativar"
              } cliente`}
            >
              {client.status === "active" ? (
                <FiToggleRight size={16} />
              ) : (
                <FiToggleLeft size={16} />
              )}
            </button>
          </div>
        </div>
        <div className="client-actions">
          <Button variant="ghost" onClick={() => onView(client)}>
            <FiEye size={16} />
          </Button>
          <Button variant="ghost" onClick={() => onEdit(client)}>
            <FiEdit size={16} />
          </Button>
          <Button variant="ghost" onClick={() => onDelete(client)}>
            <FiMoreVertical size={16} />
          </Button>
        </div>
      </div>

      <div className="client-details">
        <div className="detail-item">
          <FiMail size={14} />
          <span>{client.email}</span>
        </div>
        <div className="detail-item">
          <FiPhone size={14} />
          <span>{client.phone}</span>
        </div>
        {client.lastPurchase && (
          <div className="detail-item">
            <FiCalendar size={14} />
            <span>Ultima compra: {formatDate(client.lastPurchase)}</span>
          </div>
        )}
      </div>

      <div className="client-footer">
        <div className="purchase-info">
          <FiDollarSign size={14} />
          <span>Total gasto: {formatCurrency(client.totalPurchases || 0)}</span>
        </div>
        <div className="client-notes">
          {client.notes && (
            <span className="notes-preview">
              {client.notes.length > 50
                ? `${client.notes.substring(0, 50)}...`
                : client.notes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
