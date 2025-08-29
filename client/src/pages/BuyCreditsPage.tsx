import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Star, Check, Loader, ArrowLeft } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useAuthStore } from '../store/authStore';
import customToast from '../utils/toast';

const BuyCreditsPage = () => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [customCredits, setCustomCredits] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Packs de crédits disponibles
  const creditPacks = [
    {
      id: 'pack-5',
      credits: 5,
      price: 125,
      originalPrice: 150,
      name: 'Pack Découverte',
      description: 'Idéal pour essayer nos cours',
      popular: false,
    },
    {
      id: 'pack-10',
      credits: 10,
      price: 240,
      originalPrice: 300,
      name: 'Pack Régulier',
      description: '2 cours par semaine',
      popular: true,
    },
    {
      id: 'pack-30',
      credits: 30,
      price: 660,
      originalPrice: 900,
      name: 'Pack Intense',
      description: 'Cours intensif sur 2 mois',
      popular: false,
    },
    {
      id: 'pack-50',
      credits: 50,
      price: 1000,
      originalPrice: 1250,
      name: 'Pack Annuel',
      description: 'Cours illimités pendant 1 an',
      popular: false,
    },
  ];

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId);
    setCustomCredits('');
  };

  const handleCustomCreditsChange = (value: string) => {
    setCustomCredits(value);
    setSelectedPack(null);
  };

  const getSelectedCredits = () => {
    if (selectedPack) {
      const pack = creditPacks.find(p => p.id === selectedPack);
      return pack?.credits || 0;
    }
    return parseInt(customCredits) || 0;
  };

  const getSelectedAmount = () => {
    const credits = getSelectedCredits();
    return paymentService.calculateCreditsPrice(credits);
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      customToast.error('Veuillez vous connecter pour acheter des crédits');
      navigate('/login');
      return;
    }

    const credits = getSelectedCredits();
    if (credits <= 0) {
      customToast.error('Veuillez sélectionner un nombre de crédits valide');
      return;
    }

    setIsProcessing(true);
    try {
      const amount = getSelectedAmount();

      // Créer la session de paiement
      const response = await paymentService.createPaymentSession(credits, amount);

      if (response.success) {
        // Rediriger vers Payrexx Checkout
        await paymentService.redirectToCheckout(response.url);
      } else {
        throw new Error(response.message || 'Erreur lors de la création du paiement');
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      customToast.error('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Hero Section */}
      <section className="relative h-[25vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920"
            alt="Achat de crédits"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-elaia-charcoal/60 to-elaia-charcoal/40"></div>
        </div>

        <div className="relative z-10 text-center text-elaia-white px-6">
          <h1 className="heading-xl mb-4">Acheter des Crédits</h1>
          <p className="body-lg max-w-2xl mx-auto opacity-90">
            Réservez vos cours de Pilates en toute simplicité
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </button>
          </div>

          {/* Crédits actuels */}
          {isAuthenticated && user && (
            <div className="bg-elaia-white border border-elaia-muted p-6 mb-8 text-center">
              <div className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-2">
                Vos crédits actuels
              </div>
              <div className="text-3xl font-playfair text-ohemia-accent">
                {user.credits}
              </div>
            </div>
          )}

          {/* Packs de crédits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                onClick={() => handlePackSelect(pack.id)}
                className={`relative cursor-pointer border-2 p-6 transition-all ${
                  selectedPack === pack.id
                    ? 'border-ohemia-accent bg-ohemia-accent/5'
                    : 'border-elaia-muted bg-elaia-white hover:border-elaia-sage'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-ohemia-accent text-elaia-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                      Plus populaire
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="heading-md text-elaia-charcoal mb-2">{pack.name}</h3>
                  <p className="text-elaia-warm-gray mb-4">{pack.description}</p>

                  <div className="mb-4">
                    <div className="text-3xl font-playfair text-ohemia-accent mb-1">
                      {pack.credits} crédits
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-semibold text-elaia-charcoal">
                        CHF {pack.price}
                      </span>
                      <span className="text-sm text-elaia-warm-gray line-through">
                        CHF {pack.originalPrice}
                      </span>
                    </div>
                    <div className="text-xs text-ohemia-accent mt-1">
                      Économisez CHF {pack.originalPrice - pack.price}
                    </div>
                  </div>

                  <div className="text-xs text-elaia-warm-gray">
                    CHF {(pack.price / pack.credits).toFixed(1)} par crédit
                  </div>

                  {selectedPack === pack.id && (
                    <div className="mt-4">
                      <Check className="h-6 w-6 text-ohemia-accent mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Montant personnalisé */}
          <div className="bg-elaia-white border border-elaia-muted p-6 mb-8">
            <h3 className="heading-md text-elaia-charcoal mb-4 text-center">
              Montant personnalisé
            </h3>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-2">
                  Nombre de crédits
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customCredits}
                  onChange={(e) => handleCustomCreditsChange(e.target.value)}
                  className="w-full px-4 py-3 border border-elaia-muted focus:border-ohemia-accent outline-none"
                  placeholder="Ex: 15"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-2">
                  Montant total
                </label>
                <div className="px-4 py-3 bg-elaia-cream border border-elaia-muted text-elaia-charcoal font-semibold">
                  CHF {customCredits ? getSelectedAmount().toFixed(2) : '0.00'}
                </div>
              </div>
            </div>

            {customCredits && parseInt(customCredits) > 0 && (
              <div className="mt-4 text-center text-sm text-elaia-warm-gray">
                CHF {(getSelectedAmount() / parseInt(customCredits)).toFixed(2)} par crédit
              </div>
            )}
          </div>

          {/* Résumé et paiement */}
          <div className="bg-elaia-white border border-elaia-muted p-8">
            <h3 className="heading-md text-elaia-charcoal mb-6 text-center">
              Résumé de votre achat
            </h3>

            {getSelectedCredits() > 0 ? (
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-elaia-charcoal">Crédits</span>
                  <span className="font-semibold">{getSelectedCredits()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-elaia-charcoal">Prix par crédit</span>
                  <span>CHF {(getSelectedAmount() / getSelectedCredits()).toFixed(2)}</span>
                </div>
                <hr className="border-elaia-muted" />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-elaia-charcoal">Total</span>
                  <span className="text-ohemia-accent">CHF {getSelectedAmount().toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-elaia-warm-gray mb-8">
                Sélectionnez un pack ou saisissez un nombre de crédits
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing || getSelectedCredits() <= 0}
              className="w-full btn-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payer avec Payrexx
                </>
              )}
            </button>

            <div className="mt-4 text-center text-xs text-elaia-warm-gray">
              Paiement sécurisé par Payrexx • Remboursement sous 24h minimum
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyCreditsPage;
