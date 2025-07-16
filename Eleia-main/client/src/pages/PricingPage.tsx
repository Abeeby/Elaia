import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, TrendingUp, Heart, Target, Gift, Users, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { creditService } from '../services/api';

export default function PricingPage() {
  const [selectedTab, setSelectedTab] = useState<'decouverte' | 'credits' | 'abonnements'>('decouverte');
  
  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: creditService.getPlans,
  });

  const creditPlans = plans?.filter((plan: any) => plan.type === 'credits') || [];
  const monthlyPlans = plans?.filter((plan: any) => plan.type === 'monthly') || [];

  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1540206063137-4a88ca974d1a?w=1920" 
            alt="Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-elaia-charcoal/60 to-elaia-charcoal/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-elaia-white px-6">
          <h1 className="heading-xl mb-4">Nos Tarifs & Offres</h1>
          <p className="body-lg max-w-2xl mx-auto opacity-90">
            Du premier essai à l'abonnement premium, trouvez la formule qui vous convient
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-20 z-30 bg-elaia-white shadow-sm">
        <div className="container-custom py-6">
          <div className="flex justify-center">
            <div className="inline-flex border-b-2 border-elaia-muted">
            <button
                onClick={() => setSelectedTab('decouverte')}
                className={`px-8 py-4 text-sm font-inter font-medium flex items-center gap-2 transition-all ${
                  selectedTab === 'decouverte'
                    ? 'text-elaia-charcoal border-b-2 border-elaia-charcoal -mb-[2px]'
                    : 'text-elaia-warm-gray hover:text-elaia-charcoal'
                }`}
              >
                <span className="text-ohemia-accent">☀️</span> Découverte
            </button>
            <button
              onClick={() => setSelectedTab('credits')}
                className={`px-8 py-4 text-sm font-inter font-medium transition-all ${
                selectedTab === 'credits'
                    ? 'text-elaia-charcoal border-b-2 border-elaia-charcoal -mb-[2px]'
                    : 'text-elaia-warm-gray hover:text-elaia-charcoal'
              }`}
            >
              Formules à crédits
            </button>
            <button
                onClick={() => setSelectedTab('abonnements')}
                className={`px-8 py-4 text-sm font-inter font-medium transition-all ${
                  selectedTab === 'abonnements'
                    ? 'text-elaia-charcoal border-b-2 border-elaia-charcoal -mb-[2px]'
                    : 'text-elaia-warm-gray hover:text-elaia-charcoal'
              }`}
            >
              Abonnements mensuels
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
        {/* Info crédits */}
          {selectedTab !== 'decouverte' && (
            <div className="text-center mb-16">
              <p className="body-md text-elaia-warm-gray">
                <span className="text-elaia-charcoal font-semibold">Pilates Reformer (PF)</span> : 3 crédits · 
                <span className="text-elaia-charcoal font-semibold ml-4">Pilates Yoga Mat (PYM)</span> : 2 crédits
            </p>
          </div>
        )}

          {/* Découverte Section */}
          {selectedTab === 'decouverte' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Pack Découverte */}
              <div className="group relative">
                <div className="absolute -top-3 left-8 bg-ohemia-sage text-elaia-white px-4 py-1 text-xs font-inter uppercase tracking-wider rounded-full flex items-center gap-2">
                  <span>⭐</span> Premium
                  </div>
                <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-8">
                    <h3 className="heading-sm text-elaia-charcoal mb-2">
                      Pack Découverte - 5 crédits
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl font-playfair text-ohemia-accent">125</span>
                      <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                  </div>
                    <p className="text-sm text-elaia-warm-gray mb-4">
                      5 crédits
                    </p>
                    <p className="text-sm text-elaia-warm-gray mb-2">
                      Environ 1 PF à 75.0 CHF<br/>
                      ou 2 PYM à 50.0 CHF
                    </p>
                    <p className="text-sm text-elaia-warm-gray mb-4">
                      Idéal pour tester différents cours
                    </p>
                    <p className="text-xs text-elaia-warm-gray flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Valable 2 mois
                    </p>
                  </div>

                  <Link 
                    to="/register" 
                    className="btn-primary text-center mt-auto"
                  >
                    Acheter
                  </Link>
              </div>
            </div>

              {/* Pack Annuel */}
              <div className="group relative">
                <div className="absolute -top-3 right-8 bg-ohemia-accent text-elaia-white px-4 py-1 text-xs font-inter uppercase tracking-wider rounded-full">
                  -15%
                    </div>
                <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-8">
                    <h3 className="heading-sm text-elaia-charcoal mb-2">
                      Pack Annuel - 100 crédits
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl font-playfair text-ohemia-accent">2200</span>
                      <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                    </div>
                    <p className="text-sm text-elaia-warm-gray mb-4">
                      100 crédits
                    </p>
                    <p className="text-sm text-elaia-warm-gray mb-2">
                      Environ 33 PF à 66.0 CHF<br/>
                      ou 50 PYM à 44.0 CHF
                    </p>
                    <p className="text-sm text-elaia-warm-gray mb-4">
                      Maximum d'économies pour les assidus
                    </p>
                    <p className="text-xs text-elaia-warm-gray flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Valable 12 mois
                    </p>
                    </div>

                    <Link 
                      to="/register" 
                    className="btn-primary text-center mt-auto"
                    >
                    Acheter
                    </Link>
                </div>
            </div>

              <div className="col-span-full text-center mt-8">
                <p className="text-sm text-elaia-warm-gray">
                  *Frais d'adhésion unique à vie : 120 CHF (offerts pour les formules Premium+)
                </p>
              </div>
            </div>
          )}

          {/* Formules à crédits Section */}
          {selectedTab === 'credits' && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="heading-lg text-elaia-charcoal mb-4">
                  Formules à crédits
                </h2>
          </div>

              {/* Display credit plans from API */}
              {!isLoading && creditPlans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {creditPlans.map((plan: any) => {
                  const creditsNum = plan.credits || 0;
                    const pricePerCredit = (plan.price / creditsNum).toFixed(2);
                    const popular = creditsNum === 30 || creditsNum === 50;
                  
                  return (
                      <div key={plan.id} className="group relative">
                        {popular && (
                          <div className="absolute -top-3 left-8 bg-ohemia-sage text-elaia-white px-4 py-1 text-xs font-inter uppercase tracking-wider rounded-full">
                            ⭐ Premium
                        </div>
                      )}
                        <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                          <div className="mb-8">
                            <h3 className="heading-sm text-elaia-charcoal mb-2">
                          {plan.name}
                        </h3>
                            <div className="mb-6">
                              <span className="text-5xl font-playfair text-ohemia-accent">{plan.price}</span>
                              <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                            </div>
                            <p className="text-sm text-elaia-warm-gray mb-4">
                          {creditsNum} crédits
                        </p>
                            <p className="text-sm text-elaia-warm-gray mb-2">
                              {pricePerCredit} CHF par crédit
                        </p>
                            <p className="text-sm text-elaia-warm-gray mb-4">
                          {plan.description}
                        </p>
                        {plan.validity && (
                              <p className="text-xs text-elaia-warm-gray flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Valable {plan.validity}
                          </p>
                        )}
                          </div>

                        <Link 
                          to="/register" 
                          className="btn-primary text-center mt-auto"
                        >
                          Acheter
                        </Link>
                      </div>
                    </div>
                  );
                })}
                        </div>
                      )}

              {/* Default credit plans if no API data */}
              {!isLoading && creditPlans.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* 10 crédits */}
                  <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="mb-8">
                      <h3 className="heading-sm text-elaia-charcoal mb-2">
                        Pack 10 crédits
                      </h3>
                      <div className="mb-6">
                        <span className="text-5xl font-playfair text-ohemia-accent">240</span>
                        <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                      </div>
                      <p className="text-sm text-elaia-warm-gray mb-4">
                        10 crédits
                      </p>
                      <p className="text-sm text-elaia-warm-gray mb-2">
                        24.00 CHF par crédit
                      </p>
                      <p className="text-sm text-elaia-warm-gray mb-4">
                        Pour une pratique occasionnelle
                      </p>
                      <p className="text-xs text-elaia-warm-gray flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Valable 3 mois
                      </p>
                    </div>

                    <Link to="/register" className="btn-primary text-center mt-auto">
                      Acheter
                    </Link>
                  </div>

                  {/* 30 crédits */}
                  <div className="group relative">
                    <div className="absolute -top-3 left-8 bg-ohemia-sage text-elaia-white px-4 py-1 text-xs font-inter uppercase tracking-wider rounded-full">
                      ⭐ Premium
                    </div>
                    <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="mb-8">
                        <h3 className="heading-sm text-elaia-charcoal mb-2">
                          Pack 30 crédits
                        </h3>
                        <div className="mb-6">
                          <span className="text-5xl font-playfair text-ohemia-accent">660</span>
                          <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                        </div>
                        <p className="text-sm text-elaia-warm-gray mb-4">
                          30 crédits
                        </p>
                        <p className="text-sm text-elaia-warm-gray mb-2">
                          22.00 CHF par crédit
                        </p>
                        <p className="text-sm text-elaia-warm-gray mb-4">
                          Pour une pratique régulière
                        </p>
                        <p className="text-xs text-elaia-warm-gray flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Valable 6 mois
                        </p>
                      </div>

                      <Link to="/register" className="btn-primary text-center mt-auto">
                        Acheter
                      </Link>
                    </div>
                  </div>

                  {/* 50 crédits */}
                  <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="mb-8">
                      <h3 className="heading-sm text-elaia-charcoal mb-2">
                        Pack 50 crédits
                      </h3>
                      <div className="mb-6">
                        <span className="text-5xl font-playfair text-ohemia-accent">1000</span>
                        <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                      </div>
                      <p className="text-sm text-elaia-warm-gray mb-4">
                        50 crédits
                      </p>
                      <p className="text-sm text-elaia-warm-gray mb-2">
                        20.00 CHF par crédit
                      </p>
                      <p className="text-sm text-elaia-warm-gray mb-4">
                        Pour une pratique intensive
                      </p>
                      <p className="text-xs text-elaia-warm-gray flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Valable 9 mois
                      </p>
                    </div>

                    <Link to="/register" className="btn-primary text-center mt-auto">
                      Acheter
                    </Link>
                  </div>
                        </div>
                      )}
                        </div>
                      )}

          {/* Abonnements mensuels Section */}
          {selectedTab === 'abonnements' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Casual */}
                <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-8">
                    <h3 className="heading-sm text-elaia-charcoal mb-2">
                      Casual - 2 fois/semaine
                    </h3>
                    <div className="mb-6">
                      <span className="text-5xl font-playfair text-ohemia-accent">180</span>
                      <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                    </div>
                    <p className="text-sm text-elaia-warm-gray">/ mois</p>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    <p className="text-sm text-elaia-warm-gray">
                      Parfait pour commencer en douceur
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-elaia-warm-gray">2 cours par semaine</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-elaia-warm-gray">Réservation prioritaire</span>
                      </li>
                    </ul>
                  </div>

                  <Link to="/register" className="btn-primary text-center">
                    S'abonner
                  </Link>
                </div>

                {/* Premium+ */}
                <div className="group relative">
                  <div className="absolute -top-3 left-8 bg-ohemia-sage text-elaia-white px-4 py-1 text-xs font-inter uppercase tracking-wider rounded-full">
                    ⭐ Premium
                  </div>
                  <div className="bg-elaia-white h-full flex flex-col p-8 border-2 border-ohemia-sage shadow-lg transition-all duration-300">
                    <div className="mb-8">
                      <h3 className="heading-sm text-elaia-charcoal mb-2">
                        Premium+ - 5 fois/semaine
                      </h3>
                      <div className="mb-6">
                        <span className="text-5xl font-playfair text-ohemia-accent">320</span>
                        <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                      </div>
                      <p className="text-sm text-elaia-warm-gray">/ mois</p>
                    </div>

                    <div className="space-y-4 mb-8 flex-grow">
                      <p className="text-sm text-elaia-warm-gray">
                        Pour une pratique intensive
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-elaia-warm-gray">5 cours par semaine</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-elaia-warm-gray">Réservation prioritaire</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-elaia-warm-gray">Accès aux événements exclusifs</span>
                        </li>
                      </ul>
                    </div>

                    <Link to="/register" className="btn-accent text-center">
                      S'abonner
                    </Link>
                  </div>
                </div>

                {/* Duo */}
                <div className="group relative">
                  <div className="absolute -top-3 right-8 bg-elaia-sand text-elaia-white px-4 py-1 text-xs font-inter uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    2 personnes
                  </div>
                  <div className="bg-elaia-white h-full flex flex-col p-8 border border-elaia-muted shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="mb-8">
                      <h3 className="heading-sm text-elaia-charcoal mb-2">
                        Duo - 2 personnes
                      </h3>
                      <div className="mb-6">
                        <span className="text-5xl font-playfair text-ohemia-accent">450</span>
                        <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                      </div>
                      <p className="text-sm text-elaia-warm-gray">/ mois</p>
                    </div>

                    <div className="space-y-4 mb-8 flex-grow">
                      <p className="text-sm text-elaia-warm-gray">
                        Formule spéciale pour 2 personnes (chacune)
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-elaia-warm-gray">3 cours par semaine</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-elaia-warm-gray">Réservation prioritaire</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-elaia-warm-gray">Formule pour 2 personnes</span>
                        </li>
                      </ul>
                    </div>

                    <Link to="/register" className="btn-primary text-center">
                      S'abonner
                    </Link>
                  </div>
                </div>
              </div>

              {/* Display monthly plans from API */}
              {!isLoading && monthlyPlans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  {monthlyPlans.map((plan: any) => {
                    const isUnlimited = plan.name.toLowerCase().includes('illimité');
                    const isPremium = plan.name.includes('Premium');
                    
                    return (
                      <div key={plan.id} className="group relative">
                        {isPremium && (
                          <div className="absolute -top-3 left-8 bg-ohemia-sage text-elaia-white px-4 py-1 text-xs font-inter uppercase tracking-wider rounded-full">
                            ⭐ Premium
                        </div>
                      )}
                        <div className={`bg-elaia-white h-full flex flex-col p-8 transition-all duration-300 ${
                          isUnlimited ? 'border-2 border-ohemia-accent shadow-lg' : 'border border-elaia-muted shadow-sm hover:shadow-lg'
                        }`}>
                          <div className="mb-8">
                            <h3 className="heading-sm text-elaia-charcoal mb-2">
                          {plan.name}
                        </h3>
                            <div className="mb-6">
                              <span className="text-5xl font-playfair text-ohemia-accent">{plan.price}</span>
                              <span className="text-2xl text-ohemia-accent ml-2">CHF</span>
                            </div>
                            <p className="text-sm text-elaia-warm-gray">/ mois</p>
                          </div>

                          <div className="space-y-4 mb-8 flex-grow">
                            <p className="text-sm text-elaia-warm-gray">
                          {plan.description}
                        </p>
                            <ul className="space-y-3">
                              <li className="flex items-start text-sm">
                                <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-elaia-warm-gray">
                                  {isUnlimited ? 'Accès illimité à tous les cours' : 
                               plan.max_bookings_per_week ? `${plan.max_bookings_per_week} cours par semaine` : 
                               'Accès selon la formule'}
                            </span>
                          </li>
                              <li className="flex items-start text-sm">
                                <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-elaia-warm-gray">Réservation prioritaire</span>
                          </li>
                              {(isUnlimited || isPremium) && (
                                <li className="flex items-start text-sm">
                                  <Check className="h-4 w-4 text-ohemia-sage mr-2 flex-shrink-0 mt-0.5" />
                                  <span className="text-elaia-warm-gray">Accès aux événements exclusifs</span>
                            </li>
                          )}
                        </ul>
                          </div>

                        <Link 
                          to="/register" 
                            className={`text-center ${isUnlimited ? 'btn-accent' : 'btn-primary'}`}
                        >
                          S'abonner
                        </Link>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {isLoading && selectedTab !== 'decouverte' && (
            <div className="text-center py-24">
              <p className="body-lg text-elaia-warm-gray">Chargement des tarifs...</p>
          </div>
        )}

          {/* Footer note */}
          <div className="text-center mt-16">
            <p className="text-sm text-elaia-warm-gray">
              *Frais d'adhésion unique à vie : 120 CHF (offerts pour les formules Premium+)
            </p>
          </div>
      </div>
      </section>
    </div>
  );
} 