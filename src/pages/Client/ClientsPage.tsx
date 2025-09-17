import React, { useState } from "react";
import type { Client } from "../../types/client";
import { ClientFilters } from "./ClientFilters/ClientFilters";
import { ClientList } from "./ClientList/ClientList";
import { ClientForm } from "./ClientForm/ClientForm";
import { Layout } from "../../components/layout";
import { clientService } from "../../services/clientService";
import {
  FiPlus,
  FiX,
  FiEdit,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiEye,
} from "react-icons/fi";
import "./ClientsPage.css";

export const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [periodFilter, setPeriodFilter] = useState<
    "all" | "7days" | "30days" | "90days"
  >("all");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(client);
    // Aqui você pode implementar um modal ou navegação para visualizar detalhes
    console.log("Visualizar cliente:", client);
  };

  const handleDeleteClient = (clientId: string) => {
    console.log("Cliente excluído:", clientId);
    // A lógica de exclusão já está no ClientList
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormError(null);
  };

  const handleFormSave = async (
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (editingClient) {
        // Atualizar cliente existente
        await clientService.updateClient(editingClient.id, clientData);
      } else {
        // Criar novo cliente
        await clientService.createClient(clientData);
      }

      setShowForm(false);
      setEditingClient(null);
      // Forçar refresh da lista
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setFormError("Erro ao salvar cliente. Tente novamente.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewClose = () => {
    setViewingClient(null);
  };

  return (
    <Layout>
      <div className="clients-page">
        <div className="clients-header">
          <div className="clients-title-section">
            <div className="clients-title-group">
              <FiUser className="page-icon" />
              <div>
                <h1 className="clients-title">Clientes</h1>
                <p className="clients-subtitle">
                  Gerencie seus clientes e acompanhe suas compras
                </p>
              </div>
            </div>
          </div>
          <button onClick={handleAddClient} className="add-client-button">
            <FiPlus size={20} />
            <span>Novo Cliente</span>
          </button>
        </div>

        <div className="clients-content">
          <ClientFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            periodFilter={periodFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onPeriodChange={setPeriodFilter}
            onAddClient={handleAddClient}
            onClearFilters={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setPeriodFilter("all");
            }}
            totalClients={0}
            filteredClients={0}
          />

          <ClientList
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            periodFilter={periodFilter}
            onEditClient={handleEditClient}
            onViewClient={handleViewClient}
            onDeleteClient={handleDeleteClient}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              {formError && (
                <div className="form-error-banner">
                  <p>{formError}</p>
                  <button
                    onClick={() => setFormError(null)}
                    className="error-close"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
              <ClientForm
                client={editingClient || undefined}
                onSave={handleFormSave}
                onCancel={handleFormClose}
                loading={formLoading}
              />
            </div>
          </div>
        )}

        {viewingClient && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="client-details">
                <div className="client-details-header">
                  <div className="details-title-group">
                    <FiEye className="details-icon" />
                    <h2>Detalhes do Cliente</h2>
                  </div>
                  <button onClick={handleViewClose} className="close-button">
                    <FiX size={20} />
                  </button>
                </div>
                <div className="client-details-content">
                  <div className="detail-group">
                    <div className="detail-label">
                      <FiUser size={16} />
                      <label>Nome</label>
                    </div>
                    <span>{viewingClient.name}</span>
                  </div>
                  <div className="detail-group">
                    <div className="detail-label">
                      <FiMail size={16} />
                      <label>Email</label>
                    </div>
                    <span>{viewingClient.email}</span>
                  </div>
                  <div className="detail-group">
                    <div className="detail-label">
                      <FiPhone size={16} />
                      <label>Telefone</label>
                    </div>
                    <span>{viewingClient.phone}</span>
                  </div>
                  {viewingClient.address && (
                    <div className="detail-group">
                      <div className="detail-label">
                        <FiMapPin size={16} />
                        <label>Endereço</label>
                      </div>
                      <span>{viewingClient.address}</span>
                    </div>
                  )}
                  <div className="detail-group">
                    <div className="detail-label">
                      <FiUser size={16} />
                      <label>Status</label>
                    </div>
                    <span className={`status-badge ${viewingClient.status}`}>
                      {viewingClient.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="detail-group">
                    <div className="detail-label">
                      <FiDollarSign size={16} />
                      <label>Total de Compras</label>
                    </div>
                    <span className="currency-value">
                      R$ {viewingClient.totalPurchases?.toFixed(2)}
                    </span>
                  </div>
                  {viewingClient.lastPurchase && (
                    <div className="detail-group">
                      <div className="detail-label">
                        <FiCalendar size={16} />
                        <label>Última Compra</label>
                      </div>
                      <span>
                        {viewingClient.lastPurchase.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  )}
                  {viewingClient.notes && (
                    <div className="detail-group">
                      <div className="detail-label">
                        <FiFileText size={16} />
                        <label>Observações</label>
                      </div>
                      <span>{viewingClient.notes}</span>
                    </div>
                  )}
                </div>
                <div className="client-details-actions">
                  <button
                    onClick={() => {
                      handleViewClose();
                      handleEditClient(viewingClient);
                    }}
                    className="edit-button"
                  >
                    <FiEdit size={16} />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={handleViewClose}
                    className="close-details-button"
                  >
                    <FiX size={16} />
                    <span>Fechar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
