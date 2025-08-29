// Service de gestion des notifications push pour ELAÏA Studio

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  url?: string;
  data?: any;
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'Notification' in window;
    this.init();
  }

  // Initialisation du service
  async init() {
    if (!this.isSupported) {
      console.log('Les notifications push ne sont pas supportées');
      return;
    }

    try {
      // Enregistrer le service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker enregistré avec succès');

      // Demander la permission pour les notifications
      await this.requestPermission();

    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
    }
  }

  // Demander la permission pour les notifications
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Permission de notification accordée');
        return true;
      } else {
        console.log('Permission de notification refusée');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  // Vérifier si les notifications sont supportées
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  // Vérifier si la permission est accordée
  hasPermission(): boolean {
    return Notification.permission === 'granted';
  }

  // Obtenir le token pour les notifications push
  async getPushToken(): Promise<string | null> {
    if (!this.registration) return null;

    try {
      // Pour cet exemple, nous utilisons une clé VAPID fictive
      // En production, vous devriez utiliser votre propre clé VAPID
      const vapidKey = 'BKxSosSfnL8V1N5fX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X';

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
      });

      return JSON.stringify(subscription);
    } catch (error) {
      console.error('Erreur lors de la récupération du token push:', error);
      return null;
    }
  }

  // Envoyer une notification locale
  async showLocalNotification(data: NotificationData): Promise<void> {
    if (!this.hasPermission()) return;

    try {
      const options: NotificationOptions = {
        body: data.body,
        icon: data.icon || '/elaia-logo.svg',
        badge: data.badge || '/elaia-logo.svg',
        tag: data.tag || 'elaia-notification',
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        data: data.data || {},
      };

      await this.registration?.showNotification(data.title, options);
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification:', error);
    }
  }

  // Notifications prédéfinies pour ELAÏA Studio

  // Notification de réservation confirmée
  async notifyBookingConfirmed(className: string, date: string, time: string): Promise<void> {
    await this.showLocalNotification({
      title: 'Réservation confirmée !',
      body: `Votre cours ${className} est réservé pour le ${date} à ${time}`,
      tag: 'booking-confirmed',
      requireInteraction: true,
      url: '/bookings',
    });
  }

  // Rappel de cours (1 heure avant)
  async notifyClassReminder(className: string, time: string): Promise<void> {
    await this.showLocalNotification({
      title: 'Rappel de cours',
      body: `Votre cours ${className} commence dans 1 heure (${time})`,
      tag: 'class-reminder',
      requireInteraction: false,
      url: '/schedule',
    });
  }

  // Annulation de cours
  async notifyClassCancelled(className: string, date: string): Promise<void> {
    await this.showLocalNotification({
      title: 'Cours annulé',
      body: `Le cours ${className} du ${date} a été annulé`,
      tag: 'class-cancelled',
      requireInteraction: true,
      url: '/schedule',
    });
  }

  // Crédits ajoutés
  async notifyCreditsAdded(amount: number): Promise<void> {
    await this.showLocalNotification({
      title: 'Crédits ajoutés',
      body: `${amount} crédits ont été ajoutés à votre compte`,
      tag: 'credits-added',
      requireInteraction: false,
      url: '/profile',
    });
  }

  // Crédits insuffisants
  async notifyLowCredits(currentCredits: number, requiredCredits: number): Promise<void> {
    await this.showLocalNotification({
      title: 'Crédits insuffisants',
      body: `Il vous faut ${requiredCredits} crédits mais vous n'en avez que ${currentCredits}`,
      tag: 'low-credits',
      requireInteraction: true,
      url: '/buy-credits',
    });
  }

  // Nouvelle offre/promotion
  async notifyNewOffer(title: string, description: string): Promise<void> {
    await this.showLocalNotification({
      title: 'Nouvelle offre',
      body: `${title}: ${description}`,
      tag: 'new-offer',
      requireInteraction: false,
      url: '/pricing',
    });
  }

  // Fermer toutes les notifications
  async closeAllNotifications(): Promise<void> {
    if (!this.registration) return;

    const notifications = await this.registration.getNotifications();
    notifications.forEach(notification => notification.close());
  }

  // Utilitaire pour convertir une clé VAPID
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Instance singleton du service
export const notificationService = new NotificationService();

// Hook React pour utiliser les notifications
export const useNotifications = () => {
  const requestPermission = () => notificationService.requestPermission();
  const hasPermission = () => notificationService.hasPermission();
  const isSupported = () => notificationService.isNotificationSupported();

  return {
    requestPermission,
    hasPermission,
    isSupported,
    notifyBookingConfirmed: notificationService.notifyBookingConfirmed.bind(notificationService),
    notifyClassReminder: notificationService.notifyClassReminder.bind(notificationService),
    notifyClassCancelled: notificationService.notifyClassCancelled.bind(notificationService),
    notifyCreditsAdded: notificationService.notifyCreditsAdded.bind(notificationService),
    notifyLowCredits: notificationService.notifyLowCredits.bind(notificationService),
    notifyNewOffer: notificationService.notifyNewOffer.bind(notificationService),
  };
};
