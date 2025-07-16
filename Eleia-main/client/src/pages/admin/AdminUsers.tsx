import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, CreditCard, Plus, RefreshCw, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  credits_remaining: number;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [creditsToAdd, setCreditsToAdd] = useState<number>(10);
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Récupérer la liste des utilisateurs
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users-credits'],
    queryFn: adminService.getUsersWithCredits,
  });

  // Mutation pour ajouter des crédits
  const addCreditsMutation = useMutation({
    mutationFn: ({ userEmail, credits }: { userEmail: string; credits: number }) =>
      adminService.addCredits(userEmail, credits),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-credits'] });
      setNotification({
        type: 'success',
        message: data.message || 'Crédits ajoutés avec succès !'
      });
      setShowAddCreditsModal(false);
      setSelectedUser('');
      setCreditsToAdd(10);
      setTimeout(() => setNotification(null), 5000);
    },
    onError: (error: ApiError) => {
      setNotification({
        type: 'error',
        message: error.response?.data?.error || 'Erreur lors de l\'ajout des crédits'
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  const handleAddCredits = () => {
    if (!selectedUser || creditsToAdd <= 0) {
      setNotification({
        type: 'error',
        message: 'Veuillez sélectionner un utilisateur et saisir un nombre de crédits valide'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    addCreditsMutation.mutate({
      userEmail: selectedUser,
      credits: creditsToAdd
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'client':
        return 'Client';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'client':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-elaia-gray mb-2">
            Gestion des utilisateurs et crédits
          </h1>
          <p className="text-lg text-elaia-gray">
            Gérez les comptes utilisateurs et ajoutez des crédits
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Actions rapides */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => setShowAddCreditsModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter des crédits</span>
          </button>
          
          <button
            onClick={() => refetch()}
            className="btn-secondary flex items-center space-x-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Liste des utilisateurs */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-elaia-gray flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Utilisateurs ({users?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-elaia-gold" />
              <p className="text-elaia-gray">Chargement des utilisateurs...</p>
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crédits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-elaia-gold flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-elaia-gold mr-2" />
                          <span className="text-lg font-semibold text-elaia-gray">
                            {user.credits_remaining}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">crédits</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedUser(user.email);
                            setShowAddCreditsModal(true);
                          }}
                          className="text-elaia-gold hover:text-elaia-green flex items-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Ajouter crédits</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>

        {/* Modal d'ajout de crédits */}
        {showAddCreditsModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Ajouter des crédits
                  </h3>
                  <button
                    onClick={() => setShowAddCreditsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Sélection utilisateur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Utilisateur
                    </label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elaia-gold"
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {users?.map((user: User) => (
                        <option key={user.id} value={user.email}>
                          {user.first_name} {user.last_name} ({user.email}) - {user.credits_remaining} crédits
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nombre de crédits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de crédits à ajouter
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={creditsToAdd}
                      onChange={(e) => setCreditsToAdd(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-elaia-gold"
                      placeholder="Nombre de crédits"
                    />
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleAddCredits}
                      disabled={addCreditsMutation.isPending}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addCreditsMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Ajouter
                    </button>
                    <button
                      onClick={() => setShowAddCreditsModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 