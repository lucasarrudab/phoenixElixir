import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  viewAtual: ViewType;
  setViewAtual: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ viewAtual, setViewAtual }) => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <nav className="flex space-x-1 md:space-x-4">
            <button
              onClick={() => setViewAtual(ViewType.USUARIO)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${viewAtual === ViewType.USUARIO
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <span className="hidden md:inline">Usuários</span>
            </button>

            <button
              onClick={() => setViewAtual(ViewType.TAG)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${viewAtual === ViewType.TAG
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <span className="hidden md:inline">Tags</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;