import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CreditCard, Calendar, TrendingUp, Package, AlertCircle, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { creditService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function SubscriptionPage() {
  const { user } = useAuthStore();

  // Récupérer l'abonnement actuel
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: creditService.getMySubscription,
  });

  // Récupérer l'historique des crédits
  const { data: creditHistory } = useQuery({
    queryKey: ['credit-history'],
    queryFn: creditService.getCreditHistory,
  });

  const subscription = subscriptionData?.subscription;
  const stats = subscription?.usage_stats;

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-elaia-gray mb-2">
            Mon abonnement
          </h1>
          <p className="text-lg text-elaia-gray">
            Gérez votre abonnement et vos crédits
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-elaia-gray">Chargement...</p>
          </div>
        ) : subscription ? (
          <>
            {/* Abonnement actuel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Carte principale */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-elaia-gray mb-2">
                        {subscription.plan_name}
                      </h2>
                      <p className="text-gray-600">{subscription.plan_description}</p>
                    </div>
                    <Package className="h-8 w-8 text-elaia-gold" />
                  </div>

                  {/* Détails de l'abonnement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {subscription.plan_type === 'credits' ? (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Crédits restants</p>
                          <p className="text-3xl font-bold text-elaia-gold">
                            {subscription.credits_remaining}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            sur {subscription.total_credits} crédits
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Valable jusqu'au</p>
                          <p className="text-lg font-semibold text-elaia-gray">
                            {format(new Date(subscription.end_date), 'dd MMMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Type d'abonnement</p>
                          <p className="text-lg font-semibold text-elaia-gray">
                            Mensuel
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {subscription.max_bookings_per_week} séances/semaine
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Prochain renouvellement</p>
                          <p className="text-lg font-semibold text-elaia-gray">
                            {format(new Date(subscription.next_renewal_date), 'dd MMMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Barre de progression pour les crédits */}
                  {subscription.plan_type === 'credits' && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Utilisation des crédits</span>
                        <span>{subscription.total_credits - subscription.credits_remaining} / {subscription.total_credits}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-elaia-gold to-elaia-green h-3 rounded-full transition-all"
                          style={{ 
                            width: `${((subscription.total_credits - subscription.credits_remaining) / subscription.total_credits) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link to="/pricing" className="btn-primary">
                      Renouveler / Changer d'offre
                    </Link>
                    <button className="btn-secondary">
                      Mettre en pause
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="space-y-6">
                {/* Ce mois-ci */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="h-6 w-6 text-elaia-green" />
                    <span className="text-sm text-gray-600">Ce mois</span>
                  </div>
                  <p className="text-2xl font-bold text-elaia-gray mb-1">
                    {stats?.total_bookings || 0} séances
                  </p>
                  <p className="text-sm text-gray-600">
                    {stats?.credits_used || 0} crédits utilisés
                  </p>
                </div>

                {/* Total */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="h-6 w-6 text-elaia-gold" />
                    <span className="text-sm text-gray-600">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-elaia-gray mb-1">
                    {stats?.total_sessions_all_time || 0} séances
                  </p>
                  <p className="text-sm text-gray-600">
                    Depuis votre inscription
                  </p>
                </div>
              </div>
            </div>

            {/* Historique des crédits */}
            <div className="card">
              <h3 className="text-xl font-semibold text-elaia-gray mb-6">
                Historique des crédits
              </h3>
              
              {creditHistory && creditHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Crédits
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {creditHistory.map((transaction: any) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(transaction.created_at), 'dd/MM/yyyy', { locale: fr })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type === 'credit' ? 'Crédit' : 'Débit'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  Aucun historique de transaction
                </p>
              )}
            </div>
          </>
        ) : (
          /* Pas d'abonnement */
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-elaia-gray mb-2">
                Aucun abonnement actif
              </h2>
              <p className="text-gray-600 mb-6">
                Découvrez nos offres et commencez votre pratique du Pilates
              </p>
              <Link to="/pricing" className="btn-primary">
                Voir nos offres
              </Link>
            </div>
          </div>
        )}

        {/* Informations importantes */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Bon à savoir</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Les crédits non utilisés expirent à la date de fin de validité</li>
                <li>Vous pouvez mettre votre abonnement en pause une fois par an (maximum 30 jours)</li>
                <li>Les abonnements mensuels se renouvellent automatiquement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 