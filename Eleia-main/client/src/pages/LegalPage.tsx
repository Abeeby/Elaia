import { Shield, Mail, Phone, FileText, Lock, Database } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      {/* Header */}
      <div className="bg-elaia-green text-elaia-beige py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Mentions légales & Politique de confidentialité</h1>
        <p className="text-lg">Informations légales et protection de vos données personnelles</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Informations légales */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-green mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Informations légales
          </h2>
          
          <div className="space-y-4 text-elaia-gray">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p><strong>Nom de l'entreprise :</strong> Elaïa Studio Sàrl</p>
                <p><strong>Adresse :</strong> Rue de l'Etraz 14, 1196 Gland, Suisse</p>
                <p><strong>Numéro IDE :</strong> [à compléter]</p>
                <p><strong>Responsable de publication :</strong> Baptist Mercereau</p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 mr-2 text-elaia-gold" />
                  <a href="tel:+41797181009" className="text-elaia-gold hover:text-elaia-green">
                    079 718 10 09
                  </a>
                </div>
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 mr-2 text-elaia-gold" />
                  <a href="mailto:contact@elaia-studio.ch" className="text-elaia-gold hover:text-elaia-green">
                    contact@elaia-studio.ch
                  </a>
                </div>
                <p><strong>Hébergement :</strong> Vercel Inc., San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Propriété intellectuelle */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-green mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            Propriété intellectuelle
          </h2>
          <p className="text-elaia-gray">
            Tous les contenus présents sur ce site (textes, images, logos, vidéos, etc.) sont la propriété exclusive d'Elaïa Studio ou font l'objet d'une licence. Toute reproduction ou utilisation sans autorisation est strictement interdite.
          </p>
        </div>

        {/* Collecte des données */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-green mb-6 flex items-center">
            <Database className="h-6 w-6 mr-2" />
            Collecte des données
          </h2>
          <div className="space-y-4 text-elaia-gray">
            <p>
              Les données personnelles collectées via le formulaire de contact (nom, email, sujet, message) sont utilisées uniquement pour répondre à votre demande. Elles ne sont jamais transmises à des tiers sans votre consentement.
            </p>
            
            <h3 className="text-lg font-semibold text-elaia-gray mt-6 mb-3">Données collectées lors de l'inscription :</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Informations personnelles (nom, prénom, email, téléphone)</li>
              <li>Adresse de facturation</li>
              <li>Préférences de cours et objectifs</li>
              <li>Historique des réservations et paiements</li>
            </ul>

            <h3 className="text-lg font-semibold text-elaia-gray mt-6 mb-3">Utilisation des données :</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Gestion de votre compte et de vos réservations</li>
              <li>Facturation et suivi des paiements</li>
              <li>Communication relative aux cours et services</li>
              <li>Amélioration de nos services (statistiques anonymisées)</li>
            </ul>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-green mb-6 flex items-center">
            <Lock className="h-6 w-6 mr-2" />
            Cookies et technologies similaires
          </h2>
          <div className="space-y-4 text-elaia-gray">
            <p>
              Ce site peut utiliser des cookies à des fins d'analyse de fréquentation (statistiques anonymes). Vous pouvez refuser leur utilisation via les paramètres de votre navigateur.
            </p>
            
            <h3 className="text-lg font-semibold text-elaia-gray mt-6 mb-3">Types de cookies utilisés :</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
              <li><strong>Cookies de performance :</strong> Mesure d'audience anonyme</li>
              <li><strong>Cookies de préférences :</strong> Mémorisation de vos choix</li>
            </ul>
          </div>
        </div>

        {/* Durée de conservation */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-green mb-6">Durée de conservation</h2>
          <div className="space-y-3 text-elaia-gray">
            <p><strong>Données de contact :</strong> 12 mois maximum, sauf relation contractuelle</p>
            <p><strong>Données clients :</strong> Durée de la relation contractuelle + 5 ans (obligations légales)</p>
            <p><strong>Données de facturation :</strong> 10 ans (obligations comptables)</p>
            <p><strong>Cookies :</strong> 13 mois maximum</p>
          </div>
        </div>

        {/* Vos droits */}
        <div className="bg-elaia-mint rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-gray mb-6">Vos droits</h2>
          <div className="text-elaia-gray space-y-4">
            <p>
              Conformément à la LPD suisse (et au RGPD pour les utilisateurs de l'UE), vous disposez des droits suivants concernant vos données personnelles :
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <p><strong>• Droit d'accès :</strong> Connaître les données que nous détenons</p>
                <p><strong>• Droit de rectification :</strong> Corriger vos informations</p>
                <p><strong>• Droit d'effacement :</strong> Supprimer vos données</p>
              </div>
              <div className="space-y-2">
                <p><strong>• Droit d'opposition :</strong> Refuser un traitement</p>
                <p><strong>• Droit à la portabilité :</strong> Récupérer vos données</p>
                <p><strong>• Droit de limitation :</strong> Limiter le traitement</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mt-6">
              <p className="font-semibold text-elaia-green mb-2">Pour exercer vos droits :</p>
              <p>Contactez-nous à l'adresse :</p>
              <div className="flex items-center mt-2">
                <Mail className="h-4 w-4 mr-2 text-elaia-gold" />
                <a href="mailto:contact@elaia-studio.ch" className="text-elaia-gold hover:text-elaia-green">
                  contact@elaia-studio.ch
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-green mb-6">Sécurité des données</h2>
          <div className="space-y-4 text-elaia-gray">
            <p>
              Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre :
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>La destruction accidentelle ou illicite</li>
              <li>La perte accidentelle</li>
              <li>L'altération non autorisée</li>
              <li>La divulgation ou l'accès non autorisé</li>
            </ul>
            
            <p className="mt-4">
              Nos mesures incluent notamment : chiffrement des données, accès restreint, sauvegardes régulières, et surveillance continue de nos systèmes.
            </p>
          </div>
        </div>

        {/* Modification de la politique */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-elaia-green mb-6">Modification de la politique</h2>
          <p className="text-elaia-gray">
            Nous nous réservons le droit de modifier cette politique à tout moment. La version la plus récente est toujours disponible sur cette page. En cas de modification substantielle, nous vous en informerons par email si vous êtes client.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Dernière mise à jour : Décembre 2024
          </p>
        </div>

        {/* Contact pour questions */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-elaia-green to-elaia-mint rounded-lg p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">Questions sur cette politique ?</h3>
            <p className="mb-6">
              Notre équipe est à votre disposition pour toute question concernant le traitement de vos données personnelles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contact@elaia-studio.ch" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-elaia-green rounded-lg hover:bg-gray-100 transition-all"
              >
                <Mail className="h-5 w-5 mr-2" />
                Nous contacter
              </a>
              <a 
                href="tel:+41797181009" 
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-elaia-green transition-all"
              >
                <Phone className="h-5 w-5 mr-2" />
                079 718 10 09
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 