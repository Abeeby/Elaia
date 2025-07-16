import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, isPast, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, MapPin, AlertCircle, Check, X } from 'lucide-react';
import { bookingService } from '../services/api';
import customToast from '../utils/toast';

interface Booking {
  id: number;
  class_id: number;
  start_time: string;
  end_time: string;
  class_type_name: string;
  credits_used: number;
  status: string;
  instructor_first_name?: string;
  instructor_last_name?: string;
}

export default function BookingsPage() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Récupérer les réservations
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings', selectedTab],
    queryFn: () => bookingService.getMyBookings({ 
      timeframe: selectedTab === 'upcoming' ? 'future' : 'past' 
    }),
  });

  // Mutation pour annuler une réservation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-bookings'] });
      customToast.success('Réservation annulée avec succès');
      setCancellingId(null);
    },
    onError: (error: any) => {
      customToast.error(error.response?.data?.message || 'Erreur lors de l\'annulation');
      setCancellingId(null);
    },
  });

  const handleCancelBooking = (booking: Booking) => {
    const hoursUntilClass = differenceInHours(new Date(booking.start_time), new Date());
    
    if (hoursUntilClass < 12) {
      customToast.error(`Annulation impossible : le cours commence dans ${hoursUntilClass}h (minimum 12h requis)`);
      return;
    }

    setCancellingId(booking.id);
  };

  const confirmCancel = (bookingId: number) => {
    cancelMutation.mutate(bookingId.toString());
  };

  const getStatusBadge = (booking: Booking) => {
    if (booking.status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="h-3 w-3 mr-1" />
          Annulé
        </span>
      );
    }
    
    if (isPast(new Date(booking.start_time))) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="h-3 w-3 mr-1" />
          Terminé
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock className="h-3 w-3 mr-1" />
        À venir
      </span>
    );
  };

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-elaia-gray mb-2">
            Mes réservations
          </h1>
          <p className="text-lg text-elaia-gray">
            Gérez vos séances de Pilates Reformer
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-1 inline-flex mb-8">
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              selectedTab === 'upcoming'
                ? 'bg-elaia-gold text-white'
                : 'text-elaia-gray hover:bg-gray-100'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              selectedTab === 'past'
                ? 'bg-elaia-gold text-white'
                : 'text-elaia-gray hover:bg-gray-100'
            }`}
          >
            Historique
          </button>
        </div>

        {/* Liste des réservations */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-elaia-gray">Chargement de vos réservations...</p>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: Booking) => {
              const classDate = new Date(booking.start_time);
              const canCancel = selectedTab === 'upcoming' && 
                               booking.status === 'confirmed' &&
                               differenceInHours(classDate, new Date()) >= 12;

              return (
                <div key={booking.id} className="card hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-elaia-gray">
                          {booking.class_type_name}
                        </h3>
                        {getStatusBadge(booking)}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(classDate, 'EEEE d MMMM yyyy', { locale: fr })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(classDate, 'HH:mm')} - {format(new Date(booking.end_time), 'HH:mm')}
                        </div>
                        {booking.instructor_first_name && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Avec {booking.instructor_first_name} {booking.instructor_last_name}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center">
                        <span className="text-sm font-medium text-elaia-gold">
                          {booking.credits_used} crédits utilisés
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {canCancel && (
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Annuler la réservation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {selectedTab === 'upcoming' 
                ? 'Aucune réservation à venir' 
                : 'Aucun historique de réservation'}
            </p>
            {selectedTab === 'upcoming' && (
              <a href="/schedule" className="btn-primary">
                Réserver une séance
              </a>
            )}
          </div>
        )}

        {/* Note d'information */}
        {selectedTab === 'upcoming' && bookings && bookings.length > 0 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Politique d'annulation</p>
                <p>
                  Les réservations peuvent être annulées jusqu'à 12 heures avant le début du cours. 
                  Au-delà de ce délai, les crédits seront perdus.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation d'annulation */}
      {cancellingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-elaia-gray mb-4">
              Confirmer l'annulation
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir annuler cette réservation ? 
              Vos crédits vous seront remboursés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancellingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-elaia-gray hover:bg-gray-50"
              >
                Non, garder
              </button>
              <button
                onClick={() => confirmCancel(cancellingId)}
                disabled={cancelMutation.isPending}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Annulation...' : 'Oui, annuler'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 