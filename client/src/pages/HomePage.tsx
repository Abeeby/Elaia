import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Star, Users, Heart, Award, Clock, Play } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../components/NotificationSystem';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('reformer');
  const logoRef = useRef(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const notifications = useNotifications();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      tl.fromTo(logoRef.current,
        { scale: 1, y: 0, x: 0, opacity: 1 },
        { 
          scale: 0.06, 
          y: "-47vh", 
          x: "-42vw", 
          opacity: 1, // Changez à 0 si vous voulez qu'il disparaisse
          ease: "power2.out" 
        }
      );

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "bottom top",
        onLeave: () => {
          gsap.set(logoRef.current, { 
            position: 'fixed', 
            top: '10px', 
            left: '20px', 
            transform: 'scale(0.06)', 
            zIndex: 1100 
          });
        },
        onEnterBack: () => {
          gsap.set(logoRef.current, { 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) scale(0.06)',
            zIndex: 'auto'
          });
        }
      });
    });

    setIsVisible(true);
    
    // Notification élégante après quelques secondes
    const welcomeTimer = setTimeout(() => {
      notifications.showSuccess(
        "Offre de lancement disponible",
        "Profitez de notre offre Welcome : 1 séance achetée + 1 offerte",
        {
          label: "Découvrir",
          onClick: () => document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' })
        }
      );
    }, 5000);

    return () => clearTimeout(welcomeTimer);
  }, [notifications]);

  const courses = {
    reformer: {
      title: 'Reformer',
      subtitle: 'Force • Alignement • Contrôle',
      description: 'Transformez votre corps avec notre équipement de pointe. Le Reformer permet un travail en profondeur avec une résistance ajustable pour tous les niveaux.',
      intensity: 'Modérée à intense'
    },
    pilates: {
      title: 'Pilates',
      subtitle: 'Centre • Fluidité • Précision',
      description: 'Développez votre force profonde et améliorez votre posture. Nos cours de Pilates classique sont conçus pour renforcer et équilibrer votre corps.',
      intensity: 'Douce à modérée'
    },
    yoga: {
      title: 'Yoga',
      subtitle: 'Respiration • Souplesse • Sérénité',
      description: 'Trouvez votre équilibre intérieur. Nos séances de yoga allient mouvement conscient et respiration pour une harmonie corps-esprit.',
      intensity: 'Douce'
    }
  };

  const instructors = [
    {
      name: 'Albina',
      role: 'Fondatrice & Instructrice principale',
      specialty: 'Maîtrise fédérale Pilates',
      image: '/instructor-1.jpg'
    },
    {
      name: 'Sarah',
      role: 'Instructrice Pilates',
      specialty: 'Spécialiste Reformer',
      image: '/instructor-2.jpg'
    },
    {
      name: 'Marie',
      role: 'Instructrice Yoga',
      specialty: 'Vinyasa & Yin Yoga',
      image: '/instructor-3.jpg'
    }
  ];

  return (
    <div className="bg-elaia-cream">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center bg-white overflow-hidden" id="hero">
        <img 
          ref={logoRef}
          src="/elaia-logo.svg"
          alt="Elaia Logo"
          className="w-[70vw] max-w-[950px] h-auto"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </section>

      {/* Section Pourquoi Elaïa Studio */}
      <section id="intro-section" className="section-padding bg-elaia-cream">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-elaia-warm-gray text-sm uppercase tracking-wider mb-4">
              Pourquoi Elaïa Studio ?
            </p>
            <h2 className="heading-lg text-elaia-charcoal mb-8">
              Une ambiance qui transforme
            </h2>
            <p className="body-lg text-elaia-warm-gray max-w-4xl mx-auto leading-relaxed">
              Chaque séance est un voyage. Une parenthèse hors du temps pour rétablir l'équilibre entre corps et esprit, 
              dans un cadre lumineux, feutré, où l'on se sent instantanément à sa place. Ici, le silence devient un allié, 
              et chaque mouvement compte.
            </p>
          </div>

          {/* Valeurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="font-semibold text-elaia-charcoal mb-3">Bien-être durable</h3>
              <p className="text-sm text-elaia-warm-gray leading-relaxed">
                Nos pratiques renforcent la posture, soulagent les tensions et amènent une fluidité nouvelle dans le corps.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="font-semibold text-elaia-charcoal mb-3">Respiration & conscience</h3>
              <p className="text-sm text-elaia-warm-gray leading-relaxed">
                Connectez-vous à l'instant. Les mouvements sont guidés par la respiration, pour un retour à soi naturel.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="font-semibold text-elaia-charcoal mb-3">Force intérieure</h3>
              <p className="text-sm text-elaia-warm-gray leading-relaxed">
                Renforcement profond, amélioration de l'endurance musculaire et sentiment de contrôle retrouvé.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-semibold text-elaia-charcoal mb-3">Sécurité & bienveillance</h3>
              <p className="text-sm text-elaia-warm-gray leading-relaxed">
                Aucun niveau requis. Nos coachs certifiés adaptent chaque mouvement à votre réalité du jour.
              </p>
            </div>
          </div>

          {/* Citation */}
          <div className="text-center">
            <p className="text-xl italic text-elaia-warm-gray font-lora">
              "On vient chez Elaïa pour se tonifier... mais on y revient pour s'y retrouver."
            </p>
          </div>
        </div>
      </section>

      {/* Section Classes - Style moderne */}
      <section className="bg-elaia-charcoal">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Yoga */}
          <div className="relative group overflow-hidden">
            <div className="aspect-[4/5] relative">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&fit=crop&crop=entropy"
                alt="Yoga"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <p className="text-white/70 text-xs font-inter uppercase tracking-[0.2em] mb-3">COURS</p>
                <h3 className="text-white text-3xl font-playfair mb-6">YOGA</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-sm">
                  Puisez dans votre force intérieure pour une nouvelle conscience du corps et de l'esprit. 
                  Trouvez votre équilibre et votre sérénité.
                </p>
                <Link to="/schedule" className="inline-flex items-center text-white text-xs font-inter uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                  RÉSERVER MAINTENANT
                </Link>
              </div>
            </div>
          </div>

          {/* Reformer */}
          <div className="relative group overflow-hidden">
            <div className="aspect-[4/5] relative">
              <img 
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&fit=crop&crop=entropy"
                alt="Reformer"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <p className="text-white/70 text-xs font-inter uppercase tracking-[0.2em] mb-3">COURS</p>
                <h3 className="text-white text-3xl font-playfair mb-6">REFORMER</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-sm">
                  Vivez un entraînement dynamique complet. Activez votre centre 
                  et développez force et flexibilité en profondeur.
                </p>
                <Link to="/schedule" className="inline-flex items-center text-white text-xs font-inter uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                  RÉSERVER MAINTENANT
                </Link>
              </div>
            </div>
          </div>

          {/* Pilates */}
          <div className="relative group overflow-hidden">
            <div className="aspect-[4/5] relative">
              <img 
                src="https://images.unsplash.com/photo-1599901860146-d62f2ebdb5d4?w=800&q=80&fit=crop&crop=entropy"
                alt="Pilates"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <p className="text-white/70 text-xs font-inter uppercase tracking-[0.2em] mb-3">COURS</p>
                <h3 className="text-white text-3xl font-playfair mb-6">PILATES</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-sm">
                  Révélez votre potentiel et ressentez la différence. 
                  Atteignez votre meilleure forme avec un maximum d'efficacité.
                </p>
                <Link to="/schedule" className="inline-flex items-center text-white text-xs font-inter uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                  RÉSERVER MAINTENANT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Cours Sélecteur */}
      <section className="section-padding bg-elaia-light-gray">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-elaia-charcoal mb-4">
              Choose your journey
            </h2>
            <p className="body-lg text-elaia-warm-gray max-w-2xl mx-auto">
              Trois approches complémentaires pour révéler votre potentiel
            </p>
          </div>
          
          {/* Sélecteur de cours */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex border-b-2 border-elaia-muted">
              {Object.keys(courses).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCourse(key)}
                  className={`px-8 py-4 text-sm font-inter uppercase tracking-wider transition-all ${
                    selectedCourse === key
                      ? 'text-elaia-charcoal border-b-2 border-elaia-charcoal -mb-[2px]'
                      : 'text-elaia-warm-gray hover:text-elaia-charcoal'
                  }`}
                >
                  {courses[key as keyof typeof courses].title}
                </button>
              ))}
            </div>
            </div>
            
          {/* Contenu du cours sélectionné */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={`https://images.unsplash.com/photo-${
                  selectedCourse === 'reformer' ? '1599901860146-d62f2ebdb5d4' :
                  selectedCourse === 'pilates' ? '1518611012118-696072aa579a' :
                  '1506126613715-e00b0af6e0a8'
                }?w=800`}
                alt={courses[selectedCourse as keyof typeof courses].title}
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="heading-md text-elaia-charcoal mb-4">
                {courses[selectedCourse as keyof typeof courses].title}
              </h3>
              <p className="text-lg font-lora italic text-ohemia-accent mb-6">
                {courses[selectedCourse as keyof typeof courses].subtitle}
              </p>
              <p className="body-lg text-elaia-warm-gray mb-8">
                {courses[selectedCourse as keyof typeof courses].description}
              </p>
              <div className="mb-8">
                <span className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray">
                  Intensité : 
                </span>
                <span className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal ml-2">
                  {courses[selectedCourse as keyof typeof courses].intensity}
                </span>
              </div>
              <Link to="/schedule" className="btn-accent">
                Explorer ce cours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Instructeurs */}
      <section className="section-padding bg-elaia-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-elaia-charcoal mb-4">
              Meet your instructors
            </h2>
            <p className="body-lg text-elaia-warm-gray max-w-2xl mx-auto">
              Une équipe passionnée et certifiée pour vous accompagner dans votre transformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {instructors.map((instructor, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${
                      index === 0 ? '1594381298921-9e18df7909f9' :
                      index === 1 ? '1573496359142-b8d87734a5a2' :
                      '1582534113276-784e6fb7c3dc'
                    }?w=400`}
                    alt={instructor.name}
                    className="w-full h-96 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="heading-sm text-elaia-charcoal mb-2">
                  {instructor.name}
                </h3>
                <p className="text-sm font-inter uppercase tracking-wider text-ohemia-accent mb-2">
                  {instructor.role}
                </p>
                <p className="text-sm text-elaia-warm-gray">
                  {instructor.specialty}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA Final */}
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
  );
} 