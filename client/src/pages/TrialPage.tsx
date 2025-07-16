import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Star, Clock, Users, Heart, Target, Zap, Calendar, ArrowRight, Gift } from 'lucide-react';

export default function TrialPage() {
  const [selectedOffer, setSelectedOffer] = useState<'welcome' | 'trial' | 'single'>('welcome');
  const navigate = useNavigate();

  const offers = {
    welcome: {
      title: "Offre Welcome",
      price: "45 CHF",
      originalPrice: "150 CHF",
      description: "3 séances découverte",
      details: "1 séance achetée + 2 offertes",
      icon: Gift,
      color: "bg-gradient-to-r from-elaia-gold to-elaia-green",
      benefits: [
        "3 séances de Pilates Reformer",
        "Découverte de tous nos cours",
        "Évaluation personnalisée",
        "Conseil nutritionnel inclus",
        "Aucun engagement"
      ],
      validity: "Valable 3 mois",
      popular: true
    },
    trial: {
      title: "Séance d'essai",
      price: "25 CHF",
      originalPrice: "50 CHF",
      description: "Première séance découverte",
      details: "50% de réduction",
      icon: Heart,
      color: "bg-gradient-to-r from-elaia-rose to-elaia-mint",
      benefits: [
        "1 séance de Pilates Reformer",
        "Évaluation posturale",
        "Conseils personnalisés",
        "Présentation du studio",
        "Sans engagement"
      ],
      validity: "À utiliser dans le mois",
      popular: false
    },
    single: {
      title: "Séance à l'unité",
      price: "50 CHF",
      originalPrice: null,
      description: "Sans abonnement",
      details: "Tarif standard",
      icon: Target,
      color: "bg-gradient-to-r from-elaia-gray to-elaia-green",
      benefits: [
        "1 séance de Pilates Reformer",
        "Cours au choix",
        "Réservation flexible",
        "Aucun engagement",
        "Paiement à la séance"
      ],
      validity: "Réservation à la demande",
      popular: false
    }
  };

  const courseTypes = [
    {
      name: "Pilates Reformer Débutant",
      description: "Découvrez les bases du Pilates Reformer en douceur",
      level: "Débutant",
      duration: "55 min",
      icon: Heart,
      color: "bg-elaia-gold"
    },
    {
      name: "Pilates Reformer Intermédiaire", 
      description: "Approfondissez votre pratique avec plus de défis",
      level: "Intermédiaire",
      duration: "55 min",
      icon: Target,
      color: "bg-elaia-green"
    },
    {
      name: "Pilates Reformer Avancé",
      description: "Pour les pratiquants expérimentés",
      level: "Avancé", 
      duration: "55 min",
      icon: Zap,
      color: "bg-elaia-mint"
    },
    {
      name: "Pilates Yoga Mat",
      description: "Fusion Pilates et Yoga sur tapis",
      level: "Tous niveaux",
      duration: "45 min", 
      icon: Heart,
      color: "bg-elaia-rose"
    }
  ];

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-elaia-gray mb-4">
            Découvrez le Pilates Reformer
          </h1>
          <p className="text-xl text-elaia-gray mb-6">
            Vous hésitez ? Testez nos cours sans engagement avec nos offres découverte
          </p>
          <div className="bg-white/80 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-elaia-gold mx-auto mb-2" />
                <h3 className="font-semibold text-elaia-gray">Petits groupes</h3>
                <p className="text-sm text-gray-600">6-12 personnes max</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-elaia-green mx-auto mb-2" />
                <h3 className="font-semibold text-elaia-gray">Instructeurs certifiés</h3>
                <p className="text-sm text-gray-600">Formation professionnelle</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-elaia-rose mx-auto mb-2" />
                <h3 className="font-semibold text-elaia-gray">Suivi personnalisé</h3>
                <p className="text-sm text-gray-600">Adapté à votre niveau</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sélecteur d'offres */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-elaia-gray mb-8 text-center">
            Choisissez votre première expérience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(offers).map(([key, offer]) => (
              <div
                key={key}
                className={`relative cursor-pointer transition-all transform hover:scale-105 ${
                  selectedOffer === key ? 'ring-4 ring-elaia-gold' : ''
                }`}
                onClick={() => setSelectedOffer(key as 'welcome' | 'trial' | 'single')}
              >
                {offer.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-elaia-gold text-white px-4 py-1 rounded-full text-sm font-bold z-10">
                    🌟 Recommandé
                  </div>
                )}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 h-full">
                  <div className={`w-16 h-16 ${offer.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    {React.createElement(offer.icon, { className: "h-8 w-8 text-white" })}
                  </div>
                  <h3 className="text-xl font-bold text-elaia-gray text-center mb-2">
                    {offer.title}
                  </h3>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-elaia-gold">{offer.price}</p>
                    {offer.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">{offer.originalPrice}</p>
                    )}
                    <p className="text-sm text-elaia-gray">{offer.description}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-elaia-green">{offer.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Détails de l'offre sélectionnée */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-elaia-gray mb-4 flex items-center">
                  <Check className="h-6 w-6 text-elaia-green mr-2" />
                  Inclus dans {offers[selectedOffer].title}
                </h3>
                <ul className="space-y-3">
                  {offers[selectedOffer].benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-elaia-gold rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-elaia-gray">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-elaia-gray mb-4 flex items-center">
                  <Clock className="h-6 w-6 text-elaia-mint mr-2" />
                  Informations pratiques
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-medium text-elaia-gray">Validité</p>
                    <p className="text-gray-600">{offers[selectedOffer].validity}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-medium text-elaia-gray">Réservation</p>
                    <p className="text-gray-600">En ligne 24h/24 ou par téléphone</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-medium text-elaia-gray">Annulation</p>
                    <p className="text-gray-600">Gratuite jusqu'à 12h avant</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-lg px-8 py-4 flex items-center mx-auto"
              >
                <Gift className="h-6 w-6 mr-2" />
                Réserver {offers[selectedOffer].title}
                <ArrowRight className="h-6 w-6 ml-2" />
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Créez votre compte en 2 minutes et réservez votre première séance
              </p>
            </div>
          </div>
        </div>

        {/* Nos cours */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-elaia-gray mb-8 text-center">
            Nos différents cours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseTypes.map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center mb-4`}>
                  {React.createElement(course.icon, { className: "h-6 w-6 text-white" })}
                </div>
                <h3 className="text-lg font-bold text-elaia-gray mb-2">
                  {course.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="px-3 py-1 bg-elaia-gold/20 text-elaia-gold rounded-full font-medium">
                    {course.level}
                  </span>
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ rapide */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-elaia-gray mb-8 text-center">
            Questions fréquentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-elaia-gray mb-2">Dois-je avoir de l'expérience ?</h3>
              <p className="text-gray-600 text-sm">Non, nos cours débutants sont parfaits pour découvrir le Pilates Reformer. Nos instructeurs vous guident pas à pas.</p>
            </div>
            <div>
              <h3 className="font-bold text-elaia-gray mb-2">Que dois-je apporter ?</h3>
              <p className="text-gray-600 text-sm">Venez en tenue confortable. Nous fournissons tout le matériel nécessaire. Des chaussettes antidérapantes sont recommandées.</p>
            </div>
            <div>
              <h3 className="font-bold text-elaia-gray mb-2">Puis-je changer d'avis ?</h3>
              <p className="text-gray-600 text-sm">Vous pouvez annuler gratuitement jusqu'à 12h avant votre séance. Nos offres n'ont aucun engagement.</p>
            </div>
            <div>
              <h3 className="font-bold text-elaia-gray mb-2">Comment réserver ?</h3>
              <p className="text-gray-600 text-sm">Créez votre compte en ligne et choisissez votre créneau. Vous recevrez une confirmation par email.</p>
            </div>
          </div>
        </div>

        {/* Call-to-action final */}
        <div className="bg-gradient-to-r from-elaia-gold to-elaia-green rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt(e) pour votre première séance ?</h2>
          <p className="text-xl mb-6 opacity-90">
            Rejoignez notre communauté et découvrez les bienfaits du Pilates Reformer
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-elaia-gray px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all text-lg"
            >
              🎯 Commencer maintenant
            </button>
            <Link
              to="/schedule"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all text-lg"
            >
              Voir les créneaux
            </Link>
          </div>
          <p className="text-sm opacity-75">
            📍 Elaïa Studio - Gland • ✉️ elaia.studio.gland@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
} 