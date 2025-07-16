import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Lock, Save, Camera } from 'lucide-react';
import customToast from '../utils/toast';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/api';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      postal_code: user?.postal_code || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      const response = await authService.updateProfile(data);
      updateUser(response.user);
      customToast.success('Profil mis à jour avec succès');
      setIsEditingProfile(false);
    } catch (error: any) {
      customToast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      customToast.success('Mot de passe modifié avec succès');
      setIsChangingPassword(false);
      resetPassword();
    } catch (error: any) {
      customToast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    resetProfile();
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    resetPassword();
  };

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-elaia-gray mb-2">
            Mon profil
          </h1>
          <p className="text-lg text-elaia-gray">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Photo de profil */}
        <div className="card mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-elaia-gold rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100">
                <Camera className="h-4 w-4 text-elaia-gray" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-elaia-gray">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-elaia-gold mt-1">
                Membre depuis {new Date(user?.created_at || '').toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-elaia-gray">
              Informations personnelles
            </h3>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-elaia-gold hover:text-elaia-green"
              >
                Modifier
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    {...registerProfile('first_name', { required: 'Le prénom est requis' })}
                    type="text"
                    className="input-field"
                  />
                  {profileErrors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    {...registerProfile('last_name', { required: 'Le nom est requis' })}
                    type="text"
                    className="input-field"
                  />
                  {profileErrors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...registerProfile('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  type="email"
                  className="input-field"
                />
                {profileErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  {...registerProfile('phone', {
                    required: 'Le téléphone est requis',
                    pattern: {
                      value: /^(\+41|0)[0-9]{9}$/,
                      message: 'Format invalide',
                    },
                  })}
                  type="tel"
                  className="input-field"
                />
                {profileErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  {...registerProfile('address', { required: 'L\'adresse est requise' })}
                  type="text"
                  className="input-field"
                />
                {profileErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    {...registerProfile('city', { required: 'La ville est requise' })}
                    type="text"
                    className="input-field"
                  />
                  {profileErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    {...registerProfile('postal_code', {
                      required: 'Le code postal est requis',
                      pattern: {
                        value: /^[0-9]{4}$/,
                        message: 'Code postal invalide',
                      },
                    })}
                    type="text"
                    className="input-field"
                  />
                  {profileErrors.postal_code && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.postal_code.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={cancelProfileEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-3" />
                <span className="font-medium mr-2">Nom complet:</span>
                {user?.first_name} {user?.last_name}
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-3" />
                <span className="font-medium mr-2">Email:</span>
                {user?.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-3" />
                <span className="font-medium mr-2">Téléphone:</span>
                {user?.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                <span className="font-medium mr-2">Adresse:</span>
                {user?.address}, {user?.postal_code} {user?.city}
              </div>
            </div>
          )}
        </div>

        {/* Sécurité */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-elaia-gray flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Sécurité
            </h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="text-elaia-gold hover:text-elaia-green"
              >
                Changer le mot de passe
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  {...registerPassword('currentPassword', { required: 'Le mot de passe actuel est requis' })}
                  type="password"
                  className="input-field"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  {...registerPassword('newPassword', {
                    required: 'Le nouveau mot de passe est requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères',
                    },
                  })}
                  type="password"
                  className="input-field"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  {...registerPassword('confirmPassword', {
                    required: 'Veuillez confirmer le mot de passe',
                    validate: value => value === newPassword || 'Les mots de passe ne correspondent pas',
                  })}
                  type="password"
                  className="input-field"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary">
                  Changer le mot de passe
                </button>
                <button
                  type="button"
                  onClick={cancelPasswordChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">
              Dernière modification : {new Date(user?.updated_at || '').toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 