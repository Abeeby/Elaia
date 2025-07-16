import { useState, useEffect } from 'react';
import { Star, Award, Target, Flame, Crown, Gift, Zap, Heart, Trophy, Medal } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: {
    type: 'credits' | 'discount' | 'freeSession';
    value: number;
    description: string;
  };
}

interface LoyaltyLevel {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
  icon: any;
}

interface GamificationProps {
  userStats: {
    totalSessions: number;
    currentStreak: number;
    longestStreak: number;
    totalCreditsUsed: number;
    monthsActive: number;
    favoriteClass: string;
    totalPoints: number;
  };
}

const achievements: Achievement[] = [
  {
    id: 'first-session',
    title: 'Premier Pas',
    description: 'Complétez votre première séance',
    icon: Star,
    unlocked: true,
    unlockedAt: '2024-01-15',
    rarity: 'common',
    reward: { type: 'credits', value: 1, description: '1 crédit bonus' }
  },
  {
    id: 'week-warrior',
    title: 'Guerrier Hebdomadaire',
    description: 'Complétez 3 séances en une semaine',
    icon: Flame,
    unlocked: true,
    unlockedAt: '2024-02-01',
    rarity: 'rare',
    reward: { type: 'discount', value: 10, description: '10% sur votre prochain pack' }
  },
  {
    id: 'streak-master',
    title: 'Maître de la Régularité',
    description: 'Maintenez une série de 10 séances',
    icon: Target,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    rarity: 'epic',
    reward: { type: 'freeSession', value: 1, description: '1 séance gratuite' }
  },
  {
    id: 'pilates-expert',
    title: 'Expert Pilates',
    description: 'Complétez 50 séances au total',
    icon: Crown,
    unlocked: false,
    progress: 23,
    maxProgress: 50,
    rarity: 'legendary',
    reward: { type: 'credits', value: 5, description: '5 crédits bonus' }
  },
  {
    id: 'early-bird',
    title: 'Lève-tôt',
    description: 'Assistez à 5 cours matinaux (avant 9h)',
    icon: Zap,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rarity: 'rare',
    reward: { type: 'discount', value: 15, description: '15% sur les cours matinaux' }
  },
  {
    id: 'wellness-champion',
    title: 'Champion du Bien-être',
    description: 'Essayez tous les types de cours',
    icon: Heart,
    unlocked: false,
    progress: 4,
    maxProgress: 8,
    rarity: 'epic',
    reward: { type: 'freeSession', value: 2, description: '2 séances gratuites' }
  }
];

const loyaltyLevels: LoyaltyLevel[] = [
  {
    level: 1,
    name: 'Nouveau',
    minPoints: 0,
    maxPoints: 100,
    benefits: ['Accès aux cours débutants', 'Support client prioritaire'],
    color: 'text-gray-600',
    icon: Star
  },
  {
    level: 2,
    name: 'Explorateur',
    minPoints: 101,
    maxPoints: 300,
    benefits: ['5% de réduction', 'Accès aux événements spéciaux'],
    color: 'text-green-600',
    icon: Award
  },
  {
    level: 3,
    name: 'Passionné',
    minPoints: 301,
    maxPoints: 600,
    benefits: ['10% de réduction', 'Réservation prioritaire', '1 cours gratuit/mois'],
    color: 'text-blue-600',
    icon: Trophy
  },
  {
    level: 4,
    name: 'Expert',
    minPoints: 601,
    maxPoints: 1000,
    benefits: ['15% de réduction', 'Coaching personnel', 'Accès VIP'],
    color: 'text-purple-600',
    icon: Medal
  },
  {
    level: 5,
    name: 'Maître',
    minPoints: 1001,
    maxPoints: Infinity,
    benefits: ['20% de réduction', 'Cours privés gratuits', 'Programme personnalisé'],
    color: 'text-gold-600',
    icon: Crown
  }
];

const rarityColors = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50'
};

const rarityTextColors = {
  common: 'text-gray-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-yellow-600'
};

