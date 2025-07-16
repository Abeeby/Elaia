import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Calendar, CreditCard, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import customToast from '../../utils/toast';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    customToast.success('Déconnexion réussie');
    navigate('/');
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Planning', href: '/schedule' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const userNavigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes réservations', href: '/bookings', icon: Calendar },
    { name: 'Mon abonnement', href: '/subscription', icon: CreditCard },
    { name: 'Mon profil', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-elaia-white shadow-sm' : 'bg-transparent'
      }`}>
        <nav className="container-custom">
          <div className="flex h-20 justify-between items-center">
              {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-playfair font-bold text-elaia-charcoal">ELAÏA</span>
              <span className="text-xs font-inter uppercase tracking-[0.2em] text-elaia-warm-gray">STUDIO</span>
              </Link>

            {/* Navigation desktop */}
            <div className="hidden lg:flex items-center space-x-10">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                  className="text-sm font-inter font-medium text-elaia-charcoal hover-underline uppercase tracking-wider transition-colors hover:text-ohemia-accent"
                  >
                    {item.name}
                  </Link>
                ))}

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative group ml-8">
                  <button className="flex items-center space-x-2 text-sm font-inter font-medium text-elaia-charcoal uppercase tracking-wider">
                    <span>{user?.first_name}</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                      </button>
                      
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-4 w-64 bg-elaia-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                    <div className="py-4">
                        {user?.role === 'admin' && (
                          <>
                            <Link
                              to="/admin"
                            className="flex items-center px-6 py-3 text-sm text-elaia-charcoal hover:bg-elaia-light-gray transition-colors"
                            >
                              <LayoutDashboard className="mr-3 h-4 w-4" />
                              Administration
                            </Link>
                          <div className="h-px bg-elaia-muted mx-6 my-2" />
                          </>
                        )}
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                          className="flex items-center px-6 py-3 text-sm text-elaia-charcoal hover:bg-elaia-light-gray transition-colors"
                          >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.name}
                          </Link>
                        ))}
                      <div className="h-px bg-elaia-muted mx-6 my-2" />
                        <button
                          onClick={handleLogout}
                        className="flex w-full items-center px-6 py-3 text-sm text-elaia-charcoal hover:bg-elaia-light-gray transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Déconnexion
                        </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-6 ml-8">
                  <Link 
                    to="/login" 
                    className="text-sm font-inter font-medium text-elaia-charcoal hover-underline uppercase tracking-wider"
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-xs"
                  >
                    Commencer
                  </Link>
                </div>
              )}
            </div>

            {/* Menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-elaia-charcoal"
              >
                {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
                ) : (
                <Menu className="h-6 w-6" />
                )}
              </button>
          </div>
        </nav>

        {/* Menu mobile panneau */}
        <div className={`lg:hidden fixed inset-0 bg-elaia-white z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-20">
            <div className="space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-2xl font-playfair text-elaia-charcoal hover:text-ohemia-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="h-px bg-elaia-muted my-8" />
              
            {isAuthenticated ? (
                <>
                  <div className="space-y-4">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                        className="block text-lg font-inter text-elaia-warm-gray hover:text-elaia-charcoal"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-6 text-lg font-inter text-elaia-warm-gray hover:text-elaia-charcoal"
                  >
                    Déconnexion
                  </button>
                </>
            ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="block text-lg font-inter text-elaia-warm-gray hover:text-elaia-charcoal"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Commencer
                  </Link>
                </div>
              )}
              </div>
          </div>
        </div>
      </header>

      {/* Spacer pour le header fixe */}
      <div className="h-20"></div>

      {/* Contenu principal */}
      <main>
        <Outlet />
      </main>

      {/* Footer moderne */}
      <footer className="bg-elaia-charcoal text-elaia-white">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo et description */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <span className="text-3xl font-playfair">ELAÏA</span>
                <span className="ml-2 text-xs font-inter uppercase tracking-[0.2em] text-elaia-sand">STUDIO</span>
              </div>
              <p className="text-elaia-muted font-light leading-relaxed max-w-md">
                Un espace unique dédié à votre bien-être et à votre transformation physique. 
                Découvrez le Pilates Reformer dans notre studio à Gland.
              </p>
            </div>

            {/* Navigation rapide */}
            <div>
              <h3 className="text-sm font-inter uppercase tracking-wider mb-6 text-elaia-sand">Navigation</h3>
              <div className="space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-elaia-muted hover:text-elaia-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-inter uppercase tracking-wider mb-6 text-elaia-sand">Contact</h3>
              <div className="space-y-3 text-sm text-elaia-muted">
                <p>
                  <a href="mailto:contact@elaia-studio.ch" className="hover:text-elaia-white transition-colors">
                    contact@elaia-studio.ch
                  </a>
                </p>
                <p>
                  <a href="tel:+41797181009" className="hover:text-elaia-white transition-colors">
                    079 718 10 09
                  </a>
                </p>
                <p className="pt-4">
                  Langues : FR • EN • ES • AL
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-elaia-warm-gray">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-elaia-muted">
                © 2025 Elaïa Studio. Tous droits réservés.
              </p>
              <div className="flex space-x-6 text-sm text-elaia-muted">
                <Link to="/legal" className="hover:text-elaia-white transition-colors">
                  Mentions légales
                </Link>
                <Link to="/faq" className="hover:text-elaia-white transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 