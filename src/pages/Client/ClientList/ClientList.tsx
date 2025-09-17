import React, { useState, useEffect } from "react";
import type { Client } from "../../../types/client";
import { ClientCard } from "../ClientCard/ClientCard";
import { clientService } from "../../../services/clientService";
import { FiUsers, FiRefreshCw } from "react-icons/fi";
import "./ClientList.css";

interface ClientListProps {
  searchTerm: string;
  statusFilter: "all" | "active" | "inactive";
  periodFilter: "all" | "7days" | "30days" | "90days";
  onEditClient: (client: Client) => void;
  onViewClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  refreshTrigger?: number;
}

export const ClientList: React.FC<ClientListProps> = ({
  searchTerm,
  statusFilter,
  periodFilter,
  onEditClient,
  onViewClient,
  onDeleteClient,
  refreshTrigger,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadClients();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    const filterClients = () => {
      let filtered = [...clients];

      // Filtrar por termo de busca
      if (searchTerm) {
        filtered = filtered.filter(
          (client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filtrar por status
      if (statusFilter !== "all") {
        filtered = filtered.filter((client) => client.status === statusFilter);
      }

      // Filtrar por período
      if (periodFilter !== "all") {
        const now = new Date();
        const days =
          periodFilter === "7days" ? 7 : periodFilter === "30days" ? 30 : 90;
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        filtered = filtered.filter((client) => {
          if (!client.lastPurchase) return false;
          return client.lastPurchase >= cutoffDate;
        });
      }

      setFilteredClients(filtered);
      setCurrentPage(1); // Reset para primeira página ao filtrar
    };

    filterClients();
  }, [clients, searchTerm, statusFilter, periodFilter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const clientsData = await clientService.getAllClients();
      setClients(clientsData);
    } catch (err) {
      setError("Erro ao carregar clientes");
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await clientService.deleteClient(clientId);
        await loadClients(); // Recarregar lista
        onDeleteClient(clientId);
      } catch (err) {
        setError("Erro ao excluir cliente");
        console.error("Erro ao excluir cliente:", err);
      }
    }
  };

  const handleStatusToggle = async (client: Client) => {
    try {
      const newStatus = client.status === "active" ? "inactive" : "active";
      await clientService.updateClient(client.id, { status: newStatus });
      await loadClients(); // Recarregar lista
    } catch (err) {
      setError("Erro ao alterar status do cliente");
      console.error("Erro ao alterar status:", err);
    }
  };

  // Paginação
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="client-list-loading">
        <div className="loading-spinner"></div>
        <p>Carregando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-list-error">
        <p>{error}</p>
        <button onClick={loadClients} className="retry-button">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="client-list">
      <div className="client-list-header">
        <div className="client-list-info">
          <h3>Clientes</h3>
          <span className="client-count">
            {filteredClients.length} de {clients.length} clientes
          </span>
        </div>
        <div className="client-list-actions">
          <button onClick={loadClients} className="refresh-button">
            <FiRefreshCw size={16} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="client-list-empty">
          <div className="empty-icon">
            <FiUsers size={48} />
          </div>
          <h4>Nenhum cliente encontrado</h4>
          <p>
            {searchTerm || statusFilter !== "all" || periodFilter !== "all"
              ? "Tente ajustar os filtros para encontrar clientes."
              : "Comece adicionando seu primeiro cliente."}
          </p>
        </div>
      ) : (
        <>
          <div className="client-grid">
            {currentClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={() => onEditClient(client)}
                onView={() => onViewClient(client)}
                onDelete={() => handleDeleteClient(client.id)}
                onToggleStatus={() => handleStatusToggle(client)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="client-pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Anterior
              </button>

              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`pagination-page ${
                        page === currentPage ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
