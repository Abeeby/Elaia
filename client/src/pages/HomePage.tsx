import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bienvenue chez ELAÏA Studio
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Version de débogage - Animations désactivées
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/courses"
            className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark"
          >
            Voir les cours
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
} 