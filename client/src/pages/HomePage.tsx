import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      // Garder seulement l'effet parallax pour les images, sans animation du logo
      const images = document.querySelectorAll<HTMLElement>('.parallax-image');
      images.forEach((img) => {
        gsap.to(img, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    } catch (error) {
      console.error('Error in HomePage animations:', error);
    }
  }, []);

  return (
    <>
      {/* Hero Section avec animation logo */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-elaia-cream">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-[8vw] md:text-[6vw] font-playfair text-elaia-charcoal leading-none tracking-[0.2em]">
            ELAÏA
          </h1>
          <div className="logo-text mt-8 text-center">
            <p className="text-sm md:text-base font-inter uppercase tracking-[0.3em] text-elaia-warm-gray mb-4">
              L'union parfaite de
            </p>
            <h2 className="text-2xl md:text-4xl font-playfair text-elaia-charcoal">
              YOGA MODERNE ET PILATES
            </h2>
            <Link 
              to="/register" 
              className="inline-block mt-12 px-8 py-4 bg-transparent border border-elaia-charcoal text-elaia-charcoal hover:bg-elaia-charcoal hover:text-white transition-all duration-300 text-sm font-inter uppercase tracking-[0.2em]"
            >
              RÉSERVEZ MAINTENANT
            </Link>
          </div>
        </div>

        {/* Background image */}
        <img 
          src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1920"
          alt="Yoga pose"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-elaia-charcoal" />
        </div>
      </section>

      {/* Transformation Section avec images parallax */}
      <section className="relative py-24 bg-elaia-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Images avec effet parallax */}
            <div className="relative h-[600px]">
              <div className="absolute left-0 top-0 w-[60%] h-[70%] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800"
                  alt="Mouvement fluide"
                  className="parallax-image w-full h-[120%] object-cover"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[60%] h-[70%] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"
                  alt="Yoga aérien"
                  className="parallax-image w-full h-[120%] object-cover"
                />
              </div>
            </div>

            {/* Contenu */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-playfair text-elaia-charcoal leading-tight">
                TRANSFORMATION DE L'EXPÉRIENCE
              </h2>
              <p className="text-lg text-elaia-warm-gray leading-relaxed">
                Plongez dans. Faites l'expérience d'un nouveau sentiment. Ceux qui sont en équilibre le rayonnent. Par la posture, la présence et l'énergie. ELAÏA vous offre un espace pour la force holistique et, bien sûr, le charisme authentique.
              </p>
              <div className="flex gap-8">
                <Link 
                  to="/courses" 
                  className="text-sm font-inter uppercase tracking-[0.2em] text-elaia-charcoal border-b border-elaia-charcoal hover:border-ohemia-accent hover:text-ohemia-accent transition-colors"
                >
                  COURS
                </Link>
                <Link 
                  to="/schedule" 
                  className="text-sm font-inter uppercase tracking-[0.2em] text-elaia-charcoal border-b border-elaia-charcoal hover:border-ohemia-accent hover:text-ohemia-accent transition-colors"
                >
                  ÉVÉNEMENTS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { title: 'ÉQUILIBRE', desc: 'Corps et esprit en harmonie' },
              { title: 'FORCE', desc: 'Puissance intérieure révélée' },
              { title: 'FLEXIBILITÉ', desc: 'Souplesse du mouvement' },
              { title: 'SÉRÉNITÉ', desc: 'Paix profonde cultivée' }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-playfair text-elaia-charcoal mb-2">{value.title}</h3>
                <p className="text-sm text-elaia-warm-gray">{value.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-playfair text-elaia-charcoal italic">
              "Le yoga ne change pas seulement la façon dont nous voyons les choses, il transforme la personne qui voit."
            </blockquote>
            <cite className="block mt-4 text-sm text-elaia-warm-gray font-inter uppercase tracking-wider">
              — B.K.S. Iyengar
            </cite>
          </div>
        </div>
      </section>

      {/* Nos Classes */}
      <section className="py-24 bg-elaia-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-playfair text-elaia-charcoal text-center mb-16">
            NOS CLASSES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'YOGA',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
                description: 'Explorez différents styles de yoga adaptés à tous les niveaux. Du Hatha doux au Vinyasa dynamique.'
              },
              {
                title: 'REFORMER',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
                description: 'Sculptez et renforcez votre corps avec nos séances sur machines Reformer de dernière génération.'
              },
              {
                title: 'PILATES',
                image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
                description: 'Développez votre force profonde et améliorez votre posture avec nos cours de Pilates sur tapis.'
              }
            ].map((item, index) => (
              <Link to={`/courses#${item.title.toLowerCase().replace(/\s+/g, '-')}`} key={index} className="group cursor-pointer block">
                <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105 group-hover:grayscale"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white text-center p-6">
                      <h4 className="text-2xl font-playfair mb-4">{item.title}</h4>
                      <ul className="text-sm space-y-2">
                        <li>• Tous niveaux</li>
                        <li>• 50-60 minutes</li>
                        <li>• Petits groupes</li>
                        <li>• Instructeurs certifiés</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-playfair text-elaia-charcoal mb-3">{item.title}</h3>
                <p className="text-elaia-warm-gray mb-4">{item.description}</p>
                <span className="inline-flex items-center text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors">
                  Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pourquoi ELAÏA STUDIO */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <p className="text-elaia-warm-gray text-sm uppercase tracking-wider mb-4">
              Pourquoi ELAÏA Studio ?
            </p>
            <h2 className="text-4xl md:text-5xl font-playfair text-elaia-charcoal mb-8">
              Une ambiance qui transforme
            </h2>
            <p className="text-lg text-elaia-warm-gray leading-relaxed max-w-3xl mx-auto">
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

      {/* Menu Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed bottom-8 right-8 z-50 bg-elaia-charcoal text-white p-4 rounded-full shadow-lg hover:bg-elaia-charcoal/90 transition-colors"
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 z-40 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="h-full flex items-center justify-center">
          <nav className="text-center space-y-8">
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className="block text-3xl font-playfair text-white hover:text-ohemia-accent transition-colors"
            >
              ACCUEIL
            </Link>
            <Link 
              to="/courses" 
              onClick={() => setMenuOpen(false)}
              className="block text-3xl font-playfair text-white hover:text-ohemia-accent transition-colors"
            >
              COURS
            </Link>
            <Link 
              to="/schedule" 
              onClick={() => setMenuOpen(false)}
              className="block text-3xl font-playfair text-white hover:text-ohemia-accent transition-colors"
            >
              PLANNING
            </Link>
            <Link 
              to="/pricing" 
              onClick={() => setMenuOpen(false)}
              className="block text-3xl font-playfair text-white hover:text-ohemia-accent transition-colors"
            >
              TARIFS
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMenuOpen(false)}
              className="block text-3xl font-playfair text-white hover:text-ohemia-accent transition-colors"
            >
              À PROPOS
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMenuOpen(false)}
              className="block text-3xl font-playfair text-white hover:text-ohemia-accent transition-colors"
            >
              CONTACT
            </Link>
            <div className="pt-8 space-y-4">
              <Link 
                to="/login" 
                onClick={() => setMenuOpen(false)}
                className="block text-lg font-inter uppercase tracking-wider text-white hover:text-ohemia-accent transition-colors"
              >
                CONNEXION
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMenuOpen(false)}
                className="inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all text-lg font-inter uppercase tracking-wider"
              >
                INSCRIPTION
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
} 