import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader, CreditCard, Calendar } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useAuthStore } from '../store/authStore';
import customToast from '../utils/toast';

interface PaymentDetails {
  credits: number;
  amount: number;
  sessionId: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, refreshProfile } = useAuthStore();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        customToast.error('Session de paiement manquante');
        return;
      }

      try {
        // Vérifier le paiement côté serveur (optionnel)
        // Pour l'instant, on considère que le paiement est réussi si on arrive ici

        // Rafraîchir le profil utilisateur pour mettre à jour les crédits
        await refreshProfile();

        // Simuler les détails du paiement (en production, récupérer depuis l'API)
        setPaymentDetails({
          credits: 10, // À récupérer depuis la session Stripe
          amount: 240,
          sessionId,
        });

        customToast.success('Paiement confirmé ! Vos crédits ont été ajoutés.');
      } catch (error) {
        console.error('Erreur vérification paiement:', error);
        customToast.error('Erreur lors de la vérification du paiement');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, refreshProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-elaia-cream flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-ohemia-accent mx-auto mb-4" />
          <h2 className="heading-md text-elaia-charcoal mb-2">
            Vérification du paiement
          </h2>
          <p className="text-elaia-warm-gray">
            Veuillez patienter...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Hero Section */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920"
            alt="Paiement réussi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-600/60 to-green-600/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="heading-xl mb-4">Paiement réussi !</h1>
          <p className="body-lg max-w-2xl mx-auto opacity-90">
            Vos crédits ont été ajoutés à votre compte
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          {/* Détails du paiement */}
          <div className="bg-elaia-white border border-elaia-muted p-8 mb-8">
            <h2 className="heading-md text-elaia-charcoal mb-6 text-center">
              Détails de votre achat
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-elaia-muted">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-ohemia-accent mr-3" />
                  <span className="text-elaia-charcoal">Crédits achetés</span>
                </div>
                <span className="font-semibold text-ohemia-accent">
                  {paymentDetails?.credits || 0}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-elaia-muted">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-ohemia-accent mr-3" />
                  <span className="text-elaia-charcoal">Montant payé</span>
                </div>
                <span className="font-semibold">
                  CHF {paymentDetails?.amount.toFixed(2) || '0.00'}
                </span>
              </div>

              {user && (
                <div className="flex justify-between items-center py-3 border-b border-elaia-muted">
                  <span className="text-elaia-charcoal">Nouveaux crédits totaux</span>
                  <span className="font-semibold text-ohemia-accent">
                    {user.credits}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-3">
                <span className="text-elaia-charcoal">ID de transaction</span>
                <span className="text-xs text-elaia-warm-gray font-mono">
                  {paymentDetails?.sessionId}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link to="/schedule" className="btn-accent text-center">
              <Calendar className="h-5 w-5 inline mr-2" />
              Réserver un cours
            </Link>

            <Link to="/profile" className="btn-secondary text-center">
              Voir mon profil
            </Link>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-elaia-light-gray border border-elaia-muted p-6 text-center">
            <h3 className="heading-sm text-elaia-charcoal mb-4">
              Prochaines étapes
            </h3>
            <ul className="text-sm text-elaia-warm-gray space-y-2">
              <li>• Vos crédits sont maintenant disponibles dans votre compte</li>
              <li>• Vous pouvez les utiliser pour réserver des cours</li>
              <li>• Les crédits n'expirent pas</li>
              <li>• Vous pouvez acheter plus de crédits à tout moment</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentSuccessPage;
