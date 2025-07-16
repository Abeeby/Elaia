import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Calendar, CreditCard, Activity, Award, Clock, Euro } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { adminService } from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  // Récupérer les statistiques
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
  });

  // Récupérer les réservations récentes
  const { data: recentBookings } = useQuery({
    queryKey: ['admin-recent-bookings'],
    queryFn: () => adminService.getBookings({ limit: 5 }),
  });

  // Récupérer les nouveaux clients
  const { data: newClients } = useQuery({
    queryKey: ['admin-new-clients'],
    queryFn: () => adminService.getClients({ 
      registered_after: format(startOfMonth(new Date()), 'yyyy-MM-dd') 
    }),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-elaia-gray mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-lg text-elaia-gray">
            Vue d'ensemble de l'activité d'Elaïa Studio
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-elaia-gray">Chargement des statistiques...</p>
          </div>
        ) : (
          <>
            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Clients actifs */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-elaia-gold" />
                  <span className={`text-sm font-medium ${
                    stats?.growth?.active_clients > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats?.growth?.active_clients > 0 ? '+' : ''}{stats?.growth?.active_clients}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-elaia-gray">
                  {stats?.active_clients || 0}
                </p>
                <p className="text-sm text-gray-600">Clients actifs</p>
              </div>

              {/* Revenus du mois */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <Euro className="h-8 w-8 text-elaia-green" />
                  <span className={`text-sm font-medium ${
                    stats?.growth?.revenue > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats?.growth?.revenue > 0 ? '+' : ''}{stats?.growth?.revenue}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-elaia-gray">
                  {formatCurrency(stats?.revenue_this_month || 0)}
                </p>
                <p className="text-sm text-gray-600">Revenus ce mois</p>
              </div>

              {/* Réservations du mois */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="h-8 w-8 text-elaia-mint" />
                  <span className={`text-sm font-medium ${
                    stats?.growth?.bookings > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats?.growth?.bookings > 0 ? '+' : ''}{stats?.growth?.bookings}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-elaia-gray">
                  {stats?.bookings_this_month || 0}
                </p>
                <p className="text-sm text-gray-600">Réservations ce mois</p>
              </div>

              {/* Taux d'occupation */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-8 w-8 text-elaia-rose" />
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-elaia-gray">
                  {stats?.occupancy_rate || 0}%
                </p>
                <p className="text-sm text-gray-600">Taux d'occupation</p>
              </div>
            </div>

            {/* Graphiques et tableaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Statistiques détaillées */}
              <div className="card">
                <h2 className="text-xl font-semibold text-elaia-gray mb-6">
                  Statistiques détaillées
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Nouveaux clients ce mois</span>
                    <span className="font-semibold text-elaia-gray">
                      {stats?.new_clients_this_month || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Taux de rétention</span>
                    <span className="font-semibold text-elaia-gray">
                      {stats?.retention_rate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Moyenne de séances/client</span>
                    <span className="font-semibold text-elaia-gray">
                      {stats?.avg_sessions_per_client?.toFixed(1) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Crédits vendus ce mois</span>
                    <span className="font-semibold text-elaia-gray">
                      {stats?.credits_sold_this_month || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600">Abonnements actifs</span>
                    <span className="font-semibold text-elaia-gray">
                      {stats?.active_subscriptions || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top des cours */}
              <div className="card">
                <h2 className="text-xl font-semibold text-elaia-gray mb-6">
                  Cours les plus populaires
                </h2>
                {stats?.popular_classes && stats.popular_classes.length > 0 ? (
                  <div className="space-y-4">
                    {stats.popular_classes.map((cls: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${
                            index === 0 ? 'bg-elaia-gold' : 
                            index === 1 ? 'bg-elaia-green' : 
                            'bg-elaia-rose'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-elaia-gray">{cls.name}</p>
                            <p className="text-sm text-gray-600">{cls.instructor}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-elaia-gray">{cls.bookings}</p>
                          <p className="text-sm text-gray-600">réservations</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>

            {/* Réservations récentes */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-elaia-gray">
                  Réservations récentes
                </h2>
                <Link to="/admin/bookings" className="text-sm text-elaia-gold hover:text-elaia-green">
                  Voir tout
                </Link>
              </div>
              
              {recentBookings && recentBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentBookings.map((booking: any) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.client_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.client_email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.class_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(booking.start_time), 'dd/MM HH:mm')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  Aucune réservation récente
                </p>
              )}
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Link to="/admin/classes" className="card hover:shadow-lg transition-all text-center">
                <Calendar className="h-12 w-12 text-elaia-gold mx-auto mb-4" />
                <h3 className="font-semibold text-elaia-gray mb-2">Gérer le planning</h3>
                <p className="text-sm text-gray-600">Ajouter ou modifier des cours</p>
              </Link>
              
              <Link to="/admin/users" className="card hover:shadow-lg transition-all text-center">
                <Users className="h-12 w-12 text-elaia-green mx-auto mb-4" />
                <h3 className="font-semibold text-elaia-gray mb-2">Gérer les utilisateurs</h3>
                <p className="text-sm text-gray-600">Voir et gérer les crédits des utilisateurs</p>
              </Link>
              
              <Link to="/admin/reports" className="card hover:shadow-lg transition-all text-center">
                <TrendingUp className="h-12 w-12 text-elaia-mint mx-auto mb-4" />
                <h3 className="font-semibold text-elaia-gray mb-2">Rapports détaillés</h3>
                <p className="text-sm text-gray-600">Analyses et statistiques avancées</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 