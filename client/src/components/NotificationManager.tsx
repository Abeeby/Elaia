import React, { useEffect, useState } from 'react';
import { Bell, X, Settings } from 'lucide-react';
import { useNotifications } from '../services/notificationService';
import { useAuthStore } from '../store/authStore';
import customToast from '../utils/toast';

const NotificationManager: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const {
    requestPermission,
    hasPermission,
    isSupported,
    notifyBookingConfirmed,
    notifyClassReminder,
    notifyCreditsAdded,
  } = useNotifications();

  useEffect(() => {
    // Vérifier le statut des notifications au montage
    if (isSupported()) {
      setIsEnabled(hasPermission());

      // Écouter les changements de permission
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' }).then((result) => {
          setIsEnabled(result.state === 'granted');

          result.addEventListener('change', () => {
            setIsEnabled(result.state === 'granted');
          });
        });
      }
    }
  }, [isSupported, hasPermission]);

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    setIsEnabled(granted);

    if (granted) {
      customToast.success('Notifications activées !');
      // Notification de test
      await notifyBookingConfirmed(
        'Pilates Reformer Débutant',
        '15 décembre 2024',
        '09:00'
      );
    } else {
      customToast.error('Permission de notification refusée');
    }
  };

  const handleTestNotification = async (type: string) => {
    if (!isEnabled) {
      customToast.error('Activez d\'abord les notifications');
      return;
    }

    switch (type) {
      case 'booking':
        await notifyBookingConfirmed(
          'Pilates Reformer Intermédiaire',
          '20 décembre 2024',
          '10:30'
        );
        customToast.success('Notification de réservation envoyée');
        break;
      case 'reminder':
        await notifyClassReminder('Yoga Flow', '14:00');
        customToast.success('Rappel de cours envoyé');
        break;
      case 'credits':
        await notifyCreditsAdded(10);
        customToast.success('Notification de crédits envoyée');
        break;
    }
  };

  // Ne pas afficher si non supporté ou non authentifié
  if (!isSupported() || !isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Bouton de notification dans la navbar */}
      <button
        onClick={() => setIsVisible(true)}
        className={`relative p-2 rounded-full transition-colors ${
          isEnabled
            ? 'text-ohemia-accent hover:bg-elaia-light-gray'
            : 'text-elaia-warm-gray hover:bg-elaia-light-gray animate-pulse'
        }`}
        title={isEnabled ? 'Notifications activées' : 'Activer les notifications'}
      >
        <Bell className="h-5 w-5" />
        {!isEnabled && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Modal de gestion des notifications */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-elaia-white max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="heading-md text-elaia-charcoal mb-2">
                  Notifications
                </h3>
                <p className="text-sm text-elaia-warm-gray">
                  Restez informé de vos réservations et cours
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Statut des notifications */}
              <div className="flex items-center justify-between p-4 border border-elaia-muted">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-elaia-charcoal mr-3" />
                  <div>
                    <div className="font-semibold text-elaia-charcoal">
                      Notifications push
                    </div>
                    <div className="text-sm text-elaia-warm-gray">
                      {isEnabled ? 'Activées' : 'Désactivées'}
                    </div>
                  </div>
                </div>
                <div className={`h-3 w-3 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>

              {/* Bouton d'activation */}
              {!isEnabled && (
                <button
                  onClick={handleEnableNotifications}
                  className="w-full btn-accent"
                >
                  <Bell className="h-5 w-5 inline mr-2" />
                  Activer les notifications
                </button>
              )}

              {/* Types de notifications */}
              {isEnabled && (
                <div className="space-y-3">
                  <h4 className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal">
                    Types de notifications
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-elaia-light-gray">
                      <span className="text-sm text-elaia-charcoal">
                        Confirmation de réservation
                      </span>
                      <button
                        onClick={() => handleTestNotification('booking')}
                        className="text-xs text-ohemia-accent hover:text-elaia-charcoal"
                      >
                        Tester
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-elaia-light-gray">
                      <span className="text-sm text-elaia-charcoal">
                        Rappels de cours (1h avant)
                      </span>
                      <button
                        onClick={() => handleTestNotification('reminder')}
                        className="text-xs text-ohemia-accent hover:text-elaia-charcoal"
                      >
                        Tester
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-elaia-light-gray">
                      <span className="text-sm text-elaia-charcoal">
                        Crédits ajoutés
                      </span>
                      <button
                        onClick={() => handleTestNotification('credits')}
                        className="text-xs text-ohemia-accent hover:text-elaia-charcoal"
                      >
                        Tester
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="text-xs text-elaia-warm-gray space-y-2">
              <div className="flex items-start">
                <div className="w-1 h-1 bg-elaia-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Les notifications sont stockées localement sur votre appareil</span>
              </div>
              <div className="flex items-start">
                <div className="w-1 h-1 bg-elaia-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Vous pouvez désactiver les notifications dans les paramètres de votre navigateur</span>
              </div>
              <div className="flex items-start">
                <div className="w-1 h-1 bg-elaia-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Fonctionne même lorsque l'application n'est pas ouverte</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationManager;
