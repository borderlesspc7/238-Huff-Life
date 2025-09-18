// src/pages/Dashboard/DashboardPage.tsx
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Layout } from "../../components/layout";
import {
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
  FiUsers,
  FiShoppingCart,
  FiPackage,
  FiCalendar,
  FiBarChart,
  FiFilter,
  FiArrowUp,
  FiMoreHorizontal,
  FiRefreshCw,
} from "react-icons/fi";
import "./Dashboard.css";
interface SalesData {
  dailySales: number;
  monthlySales: number;
  monthlyGoal: number;
  salesByVendor: { name: string; sales: number }[];
  recentSales: { id: string; client: string; value: number; date: string }[];
}

export const DashboardPage = () => {
  const [salesData] = useState<SalesData>({
    dailySales: 2500.0,
    monthlySales: 45000.0,
    monthlyGoal: 60000.0,
    salesByVendor: [
      { name: "João Silva", sales: 15000 },
      { name: "Maria Santos", sales: 12000 },
      { name: "Carlos Lima", sales: 8000 },
      { name: "Ana Costa", sales: 10000 },
    ],
    recentSales: [
      { id: "001", client: "Empresa ABC", value: 850.0, date: "2024-01-15" },
      { id: "002", client: "João Oliveira", value: 320.5, date: "2024-01-15" },
      { id: "003", client: "Loja XYZ", value: 1200.0, date: "2024-01-14" },
    ],
  });

  const [filterPeriod, setFilterPeriod] = useState("today");

  const goalProgress = (salesData.monthlySales / salesData.monthlyGoal) * 100;

  const quickActions = [
    {
      icon: FiShoppingCart,
      label: "Nova Venda",
      color: "#059669",
      path: "/nova-venda",
    },
    { icon: FiPackage, label: "Estoque", color: "#dc2626", path: "/estoque" },
    { icon: FiCalendar, label: "Agenda", color: "#2563eb", path: "/agenda" },
    { icon: FiUsers, label: "Clientes", color: "#7c3aed", path: "/clientes" },
    {
      icon: FiBarChart,
      label: "Financeiro",
      color: "#ea580c",
      path: "/financeiro",
    },
  ];

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-title-group">
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">
                Bem-vindo de volta! Aqui está o resumo do seu negócio
              </p>
            </div>
            <div className="header-actions">
              <Button variant="ghost" className="refresh-btn">
                <FiRefreshCw size={16} />
                Atualizar
              </Button>
              <div className="filter-group">
                <FiFilter size={16} />
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="filter-select"
                >
                  <option value="today">Hoje</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="year">Este Ano</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="stats-grid">
          <Card className="stat-card stat-card-primary">
            <CardContent>
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-icon-wrapper">
                    <div
                      className="stat-icon"
                      style={{
                        background: "linear-gradient(135deg, #059669, #10b981)",
                      }}
                    >
                      <FiDollarSign size={24} color="white" />
                    </div>
                  </div>
                  <Button variant="ghost" className="stat-menu">
                    <FiMoreHorizontal size={16} />
                  </Button>
                </div>
                <div className="stat-info">
                  <h3 className="stat-label">Vendas do Dia</h3>
                  <p className="stat-value">
                    R${" "}
                    {salesData.dailySales.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <div className="stat-change-wrapper">
                    <span className="stat-change positive">
                      <FiArrowUp size={14} />
                      12% vs ontem
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-blue">
            <CardContent>
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-icon-wrapper">
                    <div
                      className="stat-icon"
                      style={{
                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                      }}
                    >
                      <FiTrendingUp size={24} color="white" />
                    </div>
                  </div>
                  <Button variant="ghost" className="stat-menu">
                    <FiMoreHorizontal size={16} />
                  </Button>
                </div>
                <div className="stat-info">
                  <h3 className="stat-label">Vendas do Mês</h3>
                  <p className="stat-value">
                    R${" "}
                    {salesData.monthlySales.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <div className="stat-change-wrapper">
                    <span className="stat-change positive">
                      <FiArrowUp size={14} />
                      8% vs mês anterior
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-red">
            <CardContent>
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-icon-wrapper">
                    <div
                      className="stat-icon"
                      style={{
                        background: "linear-gradient(135deg, #dc2626, #ef4444)",
                      }}
                    >
                      <FiTarget size={24} color="white" />
                    </div>
                  </div>
                  <Button variant="ghost" className="stat-menu">
                    <FiMoreHorizontal size={16} />
                  </Button>
                </div>
                <div className="stat-info">
                  <h3 className="stat-label">Meta do Mês</h3>
                  <p className="stat-value">{goalProgress.toFixed(1)}%</p>
                  <div className="progress-bar-modern">
                    <div className="progress-track">
                      <div
                        className="progress-fill-modern"
                        style={{ width: `${Math.min(goalProgress, 100)}%` }}
                      ></div>
                    </div>
                    <span className="progress-label">
                      {salesData.monthlyGoal.toLocaleString("pt-BR")} meta
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-purple">
            <CardContent>
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-icon-wrapper">
                    <div
                      className="stat-icon"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                      }}
                    >
                      <FiUsers size={24} color="white" />
                    </div>
                  </div>
                  <Button variant="ghost" className="stat-menu">
                    <FiMoreHorizontal size={16} />
                  </Button>
                </div>
                <div className="stat-info">
                  <h3 className="stat-label">Clientes Ativos</h3>
                  <p className="stat-value">847</p>
                  <div className="stat-change-wrapper">
                    <span className="stat-change positive">
                      <FiArrowUp size={14} />
                      15 novos
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="quick-actions-card modern-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="quick-actions-grid-modern">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="quick-action-card"
                  onClick={() => console.log(`Navegando para: ${action.path}`)}
                >
                  <div className="action-content">
                    <div
                      className="action-icon-modern"
                      style={{
                        background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                        boxShadow: `0 4px 20px ${action.color}33`,
                      }}
                    >
                      <action.icon size={24} color="white" />
                    </div>
                    <div className="action-info">
                      <span className="action-label">{action.label}</span>
                      <span className="action-description">
                        Gerenciar {action.label.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="action-arrow">
                    <FiArrowUp
                      size={16}
                      style={{ transform: "rotate(45deg)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="dashboard-content">
          {/* Vendas por Vendedor */}
          <Card className="chart-card">
            <CardHeader>
              <CardTitle>Vendas por Vendedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="vendor-chart">
                {salesData.salesByVendor.map((vendor, index) => {
                  const percentage =
                    (vendor.sales /
                      Math.max(
                        ...salesData.salesByVendor.map((v) => v.sales)
                      )) *
                    100;
                  return (
                    <div key={index} className="vendor-item">
                      <div className="vendor-info">
                        <span className="vendor-name">{vendor.name}</span>
                        <span className="vendor-value">
                          R${" "}
                          {vendor.sales.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="vendor-bar">
                        <div
                          className="vendor-progress"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Vendas Recentes */}
          <Card className="recent-sales-card">
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="sales-list">
                {salesData.recentSales.map((sale, index) => (
                  <div key={index} className="sale-item">
                    <div className="sale-info">
                      <span className="sale-client">{sale.client}</span>
                      <span className="sale-id">#{sale.id}</span>
                    </div>
                    <div className="sale-details">
                      <span className="sale-value">
                        R${" "}
                        {sale.value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="sale-date">
                        {new Date(sale.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
