import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const activeClass = "text-teal-600 font-semibold border-b-2 border-teal-600 pb-1";
  const inactiveClass = "text-slate-600 hover:text-teal-600 font-medium transition-colors pb-1";

  const mobileActiveClass = "block px-3 py-2 rounded-md text-base font-medium bg-teal-50 text-teal-600";
  const mobileInactiveClass = "block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-teal-600";

  return (
    <nav className="glass-nav sticky top-0 z-40 w-full transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
              <span className="text-teal-600">Ficky</span>Busuk <span className="text-xl">🐾</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" end className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              Home
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              Layanan
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              Dokter
            </NavLink>
            <NavLink to="/reserve" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              Reservasi
            </NavLink>
          </div>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 transition-colors"
              >
                <User size={16} />
                Panel Admin
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors"
              >
                Login Admin
              </Link>
            )}
            
            <Link
              to="/reserve"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-all duration-200"
            >
              Buat Janji 🐾
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/reserve"
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
            >
              Buat Janji
            </Link>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <NavLink
              to="/"
              end
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? mobileActiveClass : mobileInactiveClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? mobileActiveClass : mobileInactiveClass}
            >
              Layanan
            </NavLink>
            <NavLink
              to="/doctors"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? mobileActiveClass : mobileInactiveClass}
            >
              Dokter
            </NavLink>
            <NavLink
              to="/reserve"
              onClick={toggleMenu}
              className={({ isActive }) => isActive ? mobileActiveClass : mobileInactiveClass}
            >
              Reservasi
            </NavLink>
            <hr className="my-2 border-slate-100" />
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={toggleMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-teal-600 bg-teal-50"
              >
                <User size={18} />
                Panel Admin
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:text-teal-600"
              >
                Login Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
