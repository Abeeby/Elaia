import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, CreditCard, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import customToast from '../../utils/toast';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    customToast.success('Déconnexion réussie');
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Cours', href: '/courses' },
    { name: 'Planning', href: '/schedule' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-elaia-beige">
      {/* Bandeau promo */}
      {location.pathname === '/' && (
        <div className="bg-elaia-charcoal text-white py-2 text-center text-sm fixed top-0 left-0 right-0 z-50">
          <p>🎉 Offre spéciale : -20% sur tous les abonnements jusqu'au 31 janvier</p>
        </div>
      )}
      
      {/* Header */}
      <header className={`bg-elaia-white shadow-sm sticky ${location.pathname === '/' ? 'top-[40px]' : 'top-0'} z-40 transition-all`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-playfair text-elaia-charcoal">ELAÏA</span>
                <span className="hidden sm:block text-xs font-inter uppercase tracking-[0.2em] text-elaia-warm-gray">STUDIO</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-inter uppercase tracking-wider transition-colors ${
                      isActive(item.href)
                        ? 'text-elaia-charcoal border-b-2 border-ohemia-accent'
                        : 'text-elaia-warm-gray hover:text-elaia-charcoal'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  {/* Quick Links */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="p-2 text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
                      title="Administration"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="p-2 text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
                    title="Tableau de bord"
                  >
                    <Calendar className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/profile"
                    className="p-2 text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
                    title="Profil"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  
                  {/* User info */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-elaia-muted">
                    <div className="text-right">
                      <p className="text-sm font-medium text-elaia-charcoal">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-elaia-warm-gray">
                        {(user as any).credits || 0} crédits
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
                      title="Déconnexion"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-elaia-charcoal text-white text-sm font-inter uppercase tracking-wider hover:bg-elaia-charcoal/90 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-elaia-white border-t border-elaia-muted">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive(item.href)
                      ? 'text-elaia-charcoal bg-elaia-light-gray'
                      : 'text-elaia-warm-gray hover:text-elaia-charcoal hover:bg-elaia-light-gray'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile auth section */}
            <div className="border-t border-elaia-muted px-4 py-4">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-elaia-charcoal">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-elaia-warm-gray">
                        {(user as any).credits || 0} crédits
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-elaia-warm-gray hover:text-elaia-charcoal"
                      >
                        Administration
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-elaia-warm-gray hover:text-elaia-charcoal"
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-elaia-warm-gray hover:text-elaia-charcoal"
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-elaia-warm-gray hover:text-elaia-charcoal"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-center text-sm font-medium text-elaia-charcoal hover:text-ohemia-accent"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-center bg-elaia-charcoal text-white text-sm font-medium hover:bg-elaia-charcoal/90"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-elaia-charcoal text-elaia-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-playfair">ELAÏA</h3>
              <p className="text-sm text-elaia-white/80">
                Votre studio de Pilates et Yoga à Gland, pour une transformation holistique du corps et de l'esprit.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-inter uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-elaia-white/80 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-inter uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/courses" className="text-sm text-elaia-white/80 hover:text-white transition-colors">
                    Cours collectifs
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-elaia-white/80 hover:text-white transition-colors">
                    Abonnements
                  </Link>
                </li>
                <li>
                  <Link to="/schedule" className="text-sm text-elaia-white/80 hover:text-white transition-colors">
                    Planning
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-inter uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-elaia-white/80">
                <li>Rue de la Gare 15</li>
                <li>1196 Gland, Suisse</li>
                <li className="pt-2">
                  <a href="tel:+41791234567" className="hover:text-white transition-colors">
                    +41 79 123 45 67
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@elaiastudio.ch" className="hover:text-white transition-colors">
                    contact@elaiastudio.ch
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-elaia-white/20 text-center text-sm text-elaia-white/60">
            <p>&copy; 2024 ELAÏA Studio. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 