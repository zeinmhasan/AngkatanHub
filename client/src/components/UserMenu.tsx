import React, { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions";
import { Link } from "react-router-dom";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { canManageAll } = usePermissions();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="bg-gray-200 dark:bg-dark-700 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-300">
          <User size={20} />
        </div>
        <div className="hidden md:block">
          <p className="font-medium text-gray-800 dark:text-gray-100">
            {user.name}
          </p>
          <p className="text-xs text-primary-600 dark:text-primary-200">
            {user.className} • {user.role}
          </p>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg dark:shadow-dark-lg py-1 z-50">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
            onClick={() => setShowDropdown(false)}
          >
            <User className="mr-2" size={16} />
            Profil
          </Link>
          {canManageAll() && (
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              onClick={() => setShowDropdown(false)}
            >
              <Settings className="mr-2" size={16} />
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <LogOut className="mr-2" size={16} />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
