import React from "react";
import { Button } from "../../ui/Button/Button";
import { useAuth } from "../../../hooks/useAuth";
import {
  FiBell,
  FiSearch,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Button
          variant="ghost"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
        >
          <div className={`hamburger ${sidebarCollapsed ? "collapsed" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Button>

        <div className="search-container">
          <FiSearch className="search-icon" size={18} />
          <input type="text" placeholder="Buscar..." className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <Button variant="ghost" className="notification-btn">
          <FiBell size={18} />
          <span className="notification-badge">3</span>
        </Button>

        <div className="user-menu-container">
          <Button
            variant="ghost"
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <FiUser size={16} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Usuário"}</span>
              <span className="user-role">Administrador</span>
            </div>
            <FiChevronDown
              size={16}
              className={`chevron ${showUserMenu ? "rotated" : ""}`}
            />
          </Button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-avatar large">
                  <FiUser size={20} />
                </div>
                <div className="user-details">
                  <span className="name">{user?.name || "Usuário"}</span>
                  <span className="email">
                    {user?.email || "email@exemplo.com"}
                  </span>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-items">
                <button className="dropdown-item">
                  <FiUser size={16} />
                  <span>Meu Perfil</span>
                </button>
                <button className="dropdown-item">
                  <FiSettings size={16} />
                  <span>Configurações</span>
                </button>
              </div>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item logout" onClick={handleLogout}>
                <FiLogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
