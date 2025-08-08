import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
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
    setValue
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

  const fillDemoAccount = (type: 'admin' | 'client') => {
    if (type === 'admin') {
      setValue('email', 'admin@elaiastudio.ch');
      setValue('password', 'admin123');
    } else {
      setValue('email', 'marie.dupont@email.com');
      setValue('password', 'client123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200"
          alt="Pilates Studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-elaia-charcoal/80 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-playfair mb-4">
            Bienvenue dans votre espace bien-être
          </h2>
          <p className="text-lg opacity-90">
            Accédez à vos réservations, suivez vos progrès et gérez votre abonnement en toute simplicité.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-16 bg-elaia-cream">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-block mb-12">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-playfair text-elaia-charcoal">ELAÏA</span>
              <span className="text-xs font-inter uppercase tracking-[0.2em] text-elaia-warm-gray">STUDIO</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-playfair text-elaia-charcoal mb-3">
              Connexion
            </h1>
            <p className="text-elaia-warm-gray">
              Accédez à votre compte pour continuer
            </p>
          </div>

          {/* Demo accounts */}
            <div className="mb-8 p-4 bg-elaia-white/50 rounded-lg border border-elaia-muted">
            <p className="text-xs font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
              Comptes de démonstration
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="flex-1 px-4 py-2 bg-elaia-charcoal text-white text-sm rounded hover:bg-elaia-charcoal/90 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('client')}
                className="flex-1 px-4 py-2 bg-ohemia-accent text-white text-sm rounded hover:bg-ohemia-accent/90 transition-colors"
              >
                Client
              </button>
              </div>
              <p className="text-[11px] text-elaia-warm-gray mt-3">Utilisez ces identifiants en démo si l'auth n'est pas configurée.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-elaia-charcoal mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-elaia-warm-gray" />
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-elaia-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-ohemia-accent focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-elaia-charcoal mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-elaia-warm-gray" />
                <input
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-elaia-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-ohemia-accent focus:border-transparent transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-ohemia-accent border-elaia-muted rounded focus:ring-ohemia-accent"
                />
                <span className="ml-2 text-sm text-elaia-warm-gray">Se souvenir de moi</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-ohemia-accent hover:text-ohemia-accent/80 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-elaia-charcoal text-white py-3 rounded-lg font-medium hover:bg-elaia-charcoal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {isLoading ? (
                'Connexion en cours...'
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 space-y-3">
            <p className="text-sm text-center text-elaia-warm-gray">Comptes de démonstration :</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'demo@example.com');
                  setValue('password', 'demo123');
                }}
                className="px-4 py-2 bg-elaia-sand/20 text-elaia-charcoal rounded-lg text-sm hover:bg-elaia-sand/30 transition-colors"
              >
                Client démo
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'admin@example.com');
                  setValue('password', 'admin123');
                }}
                className="px-4 py-2 bg-elaia-sage/20 text-elaia-charcoal rounded-lg text-sm hover:bg-elaia-sage/30 transition-colors"
              >
                Admin démo
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-elaia-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-elaia-cream text-elaia-warm-gray">Nouveau chez ELAÏA ?</span>
            </div>
          </div>

          {/* Sign up link */}
          <Link
            to="/register"
            className="block w-full text-center py-3 border border-elaia-charcoal text-elaia-charcoal rounded-lg font-medium hover:bg-elaia-charcoal hover:text-white transition-all"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
} 