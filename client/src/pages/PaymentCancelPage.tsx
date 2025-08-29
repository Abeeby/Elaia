import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard, Calendar } from 'lucide-react';

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Hero Section */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920"
            alt="Paiement annulé"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/60 to-red-600/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <XCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="heading-xl mb-4">Paiement annulé</h1>
          <p className="body-lg max-w-2xl mx-auto opacity-90">
            Aucun montant n'a été débité de votre compte
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          {/* Message principal */}
          <div className="bg-elaia-white border border-elaia-muted p-8 mb-8 text-center">
            <h2 className="heading-md text-elaia-charcoal mb-4">
              Votre paiement a été annulé
            </h2>
            <p className="text-elaia-warm-gray mb-6">
              Vous pouvez reprendre votre achat à tout moment ou contacter notre équipe
              si vous avez rencontré un problème.
            </p>

            <div className="flex items-center justify-center text-elaia-warm-gray mb-6">
              <XCircle className="h-12 w-12 text-red-500 mr-4" />
              <div>
                <div className="font-semibold text-elaia-charcoal">Aucun débit</div>
                <div className="text-sm">Votre carte n'a pas été débitée</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link to="/buy-credits" className="btn-accent text-center">
              <CreditCard className="h-5 w-5 inline mr-2" />
              Réessayer l'achat
            </Link>

            <Link to="/schedule" className="btn-secondary text-center">
              <Calendar className="h-5 w-5 inline mr-2" />
              Voir le planning
            </Link>
          </div>

          {/* Informations */}
          <div className="bg-elaia-light-gray border border-elaia-muted p-6">
            <h3 className="heading-sm text-elaia-charcoal mb-4 text-center">
              Pourquoi le paiement a-t-il été annulé ?
            </h3>

            <div className="space-y-3 text-sm text-elaia-warm-gray">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-elaia-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Vous avez quitté la page de paiement avant de finaliser</span>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-elaia-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Il y a eu un problème technique temporaire</span>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-elaia-sage rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Vous avez changé d'avis concernant l'achat</span>
              </div>
            </div>

            <hr className="my-6 border-elaia-muted" />

            <div className="text-center">
              <p className="text-sm text-elaia-warm-gray mb-4">
                Besoin d'aide ? Notre équipe est là pour vous accompagner
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center text-ohemia-accent hover:text-elaia-charcoal transition-colors"
              >
                Contactez-nous
              </Link>
            </div>
          </div>

          {/* Retour */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentCancelPage;
