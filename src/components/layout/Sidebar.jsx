import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Mail,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Layanan', path: '/admin/services', icon: Stethoscope },
    { name: 'Kelola Dokter', path: '/admin/doctors', icon: Users },
    { name: 'Kelola Reservasi', path: '/admin/appointments', icon: CalendarCheck },
    { name: 'Kelola Pembayaran', path: '/admin/payments', icon: CreditCard },
    { name: 'Kelola Testimoni', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Kelola Pesan', path: '/admin/messages', icon: Mail },
  ];

  const activeStyle = "flex items-center gap-3 px-4 py-3 text-sm font-semibold bg-teal-600 text-white rounded-lg shadow-sm shadow-teal-100 transition-all duration-150";
  const inactiveStyle = "flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-teal-600 rounded-lg transition-colors duration-150";

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Sidebar Header / Brand */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200 justify-between">
        <Link to="/" className="flex items-center gap-1.5 font-sans">
          <span className="text-xl font-bold text-slate-900">
            Ficky<span className="text-teal-600">Admin</span> 🐾
          </span>
        </Link>
      </div>

      {/* Admin Profile Details */}
      <div className="p-4 border-b border-slate-100">
        <div className="bg-slate-50 p-3 rounded-lg flex flex-col">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Logged in as</span>
          <span className="text-sm font-bold text-slate-900 truncate mt-0.5">{user?.name || 'Admin'}</span>
          <span className="text-xs text-slate-500 truncate mt-0.5">{user?.email || 'admin@fickybusuk.com'}</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1.5 px-4 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            <item.icon size={18} className="shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer (Logout & Visit Home) */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-teal-600 rounded-lg transition-colors"
        >
          <Home size={18} className="shrink-0" />
          <span>Lihat Website</span>
        </Link>
        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
