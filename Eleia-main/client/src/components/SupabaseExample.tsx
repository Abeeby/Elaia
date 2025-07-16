import React from 'react';
import { useClassSchedule, useBookings, useCurrentUser } from '../hooks/useSupabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from '../utils/toast';

// Exemple d'utilisation des hooks Supabase
export const SupabaseExample: React.FC = () => {
  const { user, loading: userLoading } = useCurrentUser();
  const { classes, loading: classesLoading, error } = useClassSchedule();
  const { bookings, createBooking, cancelBooking } = useBookings();

  const handleBooking = async (classSessionId: string) => {
    try {
      await createBooking(classSessionId);
      toast.success('Réservation confirmée !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réservation');
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success('Réservation annulée');
    } catch (error) {
      toast.error('Erreur lors de l\'annulation');
    }
  };

  if (userLoading || classesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Informations utilisateur */}
      {user && (
        <div className="mb-8 p-6 bg-light-gray rounded-lg">
          <h2 className="heading-md mb-4">Mon Profil</h2>
          <p className="body-md">
            <strong>Nom :</strong> {user.first_name} {user.last_name}
          </p>
          <p className="body-md">
            <strong>Email :</strong> {user.email}
          </p>
          <p className="body-md">
            <strong>Crédits disponibles :</strong> {user.credits}
          </p>
        </div>
      )}

      {/* Planning des cours */}
      <div className="mb-8">
        <h2 className="heading-lg mb-6">Planning des cours</h2>
        <div className="grid gap-4">
          {classes.map((session) => {
            const isBooked = bookings.some(
              b => b.class_session_id === session.id && b.status === 'confirmed'
            );

            return (
              <div
                key={session.id}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="heading-sm mb-2">
                      {session.class_types?.name}
                    </h3>
                    <p className="body-sm text-warm-gray mb-1">
                      {format(new Date(session.start_time), 'EEEE d MMMM à HH:mm', { locale: fr })}
                    </p>
                    <p className="body-sm text-warm-gray">
                      Durée : {session.class_types?.duration} minutes
                    </p>
                    <p className="body-sm text-warm-gray">
                      Places disponibles : {session.available_spots}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="body-sm font-medium mb-2">
                      {session.class_types?.credits_required} crédits
                    </p>
                    {user && (
                      isBooked ? (
                        <span className="text-sm text-sage-green font-medium">
                          ✓ Réservé
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBooking(session.id)}
                          className="btn-primary"
                          disabled={session.available_spots === 0}
                        >
                          {session.available_spots === 0 ? 'Complet' : 'Réserver'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mes réservations */}
      {user && bookings.length > 0 && (
        <div>
          <h2 className="heading-lg mb-6">Mes réservations</h2>
          <div className="grid gap-4">
            {bookings
              .filter(b => b.status === 'confirmed')
              .map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-cream rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {booking.class_sessions?.class_types?.name}
                    </p>
                    <p className="text-sm text-warm-gray">
                      {format(
                        new Date(booking.class_sessions?.start_time || ''),
                        'EEEE d MMMM à HH:mm',
                        { locale: fr }
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Annuler
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}; 