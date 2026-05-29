import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Cloud, LayoutDashboard, User, LogOut, Menu, X, ShieldAlert } from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Notes",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-mesh font-sans flex relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-25%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col justify-between p-6 border-r border-white/5 glass-panel h-screen sticky top-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl shadow-md">
              <Cloud size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              CloudNotes
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-purple-600/15 border border-purple-500/30 text-purple-300 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/30 to-blue-500/30 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold shadow-inner">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || "user@cloudnotes.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-250 cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Header & Main Container for Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 glass-panel sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg">
              <Cloud size={16} className="text-white" />
            </div>
            <span className="text-md font-bold text-white tracking-tight">
              CloudNotes
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile Slide-out Menu Backdrop */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Slide-out Drawer */}
        <div
          className={`md:hidden fixed top-[57px] right-0 bottom-0 z-50 w-72 max-w-[80vw] bg-[#0b0f19]/95 border-l border-white/5 p-6 space-y-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 pb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/30 to-blue-500/30 flex items-center justify-center text-purple-300 font-bold border border-purple-500/20">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || "user@cloudnotes.com"}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-purple-600/15 border border-purple-500/30 text-purple-300"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/15 cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 md:p-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
