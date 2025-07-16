import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, MapPin, Star, TrendingUp, Info, Heart, Target, Zap, X } from 'lucide-react';
import { classService, bookingService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import customToast from '../utils/toast';
import { useNavigate, Link } from 'react-router-dom';

interface ClassSession {
  id: number;
  start_time: string;
  end_time: string;
  class_type_name: string;
  credits_required: number;
  available_spots: number;
  max_participants: number;
  instructor_first_name?: string;
  instructor_last_name?: string;
}

interface GeneratedClass {
  id: number;
  time: string;
  name: string;
  instructor: string;
  credits: number;
  spots: number;
  color: string;
  start_time: string;
  end_time: string;
  class_type_name: string;
  credits_required: number;
  available_spots: number;
  max_participants: number;
  instructor_first_name: string;
  instructor_last_name: string;
}

interface CourseInfo {
  name: string;
  description: string;
  benefits: string[];
  level: string;
  duration: string;
  credits: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const courseInfos: { [key: string]: CourseInfo } = {
  'Pilates Reformer Débutant': {
    name: 'Pilates Reformer Débutant',
    description: 'Parfait pour débuter en douceur avec le Pilates Reformer. Découvrez les mouvements de base et renforcez votre posture.',
    benefits: ['Améliore la posture', 'Renforce le core', 'Augmente la flexibilité', 'Réduit les tensions'],
    level: 'Débutant',
    duration: '55 minutes',
    credits: 3,
    icon: Heart,
    color: 'bg-elaia-gold'
  },
  'Pilates Reformer Intermédiaire': {
    name: 'Pilates Reformer Intermédiaire',
    description: 'Approfondissez votre pratique avec des exercices plus challengeants et des enchaînements fluides.',
    benefits: ['Développe la force', 'Améliore la coordination', 'Sculpte la silhouette', 'Augmente l\'endurance'],
    level: 'Intermédiaire',
    duration: '55 minutes',
    credits: 3,
    icon: Target,
    color: 'bg-elaia-green'
  },
  'Pilates Reformer Avancé': {
    name: 'Pilates Reformer Avancé',
    description: 'Pour les pratiquants expérimentés. Mouvements complexes et défis techniques pour repousser vos limites.',
    benefits: ['Performance optimale', 'Équilibre avancé', 'Force maximale', 'Contrôle précis'],
    level: 'Avancé',
    duration: '55 minutes',
    credits: 3,
    icon: Zap,
    color: 'bg-elaia-mint'
  },
  'Pilates Yoga Mat': {
    name: 'Pilates Yoga Mat',
    description: 'Fusion harmonieuse entre Pilates et Yoga sur tapis. Travail en profondeur du core et étirements.',
    benefits: ['Flexibilité accrue', 'Détente profonde', 'Renforcement doux', 'Connexion corps-esprit'],
    level: 'Tous niveaux',
    duration: '45 minutes',
    credits: 2,
    icon: Heart,
    color: 'bg-elaia-rose'
  },
  'Pilates Yoga Mat Détente': {
    name: 'Pilates Yoga Mat Détente',
    description: 'Séance relaxante combinant mouvements doux et étirements profonds pour évacuer le stress.',
    benefits: ['Relaxation totale', 'Améliore le sommeil', 'Réduit le stress', 'Équilibre mental'],
    level: 'Détente',
    duration: '45 minutes',
    credits: 2,
    icon: Heart,
    color: 'bg-purple-400'
  }
};

export default function SchedulePage() {
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [showCourseInfo, setShowCourseInfo] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Calculer la semaine actuelle avec l'offset
  const currentWeekStart = startOfWeek(addWeeks(new Date(), selectedWeekOffset), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Récupérer le planning pour la semaine
  const { data: classes, refetch } = useQuery({
    queryKey: ['schedule-week', format(currentWeekStart, 'yyyy-MM-dd')],
    queryFn: () => classService.getSchedule({ 
      date: format(currentWeekStart, 'yyyy-MM-dd'),
      view: 'week'
    }),
  });

  const handleBookClass = async (classId: number) => {
    if (!isAuthenticated) {
      customToast.error('Veuillez vous connecter pour réserver');
      navigate('/login');
      return;
    }

    setIsBooking(true);
    try {
      await bookingService.bookClass(classId.toString());
      customToast.success('Réservation confirmée !');
      refetch();
      setSelectedClass(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { suggest_waiting_list?: boolean; message?: string } } };
      if (err.response?.data?.suggest_waiting_list) {
        customToast.error('Ce cours est complet. Voulez-vous rejoindre la liste d\'attente ?');
      } else {
        customToast.error(err.response?.data?.message || 'Erreur lors de la réservation');
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleClassClick = (cls: ClassSession | GeneratedClass) => {
    if (!isAuthenticated) {
      // Pour les visiteurs, montrer d'abord l'info du cours
      setShowCourseInfo(cls.class_type_name);
    } else {
      // Pour les utilisateurs connectés, aller directement à la réservation
      setSelectedClass(cls as ClassSession);
    }
  };

  // Générer des cours pour une semaine (pour les visiteurs)
  const generateWeeklySchedule = (weekStart: Date) => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    const coursTypes = [
      { name: 'Pilates Reformer Débutant', credits: 3, color: 'bg-ohemia-accent' },
      { name: 'Pilates Reformer Intermédiaire', credits: 3, color: 'bg-elaia-sage' },
      { name: 'Pilates Reformer Avancé', credits: 3, color: 'bg-elaia-charcoal' },
      { name: 'Pilates Yoga Mat', credits: 2, color: 'bg-elaia-sand' },
      { name: 'Pilates Yoga Mat Détente', credits: 2, color: 'bg-elaia-warm-gray' },
    ];
    
    const instructors = ['Sarah Martin', 'Julie Dubois', 'Emma Rousseau', 'Claire Moreau'];
    const timeSlots = ['09:00', '10:30', '12:00', '14:00', '17:00', '18:30', '19:30'];
    
    return days.map(day => {
      const dayOfWeek = day.getDay();
      // 4-7 cours par jour
      const numClasses = dayOfWeek === 0 || dayOfWeek === 6 ? 
        Math.floor(Math.random() * 3) + 4 : // 4-6 cours les weekends
        Math.floor(Math.random() * 4) + 5;  // 5-8 cours en semaine
      
      const classes = Array.from({ length: numClasses }, (_, i) => {
        const courseType = coursTypes[Math.floor(Math.random() * coursTypes.length)];
        const instructor = instructors[Math.floor(Math.random() * instructors.length)];
        const time = timeSlots[i % timeSlots.length];
        
        return {
          id: Math.random(),
          time,
          name: courseType.name,
          instructor,
          credits: courseType.credits,
          spots: Math.floor(Math.random() * 8) + 2, // 2-9 places
          color: courseType.color,
          start_time: `${format(day, 'yyyy-MM-dd')}T${time}:00`,
          end_time: `${format(day, 'yyyy-MM-dd')}T${time}:55`,
          class_type_name: courseType.name,
          credits_required: courseType.credits,
          available_spots: Math.floor(Math.random() * 8) + 2,
          max_participants: 12,
          instructor_first_name: instructor.split(' ')[0],
          instructor_last_name: instructor.split(' ')[1]
        };
      }).sort((a, b) => a.time.localeCompare(b.time));
      
      return {
        date: day,
        classes
      };
    });
  };

  // Utiliser des données générées pour les visiteurs ou les vraies données pour les utilisateurs connectés
  const weekSchedule = !isAuthenticated ? generateWeeklySchedule(currentWeekStart) : null;

  const getClassesForDay = (day: Date): (ClassSession | GeneratedClass)[] => {
    if (!isAuthenticated && weekSchedule) {
      const daySchedule = weekSchedule.find(d => 
        format(d.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      return daySchedule?.classes || [];
    }
    
    return classes?.filter((cls: ClassSession) => 
      format(new Date(cls.start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ) || [];
  };

  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Hero Section */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1920" 
            alt="Planning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-elaia-charcoal/60 to-elaia-charcoal/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-elaia-white px-6">
          <h1 className="heading-xl mb-4">Planning</h1>
          <p className="body-lg max-w-2xl mx-auto opacity-90">
            {isAuthenticated 
              ? 'Réservez votre séance de Pilates Reformer' 
              : 'Découvrez notre planning hebdomadaire'
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          {!isAuthenticated && (
            <div className="bg-elaia-white border border-elaia-muted p-8 mb-12 text-center">
              <h2 className="heading-md text-elaia-charcoal mb-4">
                Plus de 150 cours par mois
              </h2>
              <p className="body-lg text-elaia-warm-gray mb-8">
                Rejoignez notre communauté et accédez à tous nos cours
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing" className="btn-accent">
                  Offre Welcome 45 CHF
                </Link>
                <Link to="/register" className="btn-secondary">
                  Créer un compte
                </Link>
              </div>
            </div>
          )}

        {/* Navigation par semaine */}
          <div className="bg-elaia-white border border-elaia-muted p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)}
                className="flex items-center text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors"
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Semaine précédente</span>
            </button>
            
            <div className="text-center">
                <h2 className="heading-sm text-elaia-charcoal mb-2">
                {format(currentWeekStart, 'MMMM yyyy', { locale: fr })}
              </h2>
                <p className="text-sm text-elaia-warm-gray">
                {format(currentWeekStart, 'd MMM', { locale: fr })} - {format(addDays(currentWeekStart, 6), 'd MMM', { locale: fr })}
              </p>
            </div>
            
            <button
              onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)}
                className="flex items-center text-sm font-inter uppercase tracking-wider text-elaia-charcoal hover:text-ohemia-accent transition-colors"
            >
                <span className="hidden sm:inline">Semaine suivante</span>
                <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>

            {/* Planning hebdomadaire moderne */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayClasses = getClassesForDay(day);
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                
              return (
                  <div 
                    key={day.toISOString()} 
                    className={`${isToday ? 'bg-elaia-light-gray' : 'bg-elaia-white'} border border-elaia-muted p-4`}
                  >
                  <div className="text-center mb-4">
                      <div className="text-xs font-inter uppercase tracking-wider text-elaia-warm-gray">
                      {format(day, 'EEE', { locale: fr })}
                    </div>
                      <div className="text-2xl font-playfair text-elaia-charcoal">
                      {format(day, 'd')}
                    </div>
                      {dayClasses.length > 0 && (
                        <div className="text-xs text-elaia-warm-gray mt-1">
                      {dayClasses.length} cours
                    </div>
                      )}
                  </div>
                  
                  <div className="space-y-2">
                    {dayClasses.map((cls, index: number) => (
                      <div
                        key={cls.id || index}
                          className="group cursor-pointer"
                        onClick={() => handleClassClick(cls)}
                      >
                          <div className="border border-elaia-muted p-3 hover:border-ohemia-accent transition-all">
                            <div className="text-sm font-inter text-elaia-charcoal">
                              {'time' in cls ? cls.time : format(new Date(cls.start_time), 'HH:mm')}
                            </div>
                            <div className="text-xs text-elaia-warm-gray truncate mt-1">
                          {'name' in cls ? cls.name : cls.class_type_name}
                        </div>
                            <div className="text-xs text-ohemia-accent mt-1">
                          {'credits' in cls ? cls.credits : cls.credits_required} crédits
                            </div>
                        </div>
                      </div>
                    ))}
                    
                    {dayClasses.length === 0 && (
                        <div className="text-center text-elaia-warm-gray text-xs py-8">
                        Aucun cours
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

          {/* Légende minimaliste */}
          <div className="flex flex-wrap gap-6 justify-center text-sm text-elaia-warm-gray">
            <div className="flex items-center">
              <div className="w-1 h-4 bg-ohemia-accent mr-3"></div>
              <span>Pilates Reformer (3 crédits)</span>
              </div>
            <div className="flex items-center">
              <div className="w-1 h-4 bg-elaia-sand mr-3"></div>
              <span>Pilates Yoga Mat (2 crédits)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Elaïa Studio - Gland</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal d'information sur les cours (visiteurs) */}
      {showCourseInfo && courseInfos[showCourseInfo] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-elaia-white max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="heading-md text-elaia-charcoal mb-2">
                  {courseInfos[showCourseInfo].name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-elaia-warm-gray">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {courseInfos[showCourseInfo].duration}
                  </span>
                  <span className="text-ohemia-accent">
                    {courseInfos[showCourseInfo].credits} crédits
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCourseInfo(null)}
                className="text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-8">
              <p className="body-md text-elaia-warm-gray leading-relaxed">
                {courseInfos[showCourseInfo].description}
              </p>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-4">
                Bénéfices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseInfos[showCourseInfo].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-1 h-1 bg-ohemia-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-elaia-warm-gray">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-elaia-muted pt-8">
              <p className="text-sm text-elaia-warm-gray text-center mb-6">
                Créez votre compte pour réserver ce cours
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/pricing"
                  className="btn-accent"
                  onClick={() => setShowCourseInfo(null)}
                >
                  Voir nos offres
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary"
                  onClick={() => setShowCourseInfo(null)}
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de réservation (utilisateurs connectés) */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-elaia-white max-w-md w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="heading-md text-elaia-charcoal">
                Confirmer la réservation
            </h3>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-elaia-warm-gray hover:text-elaia-charcoal transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-1">
                  Cours
                </p>
                <p className="text-elaia-charcoal font-semibold">
                {selectedClass.class_type_name}
              </p>
              </div>

              <div>
                <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-1">
                  Date & Heure
                </p>
                <p className="text-elaia-charcoal">
                  {format(new Date(selectedClass.start_time), 'EEEE d MMMM', { locale: fr })} à {format(new Date(selectedClass.start_time), 'HH:mm')}
                </p>
              </div>

              <div>
                <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-1">
                  Instructeur
                </p>
                <p className="text-elaia-charcoal">
                  {selectedClass.instructor_first_name} {selectedClass.instructor_last_name}
                </p>
              </div>

              <div>
                <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-1">
                  Places disponibles
                </p>
                <p className="text-elaia-charcoal">
                  {selectedClass.available_spots} / {selectedClass.max_participants}
                </p>
              </div>

              <div className="pt-4 border-t border-elaia-muted">
                <p className="text-sm font-inter uppercase tracking-wider text-elaia-warm-gray mb-1">
                  Crédits requis
                </p>
                <p className="text-2xl font-playfair text-ohemia-accent">
                  {selectedClass.credits_required}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleBookClass(selectedClass.id)}
                disabled={isBooking}
                className="btn-accent flex-1 disabled:opacity-50"
              >
                {isBooking ? 'Réservation...' : 'Confirmer'}
              </button>
              <button
                onClick={() => setSelectedClass(null)}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 