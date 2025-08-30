import { useEffect } from 'react';

export function initializeMobileApp() {
  // Mobile app functionality temporarily disabled for build
  console.log('Mobile app initialization disabled for build compatibility');
  return;
}

// Mobile App Hook
export function useMobileApp() {
  useEffect(() => {
    initializeMobileApp();
  }, []);
}

// Mobile utilities (disabled for build)
export const mobileUtils = {
  isNative: false,
  platform: 'web',
  // Additional mobile utilities can be added here when Capacitor is properly configured
};

export default {
  initializeMobileApp,
  useMobileApp,
  mobileUtils
};