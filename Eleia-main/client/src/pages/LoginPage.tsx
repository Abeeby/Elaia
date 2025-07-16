import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User } from 'lucide-react';
import customToast from '../utils/toast';
import { useAuthStore } from '../store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      customToast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      customToast.error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen bg-elaia-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <h1 className="text-4xl font-playfair text-elaia-charcoal">ELAÏA</h1>
          </Link>
          <h2 className="heading-md text-elaia-charcoal mb-2">
            Bon retour
          </h2>
          <p className="body-md text-elaia-warm-gray">
            Connectez-vous à votre espace personnel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label htmlFor="email" className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
              Email
            </label>
            <input
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide',
                },
              })}
              type="email"
              className="input-field"
              placeholder="votre@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
              Mot de passe
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Le mot de passe est requis',
                })}
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute bottom-3 right-0 text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm text-elaia-warm-gray mb-4">
            Nouveau chez ELAÏA ?
          </p>
          <Link
            to="/register"
            className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors"
          >
            Créer un compte
          </Link>
        </div>

        {/* Comptes de démonstration */}
        <div className="mt-12 p-6 bg-elaia-white border border-elaia-muted">
          <p className="text-xs font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
            Comptes de démonstration
          </p>
          <div className="space-y-2 text-sm text-elaia-warm-gray">
            <p>Admin : admin@elaiastudio.ch / admin123</p>
            <p>Client : marie.dupont@email.com / client123</p>
          </div>
        </div>
      </div>
    </div>
  );
} 