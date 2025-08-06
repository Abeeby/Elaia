import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import customToast from '../utils/toast';

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message: string;
}

export function useErrorHandler() {
  const navigate = useNavigate();

  const handleError = useCallback((error: ApiError | Error) => {
    console.error('Error occurred:', error);

    // Si c'est une erreur d'API
    if ('response' in error && error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          customToast.error('Session expirée, veuillez vous reconnecter');
          navigate('/login');
          break;
        case 403:
          customToast.error('Accès non autorisé');
          navigate('/');
          break;
        case 404:
          customToast.error('Ressource non trouvée');
          break;
        case 422:
          customToast.error(data?.message || 'Données invalides');
          break;
        case 429:
          customToast.error('Trop de tentatives, veuillez patienter');
          break;
        case 500:
          customToast.error('Erreur serveur, veuillez réessayer plus tard');
          break;
        default:
          customToast.error(data?.message || data?.error || 'Une erreur est survenue');
      }
    } else {
      // Erreur générique
      customToast.error(error.message || 'Une erreur inattendue est survenue');
    }
  }, [navigate]);

  const handleAsyncError = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    customErrorMessage?: string
  ): Promise<T | null> => {
    try {
      return await asyncFunction();
    } catch (error) {
      if (customErrorMessage) {
        customToast.error(customErrorMessage);
      } else {
        handleError(error as ApiError);
      }
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
}
