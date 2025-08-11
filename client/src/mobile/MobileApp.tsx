import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';

export function initializeMobileApp() {
  // Ne s'exécute que sur mobile
  if (!Capacitor.isNativePlatform()) return;

  // Configuration de la StatusBar
  const setupStatusBar = async () => {
    try {
      await StatusBar.setStyle({ style: 'light' });
      await StatusBar.setBackgroundColor({ color: '#6B46C1' });
    } catch (error) {
      console.log('StatusBar non disponible:', error);
    }
  };

  // Configuration du SplashScreen
  const setupSplashScreen = async () => {
    try {
      await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (error) {
      console.log('SplashScreen non disponible:', error);
    }
  };

  // Configuration des notifications push
  const setupPushNotifications = async () => {
    try {
      // Demander la permission
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('Permission notifications refusée');
        return;
      }

      // S'enregistrer pour les notifications
      await PushNotifications.register();

      // Écouter l'enregistrement
      PushNotifications.addListener('registration', (token) => {
        console.log('Push token:', token.value);
        // Envoyer le token au serveur
        localStorage.setItem('pushToken', token.value);
      });

      // Écouter les notifications reçues
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notification reçue:', notification);
      });

      // Écouter les clics sur notifications
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Notification cliquée:', notification);
        // Naviguer vers la page appropriée
      });
    } catch (error) {
      console.log('Push notifications non disponibles:', error);
    }
  };

  // Gestion du bouton retour Android
  const setupBackButton = () => {
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapApp.exitApp();
      } else {
        window.history.back();
      }
    });
  };

  // Initialiser tout
  setupStatusBar();
  setupSplashScreen();
  setupPushNotifications();
  setupBackButton();
}

// Hook React pour utiliser dans les composants
export function useMobileFeatures() {
  useEffect(() => {
    initializeMobileApp();

    // Nettoyer les listeners au démontage
    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
        CapApp.removeAllListeners();
      }
    };
  }, []);

  return {
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform(),
  };
}
