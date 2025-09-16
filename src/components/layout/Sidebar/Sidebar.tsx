import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaReact } from "react-icons/fa";
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiCalendar,
  FiBarChart,
  FiSettings,
  FiFileText,
  FiCreditCard,
  FiTrendingUp,
  FiChevronRight,
} from "react-icons/fi";
import type { MenuItem } from "../types";
import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  items?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FiHome,
    path: "/dashboard",
  },
  {
    id: "vendas",
    label: "Vendas",
    icon: FiShoppingCart,
    items: [
      {
        id: "nova-venda",
        label: "Nova Venda",
        icon: FiShoppingCart,
        path: "/vendas/nova",
      },
      {
        id: "historico-vendas",
        label: "Histórico",
        icon: FiFileText,
        path: "/vendas/historico",
      },
      {
        id: "relatorios-vendas",
        label: "Relatórios",
        icon: FiTrendingUp,
        path: "/vendas/relatorios",
      },
    ],
  },
  {
    id: "estoque",
    label: "Estoque",
    icon: FiPackage,
    items: [
      {
        id: "produtos",
        label: "Produtos",
        icon: FiPackage,
        path: "/estoque/produtos",
      },
      {
        id: "categorias",
        label: "Categorias",
        icon: FiFileText,
        path: "/estoque/categorias",
      },
      {
        id: "movimentacao",
        label: "Movimentação",
        icon: FiTrendingUp,
        path: "/estoque/movimentacao",
      },
    ],
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: FiUsers,
    path: "/clientes",
    badge: "124",
  },
  {
    id: "agenda",
    label: "Agenda",
    icon: FiCalendar,
    path: "/agenda",
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: FiCreditCard,
    items: [
      {
        id: "contas-receber",
        label: "Contas a Receber",
        icon: FiTrendingUp,
        path: "/financeiro/receber",
      },
      {
        id: "contas-pagar",
        label: "Contas a Pagar",
        icon: FiCreditCard,
        path: "/financeiro/pagar",
      },
      {
        id: "fluxo-caixa",
        label: "Fluxo de Caixa",
        icon: FiBarChart,
        path: "/financeiro/fluxo",
      },
    ],
  },
  {
    id: "relatorios",
    label: "Relatórios",
    icon: FiBarChart,
    path: "/relatorios",
  },
  {
    id: "configuracoes",
    label: "Configurações",
    icon: FiSettings,
    path: "/configuracoes",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  items = defaultMenuItems,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

  const toggleExpanded = (itemId: string) => {
    if (collapsed) return;

    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.items) {
      toggleExpanded(item.id);
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isParentActive = (item: MenuItem): boolean => {
    if (item.path && isActive(item.path)) return true;
    if (item.items) {
      return item.items.some((subItem) => isActive(subItem.path));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasSubItems = item.items && item.items.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isItemActive = isActive(item.path);
    const isParentItemActive = isParentActive(item);

    return (
      <div key={item.id} className="menu-item-container">
        <button
          className={`menu-item ${isItemActive ? "active" : ""} ${
            isParentItemActive ? "parent-active" : ""
          } ${level > 0 ? "sub-item" : ""}`}
          onClick={() => handleItemClick(item)}
          title={collapsed ? item.label : undefined}
        >
          <div className="menu-item-content">
            <div className="menu-icon">
              <item.icon size={18} />
            </div>

            {!collapsed && (
              <>
                <span className="menu-label">{item.label}</span>

                <div className="menu-item-end">
                  {item.badge && (
                    <span className="menu-badge">{item.badge}</span>
                  )}

                  {hasSubItems && (
                    <FiChevronRight
                      size={14}
                      className={`chevron ${isExpanded ? "expanded" : ""}`}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </button>

        {hasSubItems && !collapsed && isExpanded && (
          <div className="sub-menu">
            {item.items!.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <FaReact />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">Huff Life</span>
              <span className="logo-subtitle">Sistema de Gestão</span>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {items.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="footer-content">
            <div className="version-info">
              <span>Versão 1.0.0</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
