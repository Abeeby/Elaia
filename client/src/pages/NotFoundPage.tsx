import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-elaia-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair text-elaia-charcoal mb-2">ELAÏA</h1>
          <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray">STUDIO</p>
        </div>

        {/* 404 */}
        <div className="mb-8">
          <h2 className="text-8xl font-playfair text-elaia-charcoal mb-4">404</h2>
          <h3 className="text-2xl font-playfair text-elaia-charcoal mb-4">Page non trouvée</h3>
          <p className="text-elaia-warm-gray mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-elaia-charcoal text-white font-inter uppercase tracking-wider hover:bg-elaia-charcoal/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <div className="text-center">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Page précédente
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-elaia-muted">
          <h4 className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-4">
            Pages populaires
          </h4>
          <div className="space-y-2">
            <Link to="/courses" className="block text-sm text-elaia-warm-gray hover:text-elaia-charcoal transition-colors">
              Nos cours
            </Link>
            <Link to="/schedule" className="block text-sm text-elaia-warm-gray hover:text-elaia-charcoal transition-colors">
              Planning
            </Link>
            <Link to="/pricing" className="block text-sm text-elaia-warm-gray hover:text-elaia-charcoal transition-colors">
              Tarifs
            </Link>
            <Link to="/contact" className="block text-sm text-elaia-warm-gray hover:text-elaia-charcoal transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
