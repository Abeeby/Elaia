import React from 'react';

interface GlobalLoaderProps {
  message?: string;
}

export default function GlobalLoader({ message = "Chargement..." }: GlobalLoaderProps) {
  return (
    <div className="fixed inset-0 bg-elaia-cream/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo animé */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair text-elaia-charcoal animate-pulse">ELAÏA</h1>
          <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray">STUDIO</p>
        </div>

        {/* Spinner */}
        <div className="mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-elaia-muted rounded-full animate-spin border-t-ohemia-accent mx-auto"></div>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-elaia-warm-gray font-inter">{message}</p>
      </div>
    </div>
  );
}
