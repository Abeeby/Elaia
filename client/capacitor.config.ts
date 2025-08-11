import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elaia.studio',
  appName: 'ELAÏA Studio',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    // En développement, pointer vers localhost
    // En production, remplacer par votre URL API
    url: process.env.NODE_ENV === 'production' 
      ? 'https://api.elaiastudio.ch' 
      : undefined
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#F5F3F0",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#6B46C1"
    },
    Keyboard: {
      resize: "body",
      style: "light",
      resizeOnFullScreen: true
    }
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: false,
    limitsNavigationsGestures: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;