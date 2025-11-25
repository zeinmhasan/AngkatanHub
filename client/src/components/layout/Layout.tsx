import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  ExternalLink,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import UserMenu from "../../components/UserMenu";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect admin role
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 shadow-soft fixed top-0 left-0 right-0 z-50">
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-lg sm:text-2xl font-bold flex items-center text-primary-600"
          >
            <span className="mr-1 sm:mr-2">🎓</span>
            <span className="hidden sm:inline">AngkatanHub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600 dark:text-gray-400 focus:outline-none z-50 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex pt-16 md:pt-16">
        {/* Sidebar - Hidden by default, visible on medium screens and above */}
        <aside
          className={`fixed md:static z-40 top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 w-64 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 overflow-y-auto`}
        >
          <nav className="mt-4 sm:mt-6">
            <ul className="space-y-1">
              {/* Dashboard */}
              <li>
                <Link
                  to="/"
                  className="flex items-center px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 border-l-4 border-transparent hover:border-primary-600 transition text-sm sm:text-base"
                  onClick={() =>
                    window.innerWidth < 768 && setSidebarOpen(false)
                  }
                >
                  <LayoutDashboard
                    className="mr-2 sm:mr-3 flex-shrink-0"
                    size={20}
                  />
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Jadwal Kuliah - visible to all */}
              <li>
                <Link
                  to="/schedule"
                  className="flex items-center px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 border-l-4 border-transparent hover:border-primary-600 transition text-sm sm:text-base"
                  onClick={() =>
                    window.innerWidth < 768 && setSidebarOpen(false)
                  }
                >
                  <Calendar className="mr-2 sm:mr-3 flex-shrink-0" size={20} />
                  <span>Jadwal</span>
                </Link>
              </li>

              {/* Tugas - visible to all */}
              <li>
                <Link
                  to="/assignments"
                  className="flex items-center px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 border-l-4 border-transparent hover:border-primary-600 transition text-sm sm:text-base"
                  onClick={() =>
                    window.innerWidth < 768 && setSidebarOpen(false)
                  }
                >
                  <FileText className="mr-2 sm:mr-3 flex-shrink-0" size={20} />
                  <span>Tugas</span>
                </Link>
              </li>

              {/* Kegiatan - visible to all */}
              <li>
                <Link
                  to="/activities"
                  className="flex items-center px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 border-l-4 border-transparent hover:border-primary-600 transition text-sm sm:text-base"
                  onClick={() =>
                    window.innerWidth < 768 && setSidebarOpen(false)
                  }
                >
                  <Users className="mr-2 sm:mr-3 flex-shrink-0" size={20} />
                  <span>Kegiatan</span>
                </Link>
              </li>

              {/* Forum - visible to all */}
              <li>
                <Link
                  to="/forum"
                  className="flex items-center px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 border-l-4 border-transparent hover:border-primary-600 transition text-sm sm:text-base"
                  onClick={() =>
                    window.innerWidth < 768 && setSidebarOpen(false)
                  }
                >
                  <MessageSquare
                    className="mr-2 sm:mr-3 flex-shrink-0"
                    size={20}
                  />
                  <span>Forum</span>
                </Link>
              </li>

              {/* Info Eksternal - visible to all */}
              <li>
                <Link
                  to="/external-info"
                  className="flex items-center px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 border-l-4 border-transparent hover:border-primary-600 transition text-sm sm:text-base"
                  onClick={() =>
                    window.innerWidth < 768 && setSidebarOpen(false)
                  }
                >
                  <ExternalLink
                    className="mr-2 sm:mr-3 flex-shrink-0"
                    size={20}
                  />
                  <span>Info Eksternal</span>
                </Link>
              </li>

              {/* Admin Panel - admin only */}
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="flex items-center px-4 sm:px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 border-l-4 border-transparent hover:border-primary-600 transition text-sm sm:text-base"
                    onClick={() =>
                      window.innerWidth < 768 && setSidebarOpen(false)
                    }
                  >
                    <Settings
                      className="mr-2 sm:mr-3 flex-shrink-0"
                      size={20}
                    />
                    <span>Admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 pb-12 md:pb-0 w-full md:w-auto">
          <div className="pt-4 sm:pt-6 md:pt-0 px-2 sm:px-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
