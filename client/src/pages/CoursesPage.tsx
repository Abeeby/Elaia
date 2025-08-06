// Note: Cette page n'est plus accessible depuis la navigation principale
// Elle reste disponible pour référence mais les utilisateurs sont redirigés vers /schedule

import React, { useState } from 'react';
import { Star, ArrowRight, Clock, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  intensity: number;
  participants: string;
  credits: number;
  level: string;
  benefits: string[];
  image: string;
  icon: string;
}

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses: Course[] = [
    {
      id: 'dynamic-pilates',
      title: 'DYNAMIC PILATES',
      subtitle: 'Énergie et fluidité',
      description: 'Combinez des exercices de Pilates modernes avec des éléments d\'entraînement fonctionnel pour un corps et un esprit équilibrés.',
      intensity: 4,
      participants: '6 personnes max',
      credits: 3,
      level: 'Intermédiaire',
      benefits: ['Entraînement complet', 'Améliore la coordination', 'Tonifie tout le corps'],
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
      icon: '🌟'
    },
    {
      id: 'power-pilates',
      title: 'POWER PILATES',
      subtitle: 'Force et intensité',
      description: 'Après Dynamic vient Power - une variation intensive du Pilates classique, renforcée par un entraînement fonctionnel de force.',
      intensity: 5,
      participants: '6 personnes max',
      credits: 3,
      level: 'Avancé',
      benefits: ['Renforcement intense', 'Améliore l\'endurance', 'Développe la puissance'],
      image: 'https://images.unsplash.com/photo-1599901860146-d62f2ebdb5d4?w=800',
      icon: '🔥'
    },
    {
      id: 'barre-deep',
      title: 'BARRE DEEP',
      subtitle: 'Profondeur et précision',
      description: 'Barre Deep est un entraînement holistique qui combine la technique de la barre avec la mobilité. Inspiré du yoga, du Pilates et du ballet.',
      intensity: 3,
      participants: '8 personnes max',
      credits: 3,
      level: 'Tous niveaux',
      benefits: ['Améliore la posture', 'Développe la grâce', 'Renforce en profondeur'],
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800',
      icon: '🩰'
    },
    {
      id: 'reformer-classique',
      title: 'REFORMER CLASSIQUE',
      subtitle: 'L\'essence du Pilates',
      description: 'Renforcez votre corps en profondeur, améliorez votre posture et développez votre stabilité grâce à une approche fidèle à la méthode originale.',
      intensity: 3,
      participants: '6 personnes max',
      credits: 3,
      level: 'Tous niveaux',
      benefits: ['Améliore la posture', 'Renforce le core', 'Développe la stabilité'],
      image: 'https://images.unsplash.com/photo-1540206063137-4a88ca974d1a?w=800',
      icon: '⚖️'
    },
    {
      id: 'yoga-flow',
      title: 'YOGA FLOW',
      subtitle: 'Respiration et mouvement',
      description: 'Un flow énergisant qui allie force, fluidité et respiration dans une séquence dynamique et engageante pour tous les niveaux.',
      intensity: 3,
      participants: '8 personnes max',
      credits: 2,
      level: 'Tous niveaux',
      benefits: ['Améliore la flexibilité', 'Réduit le stress', 'Harmonise corps et esprit'],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      icon: '🧘‍♀️'
    },
    {
      id: 'pre-post-natal',
      title: 'PRÉ & POST-NATAL',
      subtitle: 'Accompagnement maternel',
      description: 'Pensé pour accompagner les mamans avant et après l\'accouchement, ce cours allie douceur, renforcement et mobilité adaptée.',
      intensity: 2,
      participants: '4 personnes max',
      credits: 3,
      level: 'Adapté',
      benefits: ['Spécialisé grossesse', 'Travail du périnée', 'Accompagnement personnalisé'],
      image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800',
      icon: '🤱'
    }
  ];

  const renderIntensity = (level: number) => {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-600 mr-2">Intensité</span>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < level ? 'text-elaia-gold' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <SEOHead 
        title="Nos Cours - Pilates & Yoga à Gland | Elaïa Studio"
        description="Découvrez notre gamme complète de cours : Reformer Classique, Yoga Doux, Pilates, cours pré/post-natal. Instructrice certifiée avec maîtrise fédérale."
        keywords={["cours pilates gland", "reformer classique", "yoga doux", "cours prenatal", "pilates accessoires", "cours yoga vinyasa"]}
      />
      
      <div className="min-h-screen bg-elaia-cream">
        {/* Hero Section */}
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1920" 
              alt="Studio Elaïa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-elaia-charcoal/60 to-elaia-charcoal/40"></div>
          </div>
          
          <div className="relative z-10 text-center text-elaia-white px-6">
            <h1 className="heading-xl mb-4">Nos Cours</h1>
            <p className="body-lg max-w-2xl mx-auto opacity-90">
              Explorez notre sélection de cours conçus pour révéler votre potentiel
            </p>
          </div>
        </section>

        {/* Section Introduction */}
        <section className="section-padding bg-elaia-white">
          <div className="container-custom max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <p className="text-elaia-warm-gray text-sm uppercase tracking-wider mb-4">
                Pourquoi Elaïa Studio ?
              </p>
              <h2 className="heading-lg text-elaia-charcoal mb-8">
                Une ambiance qui transforme
              </h2>
              <p className="body-lg text-elaia-warm-gray leading-relaxed">
                Chaque séance est un voyage. Une parenthèse hors du temps pour rétablir l'équilibre entre corps et esprit, dans un cadre lumineux, feutré, où l'on se sent instantanément à sa place. Ici, le silence devient un allié, et chaque mouvement compte.
              </p>
            </div>

            {/* Valeurs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl mb-4">🌿</div>
                <h3 className="font-semibold text-elaia-charcoal mb-2">Bien-être durable</h3>
                <p className="text-sm text-elaia-warm-gray">
                  Nos pratiques renforcent la posture, soulagent les tensions et amènent une fluidité nouvelle dans le corps.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">🧘‍♀️</div>
                <h3 className="font-semibold text-elaia-charcoal mb-2">Respiration & conscience</h3>
                <p className="text-sm text-elaia-warm-gray">
                  Connectez-vous à l'instant. Les mouvements sont guidés par la respiration, pour un retour à soi naturel.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">💪</div>
                <h3 className="font-semibold text-elaia-charcoal mb-2">Force intérieure</h3>
                <p className="text-sm text-elaia-warm-gray">
                  Renforcement profond, amélioration de l'endurance musculaire et sentiment de contrôle retrouvé.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-4">🛡️</div>
                <h3 className="font-semibold text-elaia-charcoal mb-2">Sécurité & bienveillance</h3>
                <p className="text-sm text-elaia-warm-gray">
                  Aucun niveau requis. Nos coachs certifiés adaptent chaque mouvement à votre réalité du jour.
                </p>
              </div>
            </div>

            {/* Citation */}
            <div className="italic text-xl text-elaia-warm-gray font-lora">
              "On vient chez Elaïa pour se tonifier... mais on y revient pour s'y retrouver."
            </div>
          </div>
        </section>

        {/* Section Cours */}
        <section className="section-padding bg-elaia-light-gray">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-elaia-warm-gray text-sm uppercase tracking-wider mb-4">
                Book Now
              </p>
              <h2 className="heading-lg text-elaia-charcoal mb-8">
                Choose Your Personal Journey
              </h2>
            </div>

            {/* Grille de cours */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-elaia-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-elaia-charcoal/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-elaia-white mb-2">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-elaia-warm-gray mb-4 text-sm leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {renderIntensity(course.intensity)}
                      
                      <div className="flex items-center justify-between text-sm text-elaia-warm-gray">
                        <span>• {course.level}</span>
                        <span>• {course.participants}</span>
                      </div>
                      

                    </div>
                    
                    <Link 
                      to="/schedule" 
                      className="btn-secondary w-full text-center"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="section-padding bg-elaia-charcoal text-elaia-white">
          <div className="container-custom text-center">
            <h2 className="heading-lg mb-8">
              Prêt à commencer votre transformation ?
            </h2>
            <p className="body-lg mb-12 max-w-2xl mx-auto opacity-90">
              Rejoignez-nous dès juillet 2025 dans notre nouveau studio à Gland et 
              découvrez une nouvelle approche du bien-être.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-accent">
                Réserver maintenant
              </Link>
              <Link to="/contact" className="btn-secondary border-elaia-white text-elaia-white hover:bg-elaia-white hover:text-elaia-charcoal">
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CoursesPage; 