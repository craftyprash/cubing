import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Info } from 'lucide-react';

interface HeaderProps {
  onShowIntro: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowIntro }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Full Solve', path: '/train' },
    { name: 'Cases', path: '/cases' }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/timer-cube-logo.svg" 
                alt="CraftyCubing Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-white">CraftyCubing</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={onShowIntro}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              title="About CraftyCubing"
            >
              <Info className="h-5 w-5" />
            </button>
          </nav>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                onShowIntro();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              About
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;