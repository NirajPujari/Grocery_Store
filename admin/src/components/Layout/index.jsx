import React, { useState } from 'react'
import {
  LayoutDashboardIcon,
  UsersIcon,
  ShoppingBagIcon,
  PackageIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react'
import './style.css'

export const AdminLayout = ({
  children,
  currentView,
  setCurrentView,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      id: 'users',
      label: 'Users',
      icon: <UsersIcon size={20} />,
    },
    {
      id: 'products',
      label: 'Products',
      icon: <ShoppingBagIcon size={20} />,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <PackageIcon size={20} />,
    },
  ]
  return (
    <div className="admin-container">
      <div className="mobile-toggle">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="toggle-button"
        >
          {sidebarOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Admin Panel</h1>
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id)
                  setSidebarOpen(false)
                }}
                className={`nav-item ${currentView === item.id ? 'nav-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="main-content">
        <main className="content-wrapper">{children}</main>
      </div>
    </div>
  )
}
