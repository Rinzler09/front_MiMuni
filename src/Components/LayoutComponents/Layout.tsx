// src/components/Layout.tsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Header 
        collapsed={collapsed} 
        onToggleSidebar={handleToggleSidebar} 
      />
      <Sidebar 
        collapsed={collapsed} 
        onToggleSidebar={handleToggleSidebar} 
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
