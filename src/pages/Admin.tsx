import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import AdminDashboard from '../components/AdminDashboard';
import AdminServices from '../components/AdminServices';
import AdminApplications from '../components/AdminApplications';

interface AdminProps {
  user: User;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Admin({ user, isDarkMode, setIsDarkMode }: AdminProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg)] border-r border-[var(--border)] transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="text-xl font-bold font-mono tracking-tighter">PANKAJ ADMIN</Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-[var(--muted)] rounded-full">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                    isActive 
                      ? "bg-[var(--fg)] text-[var(--bg)] shadow-lg" 
                      : "hover:bg-[var(--muted)] opacity-60 hover:opacity-100"
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-[var(--border)] space-y-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center text-xs font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs opacity-50">Administrator</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[var(--muted)] transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-[var(--border)] flex items-center px-6 lg:px-10 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={cn("p-2 hover:bg-[var(--muted)] rounded-full mr-4 lg:hidden", isSidebarOpen && "hidden")}
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-bold font-mono uppercase tracking-widest">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 dot-pattern">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/services" element={<AdminServices />} />
            <Route path="/applications" element={<AdminApplications />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
