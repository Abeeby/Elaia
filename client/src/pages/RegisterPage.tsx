import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Check } from 'lucide-react';
import customToast from '../utils/toast';
import { useAuthStore } from '../store/authStore';
import DemoNotice from '../components/DemoNotice';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, acceptTerms, ...userData } = data;
      await registerUser(userData);
      customToast.success('Inscription réussie ! Bienvenue chez Elaïa Studio');
      navigate('/dashboard');
    } catch (error: any) {
      customToast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-elaia-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <h1 className="text-4xl font-playfair text-elaia-charcoal">ELAÏA</h1>
          </Link>
          <h2 className="heading-md text-elaia-charcoal mb-2">
        Créer votre compte
      </h2>
          <p className="body-md text-elaia-warm-gray">
            Rejoignez notre communauté et commencez votre transformation
      </p>
        </div>

      <DemoNotice />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-elaia-white border border-elaia-muted p-8">
        {/* Nom et Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
              Prénom
            </label>
            <input
              {...register('first_name', { required: 'Le prénom est requis' })}
              type="text"
                className="input-field"
              placeholder="Marie"
            />
            {errors.first_name && (
                <p className="mt-2 text-sm text-red-600">{errors.first_name.message}</p>
            )}
          </div>
          
          <div>
              <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
              Nom
            </label>
            <input
              {...register('last_name', { required: 'Le nom est requis' })}
              type="text"
                className="input-field"
              placeholder="Dupont"
            />
            {errors.last_name && (
                <p className="mt-2 text-sm text-red-600">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
            <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
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
            placeholder="marie.dupont@email.com"
          />
          {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
            <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
            Téléphone
          </label>
          <input
            {...register('phone', {
              required: 'Le téléphone est requis',
              pattern: {
                value: /^(\+41|0)[0-9]{9}$/,
                message: 'Format invalide (ex: +41791234567 ou 0791234567)',
              },
            })}
            type="tel"
              className="input-field"
            placeholder="+41 79 123 45 67"
          />
          {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
            <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
            Adresse
          </label>
          <input
            {...register('address', { required: 'L\'adresse est requise' })}
            type="text"
              className="input-field"
            placeholder="Rue de la Gare 10"
          />
          {errors.address && (
              <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Ville et Code postal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
              Ville
            </label>
            <input
              {...register('city', { required: 'La ville est requise' })}
              type="text"
                className="input-field"
              placeholder="Gland"
            />
            {errors.city && (
                <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
          
          <div>
              <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
              Code postal
            </label>
            <input
              {...register('postal_code', {
                required: 'Le code postal est requis',
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: 'Code postal invalide',
                },
              })}
              type="text"
                className="input-field"
              placeholder="1196"
            />
            {errors.postal_code && (
                <p className="mt-2 text-sm text-red-600">{errors.postal_code.message}</p>
            )}
          </div>
        </div>

        {/* Mot de passe */}
        <div>
            <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
            Mot de passe
          </label>
            <div className="relative">
            <input
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder="••••••••"
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

        {/* Confirmer le mot de passe */}
        <div>
            <label className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
            Confirmer le mot de passe
          </label>
            <div className="relative">
            <input
              {...register('confirmPassword', {
                required: 'Veuillez confirmer votre mot de passe',
                validate: value => value === password || 'Les mots de passe ne correspondent pas',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute bottom-3 right-0 text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
            >
              {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
              ) : (
                  <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Conditions générales */}
          <div className="border-t border-elaia-muted pt-6">
            <label className="flex items-start cursor-pointer">
          <input
            {...register('acceptTerms', {
              required: 'Vous devez accepter les conditions générales',
            })}
            type="checkbox"
                className="mt-1 h-4 w-4 text-ohemia-accent border-elaia-muted focus:ring-ohemia-accent"
          />
              <span className="ml-3 text-sm text-elaia-warm-gray">
            J'accepte les{' '}
                <Link to="/terms" className="text-elaia-charcoal hover:text-ohemia-accent transition-colors">
              conditions générales
            </Link>{' '}
            et la{' '}
                <Link to="/privacy" className="text-elaia-charcoal hover:text-ohemia-accent transition-colors">
              politique de confidentialité
            </Link>
              </span>
          </label>
        {errors.acceptTerms && (
              <p className="mt-2 text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}
          </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Inscription...' : 'Créer mon compte'}
        </button>
      </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-elaia-warm-gray mb-4">
            Déjà membre ?
          </p>
          <Link
            to="/login"
            className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors"
          >
          Se connecter
        </Link>
      </div>

      {/* Offre Welcome */}
        <div className="mt-8 p-6 bg-elaia-white border border-elaia-muted text-center">
          <div className="flex items-center justify-center mb-3">
            <Check className="h-5 w-5 text-ohemia-accent mr-2" />
            <p className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal">
              Offre Welcome
            </p>
          </div>
          <p className="text-sm text-elaia-warm-gray">
            1 séance achetée + 2 offertes pour 45 CHF seulement
          </p>
        </div>
      </div>
    </div>
  );
} 