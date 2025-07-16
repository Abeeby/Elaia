import { useState } from 'react';
import { 
  Calendar, Plus, Edit, Trash2, Users, Clock,
  ChevronLeft, ChevronRight, Star, X, Save
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import customToast from '../../utils/toast';

// Types pour les cours
interface ClassSession {
  id: number;
  class_type_name: string;
  instructor_first_name: string;
  instructor_last_name: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_bookings: number;
  credits_required: number;
  room: string;
}

interface ClassType {
  id: number;
  name: string;
  credits_required: number;
  duration: number;
}

interface Instructor {
  id: number;
  first_name: string;
  last_name: string;
}

export default function AdminClasses() {
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  
  // Calculer la semaine actuelle
  const currentWeekStart = startOfWeek(addWeeks(new Date(), selectedWeekOffset), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Types de cours disponibles
  const classTypes: ClassType[] = [
    { id: 1, name: 'Reformer Classique', credits_required: 3, duration: 50 },
    { id: 2, name: 'Reformer Dynamique Flow', credits_required: 3, duration: 50 },
    { id: 3, name: 'Reformer Booty & Core', credits_required: 3, duration: 45 },
    { id: 4, name: 'Reformer Balance', credits_required: 3, duration: 50 },
    { id: 5, name: 'Pré & Post-natal', credits_required: 3, duration: 45 },
    { id: 6, name: 'Power Vinyasa Yoga', credits_required: 2, duration: 60 },
    { id: 7, name: 'Yoga Doux', credits_required: 2, duration: 60 },
    { id: 8, name: 'Pilates', credits_required: 2, duration: 50 },
  ];

  // Instructeurs disponibles
  const instructors: Instructor[] = [
    { id: 1, first_name: 'Albina', last_name: 'Zeqiri' },
    { id: 2, first_name: 'Baptist', last_name: 'Mercereau' },
    { id: 3, first_name: 'Sarah', last_name: 'Martin' },
    { id: 4, first_name: 'Julie', last_name: 'Dubois' },
  ];

  // Données de cours fictives pour la démo
  const generateMockClasses = (): ClassSession[] => {
    const classes: ClassSession[] = [];
    let classId = 1;

    weekDays.forEach((day, dayIndex) => {
      // 3-5 cours par jour
      const numClasses = 3 + Math.floor(Math.random() * 3);
      const timeSlots = ['09:00', '10:30', '12:00', '14:00', '17:00', '18:30'];
      
      for (let i = 0; i < numClasses && i < timeSlots.length; i++) {
        const courseType = classTypes[Math.floor(Math.random() * classTypes.length)];
        const instructor = instructors[Math.floor(Math.random() * instructors.length)];
        const time = timeSlots[i];
        
        const startTime = new Date(day);
        const [hours, minutes] = time.split(':').map(Number);
        startTime.setHours(hours, minutes, 0, 0);
        
        const endTime = new Date(startTime.getTime() + courseType.duration * 60000);
        
        classes.push({
          id: classId++,
          class_type_name: courseType.name,
          instructor_first_name: instructor.first_name,
          instructor_last_name: instructor.last_name,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          max_participants: 8,
          current_bookings: Math.floor(Math.random() * 8),
          credits_required: courseType.credits_required,
          room: 'Studio Principal'
        });
      }
    });

    return classes;
  };

  const [classes] = useState<ClassSession[]>(generateMockClasses());

  const getClassesForDay = (day: Date): ClassSession[] => {
    return classes.filter(cls => 
      isSameDay(new Date(cls.start_time), day)
    );
  };

  const getClassTypeColor = (typeName: string) => {
    const colorMap: Record<string, string> = {
      'Reformer Classique': 'bg-elaia-gold',
      'Reformer Dynamique Flow': 'bg-elaia-green',
      'Reformer Booty & Core': 'bg-elaia-mint',
      'Reformer Balance': 'bg-elaia-rose',
      'Pré & Post-natal': 'bg-purple-400',
      'Power Vinyasa Yoga': 'bg-red-400',
      'Yoga Doux': 'bg-blue-400',
      'Pilates': 'bg-yellow-400',
    };
    return colorMap[typeName] || 'bg-gray-400';
  };

  const handleDeleteClass = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Les clients réservés seront automatiquement notifiés.')) {
      customToast.success('Cours supprimé avec succès ! Les clients ont été notifiés.');
      // Ici vous intégreriez l'API de suppression
    }
  };

  const handleAddClass = (formData: FormData) => {
    const classType = formData.get('class_type') as string;
    const instructor = formData.get('instructor') as string;
    const dateTime = formData.get('datetime') as string;
    const maxParticipants = formData.get('max_participants') as string;

    if (classType && instructor && dateTime && maxParticipants) {
      customToast.success('Cours ajouté avec succès !');
      setShowAddModal(false);
      // Ici vous intégreriez l'API d'ajout
    }
  };

  const handleEditClass = (formData: FormData) => {
    customToast.success('Cours modifié avec succès !');
    setShowEditModal(false);
    setSelectedClass(null);
    // Ici vous intégreriez l'API de modification
  };

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-elaia-gray mb-2">
              Gestion du planning
            </h1>
            <p className="text-lg text-elaia-gray">
              Gérez vos cours de manière autonome - Plus besoin de nous contacter !
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un cours
          </button>
        </div>

        {/* Guide d'utilisation */}
        <div className="bg-gradient-to-r from-elaia-gold/10 to-elaia-green/10 border border-elaia-gold/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-elaia-gray mb-3 flex items-center">
            <Star className="h-5 w-5 mr-2 text-elaia-gold" />
            Interface de gestion autonome - Vous êtes indépendant !
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-elaia-gray">
            <div>
              <strong>➕ Ajouter :</strong> Cliquez sur "Ajouter un cours" ou utilisez les boutons d'ajout rapide dans chaque jour
            </div>
            <div>
              <strong>✏️ Modifier :</strong> Cliquez directement sur un cours existant pour le modifier
            </div>
            <div>
              <strong>🗑️ Supprimer :</strong> Utilisez l'icône poubelle qui apparaît au survol d'un cours
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-elaia-gray">
              <strong>💡 Astuce :</strong> Tous les changements sont instantanés. Les clients voient immédiatement les nouveaux cours disponibles et sont automatiquement notifiés des modifications.
            </p>
          </div>
        </div>

        {/* Navigation par semaine */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Semaine précédente
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-elaia-gray">
                {format(currentWeekStart, 'MMMM yyyy', { locale: fr })}
              </h2>
              <p className="text-sm text-gray-600">
                {format(currentWeekStart, 'd MMM', { locale: fr })} - {format(addDays(currentWeekStart, 6), 'd MMM', { locale: fr })}
              </p>
            </div>
            
            <button
              onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Semaine suivante
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>

          {/* Planning hebdomadaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayClasses = getClassesForDay(day);
              return (
                <div key={day.toISOString()} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className="font-semibold text-elaia-gray">
                      {format(day, 'EEE', { locale: fr })}
                    </div>
                    <div className="text-2xl font-bold text-elaia-gray">
                      {format(day, 'd')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {dayClasses.length} cours
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className={`p-3 rounded-lg text-white text-sm relative group cursor-pointer ${getClassTypeColor(cls.class_type_name)} hover:shadow-lg transition-all`}
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowEditModal(true);
                        }}
                      >
                        <div className="font-medium">
                          {format(new Date(cls.start_time), 'HH:mm')}
                        </div>
                        <div className="text-xs opacity-90 truncate">
                          {cls.class_type_name}
                        </div>
                        <div className="text-xs opacity-75">
                          {cls.instructor_first_name} {cls.instructor_last_name}
                        </div>
                        <div className="text-xs opacity-75 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {cls.current_bookings}/{cls.max_participants}
                        </div>
                        
                        {/* Actions au survol */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClass(cls);
                                setShowEditModal(true);
                              }}
                              className="p-1 bg-white/20 rounded hover:bg-white/40 transition-colors"
                              title="Modifier le cours"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(cls.id);
                              }}
                              className="p-1 bg-white/20 rounded hover:bg-red-500/80 transition-colors"
                              title="Supprimer le cours"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dayClasses.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-6">
                        Aucun cours planifié
                      </div>
                    )}
                    
                    {/* Bouton d'ajout rapide pour chaque jour */}
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-elaia-gold hover:text-elaia-gold hover:bg-elaia-gold/5 transition-all text-sm font-medium"
                    >
                      + Ajouter un cours
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques en temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cours cette semaine</p>
                <p className="text-3xl font-bold text-elaia-gray">{classes.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-elaia-gold" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Réservations totales</p>
                <p className="text-3xl font-bold text-elaia-gray">
                  {classes.reduce((sum, cls) => sum + cls.current_bookings, 0)}
                </p>
              </div>
              <Users className="h-10 w-10 text-elaia-green" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux d'occupation</p>
                <p className="text-3xl font-bold text-elaia-gray">
                  {Math.round(
                    (classes.reduce((sum, cls) => sum + cls.current_bookings, 0) /
                     classes.reduce((sum, cls) => sum + cls.max_participants, 0)) * 100
                  )}%
                </p>
              </div>
              <Clock className="h-10 w-10 text-elaia-mint" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus estimés</p>
                <p className="text-3xl font-bold text-elaia-gray">
                  {Math.round(classes.reduce((sum, cls) => sum + (cls.current_bookings * cls.credits_required * 15), 0))} CHF
                </p>
              </div>
              <Star className="h-10 w-10 text-elaia-rose" />
            </div>
          </div>
        </div>

        {/* Légende des couleurs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-elaia-gray mb-4">Types de cours et couleurs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {classTypes.map((type) => (
              <div key={type.id} className="flex items-center">
                <div className={`w-4 h-4 ${getClassTypeColor(type.name)} rounded mr-3`}></div>
                <div>
                  <div className="font-medium text-sm text-elaia-gray">{type.name}</div>
                  <div className="text-xs text-gray-600">{type.credits_required} crédits • {type.duration}min</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal d'ajout de cours */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-elaia-gray">Ajouter un cours</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddClass(new FormData(e.currentTarget));
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de cours *
                </label>
                <select 
                  name="class_type"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un type de cours</option>
                  {classTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.credits_required} crédits - {type.duration}min)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructeur *
                </label>
                <select 
                  name="instructor"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un instructeur</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.first_name} {instructor.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de début *
                </label>
                <input 
                  type="datetime-local" 
                  name="datetime"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de places maximum
                </label>
                <input 
                  type="number" 
                  name="max_participants"
                  defaultValue="8"
                  min="1" 
                  max="20"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salle
                </label>
                <select 
                  name="room"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                >
                  <option value="Studio Principal">Studio Principal</option>
                  <option value="Studio 2">Studio 2</option>
                  <option value="Salle Yoga">Salle Yoga</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Ajouter le cours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification de cours */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-elaia-gray">Modifier le cours</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Informations actuelles */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Informations actuelles</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Réservations: </span>
                  <span className="font-medium">{selectedClass.current_bookings}/{selectedClass.max_participants}</span>
                </div>
                <div>
                  <span className="text-gray-600">Revenus: </span>
                  <span className="font-medium">{selectedClass.current_bookings * selectedClass.credits_required * 15} CHF</span>
                </div>
              </div>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleEditClass(new FormData(e.currentTarget));
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de cours *
                </label>
                <select 
                  name="class_type"
                  defaultValue={selectedClass.class_type_name}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                  required
                >
                  {classTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name} ({type.credits_required} crédits - {type.duration}min)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de début *
                </label>
                <input 
                  type="datetime-local" 
                  name="datetime"
                  defaultValue={format(new Date(selectedClass.start_time), "yyyy-MM-dd'T'HH:mm")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de places maximum
                </label>
                <input 
                  type="number" 
                  name="max_participants"
                  defaultValue={selectedClass.max_participants}
                  min="1" 
                  max="20"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
                />
                {selectedClass.current_bookings > 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Attention: {selectedClass.current_bookings} personnes sont déjà inscrites
                  </p>
                )}
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => handleDeleteClass(selectedClass.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 