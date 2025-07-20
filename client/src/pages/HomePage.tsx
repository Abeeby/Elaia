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
          scale: 0.15, 
          y: "calc(-50vh + 2rem)", 
          x: "calc(-50vw + 5rem)", 
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
            top: '1rem', 
            left: '2rem', 
            transform: 'scale(0.15)', 
            zIndex: 1000 
          });
        },
        onEnterBack: () => {
          gsap.set(logoRef.current, { 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) scale(0.15)',
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

      {/* Section Introduction */}
      <section id="intro-section" className="section-padding bg-elaia-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-lg text-elaia-charcoal mb-8">
                Un espace dédié à votre transformation
              </h2>
              <p className="body-lg text-elaia-warm-gray mb-6">
                ELAÏA est né de la passion d'Albina, instructrice diplômée avec maîtrise fédérale, 
                pour transmettre une pratique du Pilates exigeante et bienveillante.
              </p>
              <p className="body-md text-elaia-warm-gray mb-8">
                Notre studio de 120m² équipé de 8 Reformers haut de gamme vous accueille 
                dans un cadre moderne et apaisant, conçu pour votre confort et votre progression.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-1 h-16 bg-ohemia-accent mr-6"></div>
                  <div>
                    <h3 className="font-inter font-semibold text-elaia-charcoal mb-2">Excellence</h3>
                    <p className="text-elaia-warm-gray">Formation continue et équipement premium</p>
            </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-16 bg-ohemia-accent mr-6"></div>
                  <div>
                    <h3 className="font-inter font-semibold text-elaia-charcoal mb-2">Personnalisation</h3>
                    <p className="text-elaia-warm-gray">Cours adaptés à vos besoins et objectifs</p>
                </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800" 
                alt="Studio intérieur"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-elaia-charcoal text-elaia-white p-8 max-w-xs">
                <p className="text-3xl font-playfair mb-2">10+</p>
                <p className="text-sm uppercase tracking-wider">Années d'expérience</p>
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

      {/* Section Offre */}
      <section className="relative py-32 overflow-hidden">
        <div className="relative container-custom text-center">
          <h2 className="heading-lg text-elaia-charcoal mb-4">
            Offre Welcome
          </h2>
          <p className="text-2xl font-lora italic text-ohemia-accent mb-8">
            Votre première expérience ELAÏA
            </p>
          <div className="max-w-xl mx-auto bg-elaia-white p-12 shadow-lg">
            <p className="text-5xl font-playfair text-elaia-charcoal mb-4">
              45 CHF
            </p>
            <p className="text-lg text-elaia-warm-gray mb-8">
              1 séance achetée + 1 offerte<br />
              <span className="text-sm">Valable pour les nouveaux clients uniquement</span>
            </p>
            <Link to="/register" className="btn-primary">
              Profiter de l'offre
            </Link>
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