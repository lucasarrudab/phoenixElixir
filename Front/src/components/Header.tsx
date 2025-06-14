import React from 'react';
import { Users, Banknote, Tag, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-purple-400">AV3Phoenix</h1>
          </div>
          
          <nav className="flex space-x-1 md:space-x-4">
            <Link
              to="/users"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/users')
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Users size={18} className="mr-1.5" />
              <span className="hidden md:inline">Usuários</span>
            </Link>
            
            <Link
              to="/transactions"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/transactions')
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Banknote size={18} className="mr-1.5" />
              <span className="hidden md:inline">Transações</span>
            </Link>
            
            <Link
              to="/tags"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/tags')
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Tag size={18} className="mr-1.5" />
              <span className="hidden md:inline">Tags</span>
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            title="Sair"
          >
            <LogOut size={18} />
            <span className="hidden md:inline ml-1.5">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;