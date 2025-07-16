import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, CreditCard, TrendingUp, Clock, ChevronRight, Award, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from '../store/authStore';
import { bookingService, creditService } from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';

interface Booking {
  id: number;
  start_time: string;
  class_type_name: string;
  credits_used: number;
  status: string;
}

export default function DashboardPage() {
  const { user, subscription } = useAuthStore();

  // Récupérer les réservations à venir
  const { data: upcomingBookings } = useQuery({
    queryKey: ['upcoming-bookings'],
    queryFn: () => bookingService.getMyBookings({ timeframe: 'future' }),
  });

  // Récupérer l'historique récent
  const { data: recentBookings } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: () => bookingService.getMyBookings({ timeframe: 'past' }),
  });

  // Récupérer l'abonnement actuel
  const { data: subscriptionData } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: creditService.getMySubscription,
  });

  const currentSubscription = subscriptionData?.subscription || subscription;
  const nextBooking = upcomingBookings?.[0];
  const totalBookingsThisMonth = currentSubscription?.usage_stats?.total_bookings || 0;

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de bienvenue */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-elaia-gray mb-2">
            Bonjour {user?.first_name} !
          </h1>
          <p className="text-lg text-elaia-gray">
            Bienvenue dans votre espace personnel Elaïa Studio
          </p>
        </div>

        {/* Système de gamification rapide */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">🏆 Vos Achievements</h2>
              <p className="opacity-90">Continuez comme ça !</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                <AnimatedCounter end={85} suffix="%" />
              </div>
              <p className="text-sm opacity-90">Vers le niveau Expert</p>
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[120px]">
              <Award className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-sm font-medium">Série de 7</p>
              <p className="text-xs opacity-75">Séances</p>
            </div>
            <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[120px]">
              <Activity className="h-8 w-8 mx-auto mb-2 text-green-300" />
              <p className="text-sm font-medium">
                <AnimatedCounter end={450} />
              </p>
              <p className="text-xs opacity-75">Points Fidélité</p>
            </div>
            <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[120px]">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-300" />
              <p className="text-sm font-medium">Niveau 3</p>
              <p className="text-xs opacity-75">Passionné</p>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Crédits disponibles */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="h-8 w-8 text-elaia-gold" />
              <span className="text-2xl font-bold text-elaia-gray">
                {currentSubscription?.credits_remaining || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Crédits disponibles</h3>
            <Link to="/subscription" className="text-sm text-elaia-gold hover:text-elaia-green mt-2 inline-flex items-center">
              Gérer mon abonnement
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* Prochaine séance */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-elaia-green" />
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Prochaine séance</h3>
            {nextBooking ? (
              <div>
                <p className="font-semibold text-elaia-gray">
                  {format(new Date(nextBooking.start_time), 'dd MMM', { locale: fr })}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(nextBooking.start_time), 'HH:mm')} - {nextBooking.class_type_name}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Aucune séance prévue</p>
            )}
          </div>

          {/* Séances ce mois */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-elaia-mint" />
              <span className="text-2xl font-bold text-elaia-gray">
                {totalBookingsThisMonth}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Séances ce mois</h3>
            <p className="text-sm text-elaia-gold mt-2">
              Continuez comme ça !
            </p>
          </div>

          {/* Progression */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-elaia-gold" />
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Votre progression</h3>
            <p className="text-sm text-elaia-gray">
              {recentBookings?.length || 0} séances complétées
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Réserver une séance */}
          <div className="bg-gradient-to-r from-elaia-gold to-elaia-green rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Réserver votre prochaine séance</h2>
            <p className="mb-6 opacity-90">
              Découvrez notre planning et réservez votre cours de Pilates Reformer
            </p>
            <Link to="/schedule" className="inline-block bg-white text-elaia-gray px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all">
              Voir le planning
            </Link>
          </div>

          {/* Abonnement actuel */}
          <div className="card">
            <h2 className="text-xl font-semibold text-elaia-gray mb-4">Votre abonnement</h2>
            {currentSubscription ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Formule</span>
                  <span className="font-medium text-elaia-gray">{currentSubscription.plan_name}</span>
                </div>
                {currentSubscription.plan_type === 'credits' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crédits restants</span>
                    <span className="font-medium text-elaia-gold">
                      {currentSubscription.credits_remaining} crédits
                    </span>
                  </div>
                )}
                {currentSubscription.end_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valable jusqu'au</span>
                    <span className="font-medium text-elaia-gray">
                      {format(new Date(currentSubscription.end_date), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link to="/subscription" className="btn-primary w-full text-center">
                    Gérer mon abonnement
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas d'abonnement actif
                </p>
                <Link to="/pricing" className="btn-primary w-full text-center">
                  Découvrir nos offres
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Prochaines réservations */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-elaia-gray">Vos prochaines séances</h2>
            <Link to="/bookings" className="text-sm text-elaia-gold hover:text-elaia-green">
              Voir tout
            </Link>
          </div>
          
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking: Booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-elaia-gray">{booking.class_type_name}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(booking.start_time), 'EEEE d MMMM à HH:mm', { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-elaia-gold font-medium">
                      {booking.credits_used} crédits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune séance prévue</p>
              <Link to="/schedule" className="btn-primary">
                Réserver une séance
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 