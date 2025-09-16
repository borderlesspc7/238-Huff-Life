import React, { useState, useEffect } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import type { MenuItem } from "../types";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
  sidebarItems?: MenuItem[];
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebarItems }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarCollapsed(false);
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div
        className={`sidebar-container ${isMobile && sidebarOpen ? "open" : ""}`}
      >
        <Sidebar
          collapsed={!isMobile && sidebarCollapsed}
          items={sidebarItems}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Main Content */}
      <div
        className={`main-content ${
          sidebarCollapsed && !isMobile ? "sidebar-collapsed" : ""
        }`}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="content-area">
          <div className="content-wrapper">{children}</div>
        </main>
      </div>
    </div>
  );
};
