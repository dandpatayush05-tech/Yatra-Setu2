import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Discover', href: '/destinations' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQs', href: '/help' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 no-underline">
            <img src="/logo.png" alt="Yatra Setu Logo" className="w-10 h-10 object-contain mix-blend-multiply" />
            <span className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Yatra Setu
            </span>
          </Link>
        </div>

        {/* Center: Links */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.href) && link.href !== '/' || location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#8B1A3A] relative py-1 ${
                  isActive ? 'text-[#8B1A3A]' : 'text-gray-600'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B1A3A]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Ask Gemini & Hamburger */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center space-x-2 bg-black text-white hover:bg-gray-800 transition-colors px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Ask Gemini</span>
          </button>
          
          <button 
            className="md:hidden text-gray-900 p-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-[#8B1A3A] font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button className="flex items-center justify-center space-x-2 bg-black text-white hover:bg-gray-800 transition-colors px-4 py-3 rounded-full text-sm font-medium w-full mt-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Ask Gemini</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
