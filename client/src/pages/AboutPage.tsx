import { Users, Award, Heart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920" 
            alt="Équipe"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-elaia-charcoal/70 to-elaia-charcoal/50"></div>
      </div>
        
        <div className="relative z-10 text-center text-elaia-white px-6">
          <h1 className="heading-xl mb-4">Notre Histoire</h1>
          <p className="body-lg max-w-2xl mx-auto opacity-90">
            Deux passionnés, une vision commune : transformer votre approche du bien-être
          </p>
        </div>
      </section>
        
        {/* Introduction */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-lg text-elaia-charcoal mb-8">
              L'essence d'ELAÏA
          </h2>
            <div className="space-y-6">
              <p className="body-lg text-elaia-warm-gray leading-relaxed">
                Nous sommes Albina et Baptist, deux passionnés du mouvement et de la transformation humaine. 
                À travers nos parcours dans le fitness, le Pilates et le yoga, nous avons développé 
                une approche globale et humaine du bien-être.
              </p>
              <p className="body-lg text-elaia-warm-gray leading-relaxed">
                ELAÏA Studio est né de notre envie de créer un lieu unique à Gland : un espace moderne 
                et accessible où chacun peut se reconnecter à son corps dans un environnement inspirant.
              </p>
              <p className="body-lg text-elaia-warm-gray leading-relaxed">
                Notre mission est d'accompagner nos clients avec exigence et douceur, en leur offrant 
                des cours sur mesure et des outils concrets pour se sentir mieux, durablement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fondateurs */}
      <section className="py-32 bg-elaia-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-elaia-charcoal">Les fondateurs</h2>
                  </div>

          {/* Albina */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1">
              <h3 className="heading-md text-elaia-charcoal mb-4">
                Albina Zeqiri
              </h3>
              <p className="text-lg font-lora italic text-ohemia-accent mb-6">
                Coach Sportive CFC • Maîtrise fédérale
              </p>
              <div className="space-y-4 text-elaia-warm-gray">
                <p className="leading-relaxed">
                  Depuis mon plus jeune âge, le sport a toujours occupé une place centrale dans ma vie. 
                  Cette passion m'a conduite à obtenir un CFC de coach sportive, puis le Brevet fédéral 
                  pour me spécialiser dans le mouvement et la santé.
                </p>
                <p className="leading-relaxed">
                  J'ai travaillé dans plusieurs centres de fitness et studios de Pilates Reformer, 
                  développant une expertise variée et un réseau solide dans le domaine du bien-être.
                </p>
                <p className="leading-relaxed">
                  Aujourd'hui, j'accomplis une étape importante en ouvrant ELAÏA Studio : 
                  un espace moderne dédié au Pilates Reformer et à la transformation physique.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1594381298921-9e18df7909f9?w=800" 
                alt="Albina Zeqiri"
                className="w-full h-[600px] object-cover grayscale"
              />
            </div>
          </div>

          {/* Baptist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800" 
                alt="Baptist Mercereau"
                className="w-full h-[600px] object-cover grayscale"
              />
                  </div>
            <div>
              <h3 className="heading-md text-elaia-charcoal mb-4">
                Baptist Mercereau
              </h3>
              <p className="text-lg font-lora italic text-ohemia-accent mb-6">
                Expert Fitness • Management & Innovation
              </p>
              <div className="space-y-4 text-elaia-warm-gray">
                <p className="leading-relaxed">
                  Fort de plus d'une décennie d'expérience internationale dans le fitness et le bien-être, 
                  j'ai développé une expertise solide en France, au Maroc, à La Réunion et en Suisse.
                </p>
                <p className="leading-relaxed">
                  Chez Aquamed, j'ai managé les coaches santé externes et enrichi l'offre de cours collectifs, 
                  apprenant à piloter des projets ambitieux tout en gardant la satisfaction client au cœur 
                  de mon action.
                </p>
                <p className="leading-relaxed">
                  Mon objectif est simple : aider chacun à devenir la meilleure version de lui-même 
                  à travers une approche exigeante et bienveillante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-32 bg-elaia-charcoal text-elaia-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Target className="h-16 w-16 mx-auto mb-8 text-ohemia-accent" />
            <h2 className="heading-lg mb-8">Notre vision d'avenir</h2>
            
            <div className="space-y-6">
              <p className="body-lg opacity-90 leading-relaxed">
                Dans une volonté de transmettre notre passion au plus grand nombre, 
                nous avons l'ambition de créer à terme une <strong>académie de Pilates et de Yoga</strong>.
              </p>
              
              <p className="body-lg opacity-90 leading-relaxed">
                Cette académie proposera des formations complètes pour les futurs enseignants, 
                ainsi que des stages immersifs pour approfondir sa pratique ou se reconvertir.
              </p>
              
              <p className="body-lg opacity-90 leading-relaxed">
                Elle incarnera notre philosophie : faire du mouvement un art de vivre accessible 
                à tous, encadré avec rigueur, humanité et passion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section-padding bg-elaia-light-gray">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-elaia-charcoal">Nos valeurs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-elaia-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart className="h-10 w-10 text-ohemia-accent" />
              </div>
              <h3 className="heading-sm text-elaia-charcoal mb-4">Bienveillance</h3>
              <p className="body-md text-elaia-warm-gray">
                Un accompagnement personnalisé, sans jugement, dans le respect du rythme de chacun.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-elaia-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Award className="h-10 w-10 text-ohemia-accent" />
              </div>
              <h3 className="heading-sm text-elaia-charcoal mb-4">Excellence</h3>
              <p className="body-md text-elaia-warm-gray">
                Une approche rigoureuse et professionnelle pour des résultats durables et visibles.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-elaia-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Users className="h-10 w-10 text-ohemia-accent" />
              </div>
              <h3 className="heading-sm text-elaia-charcoal mb-4">Communauté</h3>
              <p className="body-md text-elaia-warm-gray">
                Créer des liens authentiques et un sentiment d'appartenance à notre famille ELAÏA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-elaia-white">
        <div className="container-custom text-center">
          <h2 className="heading-lg text-elaia-charcoal mb-8">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="body-lg text-elaia-warm-gray mb-12 max-w-2xl mx-auto">
              Rejoignez-nous pour découvrir une nouvelle approche du bien-être et du mouvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-accent">
                Découvrir nos offres
            </Link>
            <Link to="/contact" className="btn-secondary">
                Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 