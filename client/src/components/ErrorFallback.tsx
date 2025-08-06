import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export default function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-elaia-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair text-elaia-charcoal mb-2">ELAÏA</h1>
          <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray">STUDIO</p>
        </div>

        {/* Error Icon */}
        <div className="mb-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-playfair text-elaia-charcoal mb-4">
            Une erreur s'est produite
          </h2>
          <p className="text-elaia-warm-gray mb-6">
            Nous nous excusons pour la gêne occasionnée. Une erreur technique est survenue.
          </p>
        </div>

        {/* Error Details (en mode développement) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-sm font-medium text-red-800 mb-2">Détails de l'erreur :</h3>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={resetError}
            className="inline-flex items-center gap-2 px-6 py-3 bg-elaia-charcoal text-white font-inter uppercase tracking-wider hover:bg-elaia-charcoal/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
          
          <div className="text-center">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-elaia-muted">
          <p className="text-xs text-elaia-warm-gray mb-4">
            Si le problème persiste, contactez-nous :
          </p>
          <div className="space-y-2">
            <a 
              href="mailto:contact@elaiastudio.ch"
              className="block text-sm text-elaia-charcoal hover:text-ohemia-accent transition-colors"
            >
              contact@elaiastudio.ch
            </a>
            <a 
              href="tel:+41791234567"
              className="block text-sm text-elaia-charcoal hover:text-ohemia-accent transition-colors"
            >
              +41 79 123 45 67
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