export default function GamificationSystem({ userStats }: GamificationProps) {
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'loyalty'>('achievements');
  const [showRewardModal, setShowRewardModal] = useState<Achievement | null>(null);

  const currentLevel = loyaltyLevels.find(level => 
    userStats.totalPoints >= level.minPoints && userStats.totalPoints <= level.maxPoints
  ) || loyaltyLevels[0];

  const nextLevel = loyaltyLevels.find(level => level.level === currentLevel.level + 1);
  const progressToNext = nextLevel ? 
    ((userStats.totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 : 100;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  useEffect(() => {
    // Vérifier les nouveaux achievements
    const checkAchievements = () => {
      achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.progress && achievement.maxProgress) {
          if (achievement.progress >= achievement.maxProgress) {
            // Débloquer l'achievement
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            setShowRewardModal(achievement);
          }
        }
      });
    };

    checkAchievements();
  }, [userStats]);

  const ProgressBar = ({ progress, max, className = "" }: { progress: number, max: number, className?: string }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-elaia-gold h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${(progress / max) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex bg-white rounded-lg shadow-md p-1 mb-6">
        <button
          onClick={() => setSelectedTab('achievements')}
          className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
            selectedTab === 'achievements'
              ? 'bg-elaia-gold text-white'
              : 'text-elaia-gray hover:bg-gray-100'
          }`}
        >
          <Trophy className="h-5 w-5 inline mr-2" />
          Achievements
        </button>
        <button
          onClick={() => setSelectedTab('loyalty')}
          className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
            selectedTab === 'loyalty'
              ? 'bg-elaia-gold text-white'
              : 'text-elaia-gray hover:bg-gray-100'
          }`}
        >
          <Crown className="h-5 w-5 inline mr-2" />
          Programme Fidélité
        </button>
      </div>

      {selectedTab === 'achievements' && (
        <div className="space-y-6">
          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-elaia-gold">
                <AnimatedCounter end={unlockedAchievements.length} />
              </div>
              <p className="text-sm text-gray-600">Achievements débloqués</p>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-elaia-green">
                <AnimatedCounter end={userStats.currentStreak} />
              </div>
              <p className="text-sm text-gray-600">Série actuelle</p>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-elaia-mint">
                <AnimatedCounter end={userStats.totalSessions} />
              </div>
              <p className="text-sm text-gray-600">Séances totales</p>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">
                <AnimatedCounter end={userStats.totalPoints} />
              </div>
              <p className="text-sm text-gray-600">Points fidélité</p>
            </div>
          </div>

          {/* Achievements débloqués */}
          <div>
            <h3 className="text-xl font-semibold text-elaia-gray mb-4">
              🏆 Achievements Débloqués ({unlockedAchievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${rarityColors[achievement.rarity]} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${rarityTextColors[achievement.rarity]} bg-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-elaia-gray">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        {achievement.reward && (
                          <div className="text-xs text-elaia-gold font-medium">
                            🎁 {achievement.reward.description}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Débloqué le {new Date(achievement.unlockedAt!).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements en cours */}
          <div>
            <h3 className="text-xl font-semibold text-elaia-gray mb-4">
              🎯 En Cours ({lockedAchievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 opacity-75 ${rarityColors[achievement.rarity]} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${rarityTextColors[achievement.rarity]} bg-white opacity-60`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-elaia-gray">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        {achievement.progress && achievement.maxProgress && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                              <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                            </div>
                            <ProgressBar progress={achievement.progress} max={achievement.maxProgress} />
                          </div>
                        )}
                        {achievement.reward && (
                          <div className="text-xs text-elaia-gold font-medium mt-2">
                            🎁 Récompense: {achievement.reward.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'loyalty' && (
        <div className="space-y-6">
          {/* Niveau actuel */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full bg-elaia-gold/20 ${currentLevel.color}`}>
                  <currentLevel.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-elaia-gray">
                    Niveau {currentLevel.level}: {currentLevel.name}
                  </h3>
                  <p className="text-gray-600">
                    <AnimatedCounter end={userStats.totalPoints} /> points fidélité
                  </p>
                </div>
              </div>
              <div className="text-right">
                {nextLevel && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Prochain niveau:</span> {nextLevel.name}
                    <br />
                    <span className="text-elaia-gold">
                      {nextLevel.minPoints - userStats.totalPoints} points restants
                    </span>
                  </div>
                )}
              </div>
            </div>

            {nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression vers {nextLevel.name}</span>
                  <span>{Math.round(progressToNext)}%</span>
                </div>
                <ProgressBar progress={progressToNext} max={100} />
              </div>
            )}
          </div>

          {/* Avantages actuels */}
          <div className="card">
            <h4 className="text-lg font-semibold text-elaia-gray mb-4">
              🎁 Vos avantages actuels
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLevel.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-elaia-gold" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tous les niveaux */}
          <div className="card">
            <h4 className="text-lg font-semibold text-elaia-gray mb-4">
              📊 Tous les niveaux
            </h4>
            <div className="space-y-4">
              {loyaltyLevels.map((level) => {
                const LevelIcon = level.icon;
                const isCurrentLevel = level.level === currentLevel.level;
                const isUnlocked = userStats.totalPoints >= level.minPoints;
                
                return (
                  <div
                    key={level.level}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCurrentLevel 
                        ? 'border-elaia-gold bg-elaia-gold/10' 
                        : isUnlocked 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${level.color} ${isUnlocked ? 'bg-white' : 'bg-gray-200 opacity-50'}`}>
                          <LevelIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h5 className="font-semibold">
                            Niveau {level.level}: {level.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {level.minPoints === 0 ? '0' : level.minPoints}
                            {level.maxPoints === Infinity ? '+' : ` - ${level.maxPoints}`} points
                          </p>
                        </div>
                      </div>
                      {isCurrentLevel && (
                        <span className="px-3 py-1 bg-elaia-gold text-white text-sm rounded-full">
                          Actuel
                        </span>
                      )}
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {level.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className={`text-sm ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal de récompense */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center animate-fade-in-up">
            <div className="mb-4">
              <div className="w-16 h-16 bg-elaia-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <showRewardModal.icon className="h-8 w-8 text-elaia-gold" />
              </div>
              <h3 className="text-2xl font-bold text-elaia-gray mb-2">
                🎉 Achievement Débloqué !
              </h3>
              <h4 className="text-lg font-semibold text-elaia-gold mb-2">
                {showRewardModal.title}
              </h4>
              <p className="text-gray-600 mb-4">
                {showRewardModal.description}
              </p>
              {showRewardModal.reward && (
                <div className="p-3 bg-elaia-gold/10 rounded-lg mb-4">
                  <p className="font-medium text-elaia-gold">
                    🎁 Récompense: {showRewardModal.reward.description}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowRewardModal(null)}
              className="btn-primary w-full"
            >
              Fantastique !
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 