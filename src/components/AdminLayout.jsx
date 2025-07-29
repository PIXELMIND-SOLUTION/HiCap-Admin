import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './Navbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      setIsSidebarCollapsed(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`admin-layout d-flex`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={setIsSidebarCollapsed}
        isMobile={isMobile}
      />
      
      <div 
        className="main-content flex-grow-1"
        style={{
          marginLeft: isMobile ? '0' : (isSidebarCollapsed ? '0px' : '0px'),
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundColor: '#f7f9fc',
        }}
      >
        <TopNavbar 
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
