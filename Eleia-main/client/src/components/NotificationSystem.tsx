import { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, Info, Calendar, CreditCard, Star } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'booking' | 'credit' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
  booking: Calendar,
  credit: CreditCard,
  achievement: Star,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  booking: 'bg-elaia-beige border-elaia-gold text-elaia-gray',
  credit: 'bg-purple-50 border-purple-200 text-purple-800',
  achievement: 'bg-gold-50 border-gold-200 text-gold-800',
};

const iconColorMap = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
  booking: 'text-elaia-gold',
  credit: 'text-purple-600',
  achievement: 'text-yellow-500',
};

export default function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  const [animatingOut, setAnimatingOut] = useState<Set<string>>(new Set());

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications]);

  const handleDismiss = (id: string) => {
    setAnimatingOut(prev => new Set(prev).add(id));
    setTimeout(() => {
      onDismiss(id);
      setAnimatingOut(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type];
        const isAnimatingOut = animatingOut.has(notification.id);
        
        return (
          <div
            key={notification.id}
            className={`
              pointer-events-auto
              transform transition-all duration-300 ease-in-out
              ${isAnimatingOut 
                ? 'translate-x-full opacity-0 scale-95' 
                : 'translate-x-0 opacity-100 scale-100'
              }
              ${colorMap[notification.type]}
              border rounded-lg shadow-lg p-4
              hover:shadow-xl
              animate-slide-in-right
            `}
            style={{
              animation: isAnimatingOut ? 'slideOutRight 0.3s ease-in-out' : 'slideInRight 0.3s ease-in-out'
            }}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${iconColorMap[notification.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-xs font-medium underline hover:no-underline"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => handleDismiss(notification.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Barre de progression pour les notifications avec durée */}
            {notification.duration && notification.duration > 0 && (
              <div className="mt-3 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-current opacity-50 rounded-full animate-progress"
                  style={{
                    animation: `progress ${notification.duration}ms linear forwards`
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Hook pour utiliser le système de notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'success', title, message, action });
  };

  const showError = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'error', title, message, action });
  };

  const showWarning = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'warning', title, message, action });
  };

  const showInfo = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'info', title, message, action });
  };

  const showBooking = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'booking', title, message, action });
  };

  const showCredit = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'credit', title, message, action });
  };

  const showAchievement = (title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'achievement', title, message, duration: 8000, action });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showBooking,
    showCredit,
    showAchievement,
  };
}

// Composant d'exemple pour les notifications en temps réel
export function NotificationExample() {
  const notifications = useNotifications();

  useEffect(() => {
    // Simulation de notifications en temps réel
    const intervals = [
      setTimeout(() => {
        notifications.showBooking(
          "Nouvelle réservation",
          "Marie D. a réservé un cours Pilates Reformer",
          {
            label: "Voir les détails",
            onClick: () => console.log("Voir réservation")
          }
        );
      }, 2000),

      setTimeout(() => {
        notifications.showAchievement(
          "Objectif atteint ! 🎉",
          "Vous avez complété 10 séances ce mois !",
          {
            label: "Voir mes stats",
            onClick: () => console.log("Voir statistiques")
          }
        );
      }, 5000),

      setTimeout(() => {
        notifications.showCredit(
          "Crédits bientôt expirés",
          "5 crédits expirent dans 7 jours",
          {
            label: "Réserver maintenant",
            onClick: () => console.log("Réserver cours")
          }
        );
      }, 8000),
    ];

    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <NotificationSystem 
      notifications={notifications.notifications}
      onDismiss={notifications.removeNotification}
    />
  );
} 