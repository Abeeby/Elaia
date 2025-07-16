import { HelpCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FaqPage() {
  const faqSections = [
    {
      title: "🌿 À propos du Pilates Reformer",
      questions: [
        {
          question: "Qu'est-ce que le Pilates Reformer ?",
          answer: "Le Pilates Reformer est une méthode d'entraînement douce et précise, axée sur le renforcement des muscles profonds, l'alignement postural et la fluidité du mouvement. Conçu à l'origine pour la rééducation, il s'adresse aujourd'hui à tous, sans impact sur les articulations."
        },
        {
          question: "Est-ce adapté aux débutants ?",
          answer: "Absolument. Nos cours sont accessibles à tous les niveaux. Nous recommandons de commencer par un cours \"Découverte\" ou \"Initiation\" pour se familiariser avec la machine Reformer et les fondamentaux du Pilates."
        },
        {
          question: "Puis-je pratiquer le Pilates si j'ai des douleurs ou une pathologie ?",
          answer: "Oui. Le Pilates est idéal pour les personnes ayant des douleurs chroniques (dos, genoux, hanches…) ou en période de rééducation. Nos instructeurs sont formés pour adapter les exercices à vos besoins spécifiques, avec sécurité et bienveillance."
        },
        {
          question: "À partir de quel âge peut-on participer ?",
          answer: "Les cours sont accessibles dès 14 ans avec autorisation parentale. Le Pilates favorise la posture, la coordination et la conscience corporelle, sans traumatismes articulaires."
        }
      ]
    },
    {
      title: "🔁 Fréquence, durée & organisation",
      questions: [
        {
          question: "Quelle est la fréquence idéale ?",
          answer: "Une séance par semaine peut déjà améliorer la mobilité, la posture et le bien-être. Pour des résultats visibles et durables, 2 à 3 séances par semaine sont idéales. Mais chacun avance à son rythme – notre rôle est de vous accompagner, sans pression."
        },
        {
          question: "Combien de temps dure un cours ?",
          answer: "La plupart de nos cours durent 50 minutes. Merci d'arriver 10 minutes avant le début pour vous installer et profiter pleinement de votre séance."
        }
      ]
    },
    {
      title: "🎒 Préparer votre venue",
      questions: [
        {
          question: "Quelle tenue faut-il porter ?",
          answer: "Une tenue de sport confortable et ajustée (legging, t-shirt près du corps). Les jeans, fermetures ou vêtements susceptibles d'endommager les machines sont interdits."
        },
        {
          question: "Faut-il des chaussettes spéciales ?",
          answer: "Oui, pour les cours sur Reformer, des chaussettes antidérapantes sont recommandées (en vente sur place ou à apporter). Certains cours peuvent se faire pieds nus."
        },
        {
          question: "Que dois-je apporter ?",
          answer: "• Une bouteille d'eau\n• Une paire de baskets propres pour l'intérieur (sauf pour les cours pratiqués pieds nus)\n\nTout le reste (Reformer, tapis, matériel) est fourni sur place."
        }
      ]
    },
    {
      title: "📲 Réservations & annulations",
      questions: [
        {
          question: "Comment réserver un cours ?",
          answer: "Les réservations se font via notre site web ou notre application mobile. Vous pouvez consulter les plannings en temps réel, gérer vos crédits ou abonnements, et recevoir des rappels."
        },
        {
          question: "Puis-je annuler un cours ?",
          answer: "Oui. Toute annulation est possible jusqu'à 16h avant le début du cours. Passé ce délai, le crédit est débité. En cas d'annulation par le studio, votre crédit est automatiquement restitué."
        }
      ]
    },
    {
      title: "📚 Formations & accompagnement",
      questions: [
        {
          question: "Proposez-vous des formations ?",
          answer: "Oui. Bientôt, Elaïa Studio lancera une académie de formation certifiante pour devenir instructeur de Pilates ou de Yoga. Pour les passionnés souhaitant approfondir leur pratique ou se reconvertir professionnellement."
        }
      ]
    },
    {
      title: "🧘 Vie en studio",
      questions: [
        {
          question: "Y a-t-il des vestiaires ?",
          answer: "Oui, avec casiers sécurisés pour vos effets personnels. Il n'y a pas de douches sur place."
        },
        {
          question: "Dois-je éteindre mon téléphone ?",
          answer: "Merci de mettre votre téléphone en mode avion ou de l'éteindre pendant le cours pour garantir une ambiance calme."
        }
      ]
    }
  ];

  const studioRules = [
    "Apporter des baskets propres ou des chaussettes antidérapantes (selon les cours).",
    "Porter une tenue adaptée (pas de jeans ni de fermetures éclair).",
    "Respecter le matériel, les autres pratiquants et l'espace.",
    "Prévenir en cas de retard ou d'annulation.",
    "Arriver au moins 10 minutes avant le cours.",
    "Nettoyer votre matériel après usage (produits fournis).",
    "Éviter les nuisances sonores : respect, calme et bienveillance sont essentiels."
  ];

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      {/* Header */}
      <div className="bg-elaia-green text-elaia-beige py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">FAQ – Elaïa Studio</h1>
        <p className="text-lg">Trouvez ici les réponses à vos interrogations les plus fréquentes.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* FAQ Sections */}
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-elaia-gray mb-6">{section.title}</h2>
            
            <div className="space-y-6">
              {section.questions.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-elaia-green mb-3 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <div className="text-elaia-gray whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-elaia-gray mb-6">📞 Nous contacter</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-elaia-green mb-3 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Vous avez d'autres questions ?
            </h3>
            <div className="text-elaia-gray">
              <p className="mb-2">• Par téléphone : <a href="tel:+41797181009" className="text-elaia-gold hover:text-elaia-green font-medium">079 718 10 09</a></p>
              <p>• Via notre formulaire de contact : <Link to="/contact" className="text-elaia-gold hover:text-elaia-green font-medium">cliquez ici</Link></p>
            </div>
          </div>
        </div>

        {/* Règles du studio */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-elaia-gray mb-6">📌 Règles à respecter au studio</h2>
          <div className="bg-elaia-mint rounded-lg p-8">
            <ul className="space-y-3 text-elaia-gray">
              {studioRules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-elaia-green mr-2 flex-shrink-0">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact rapide */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-elaia-gray mb-4">Encore des questions ?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+41797181009" 
              className="inline-flex items-center justify-center px-6 py-3 bg-elaia-gold text-elaia-gray rounded-lg hover:bg-elaia-green hover:text-white transition-all"
            >
              <Phone className="h-5 w-5 mr-2" />
              079 718 10 09
            </a>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-elaia-gold text-elaia-gold rounded-lg hover:bg-elaia-gold hover:text-elaia-gray transition-all"
            >
              <Mail className="h-5 w-5 mr-2" />
              Nous contacter
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
} 