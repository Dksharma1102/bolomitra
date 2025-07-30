import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { getAuth, onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";
import LoginForm from './LoginForm';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-700">
              <span className="text-coral-pink">Bolo</span> Mitra
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-slate-600 hover:text-coral-pink transition-colors duration-200 font-medium"
              >
                {item}
              </button>
            ))}
            
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-600 text-sm">Welcome, {user.displayName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-coral-pink hover:bg-coral-pink/90 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginForm(true)}
                className="bg-coral-pink hover:bg-coral-pink/90 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <User size={16} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 p-4 shadow-lg">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="block w-full text-left py-2 text-slate-600 hover:text-coral-pink transition-colors duration-200"
              >
                {item}
              </button>
            ))}
            
            {/* Mobile Auth Button */}
            {user ? (
              <div className="border-t border-slate-200 mt-4 pt-4">
                <div className="text-slate-600 text-sm mb-2">Welcome, {user.displayName || user.email}</div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-coral-pink hover:bg-coral-pink/90 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-200 mt-4 pt-4">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="w-full bg-coral-pink hover:bg-coral-pink/90 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <User size={16} />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Form Modal */}
      <LoginForm 
        isOpen={showLoginForm} 
        onClose={() => setShowLoginForm(false)} 
        onLogin={(userData) => {
          setShowLoginForm(false);
        }}
      />
    </nav>
  );
};

export default Navbar;