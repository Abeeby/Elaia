import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, TrendingUp, Calendar, BarChart3, Download } from 'lucide-react';
import { adminService } from '../../services/api';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ClassAttendanceData {
  className: string;
  totalBookings: number;
  averageAttendance: number;
  maxCapacity: number;
  fillRate: number;
  trend: 'up' | 'down' | 'stable';
}

export default function ClassAttendance() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Données simulées pour la démonstration
  const classAttendanceData: ClassAttendanceData[] = [
    {
      className: 'Pilates Reformer Débutant',
      totalBookings: 156,
      averageAttendance: 8.5,
      maxCapacity: 12,
      fillRate: 71,
      trend: 'up'
    },
    {
      className: 'Pilates Reformer Intermédiaire',
      totalBookings: 189,
      averageAttendance: 9.2,
      maxCapacity: 12,
      fillRate: 77,
      trend: 'up'
    },
    {
      className: 'Pilates Reformer Avancé',
      totalBookings: 98,
      averageAttendance: 6.8,
      maxCapacity: 12,
      fillRate: 57,
      trend: 'stable'
    },
    {
      className: 'Pilates Yoga Mat',
      totalBookings: 234,
      averageAttendance: 10.5,
      maxCapacity: 15,
      fillRate: 70,
      trend: 'up'
    },
    {
      className: 'Pilates Yoga Mat Détente',
      totalBookings: 145,
      averageAttendance: 8.9,
      maxCapacity: 15,
      fillRate: 59,
      trend: 'down'
    }
  ];

  // Graphique de fréquentation par jour de la semaine
  const weeklyAttendanceData = {
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    datasets: [
      {
        label: 'Pilates Reformer',
        data: [32, 38, 35, 42, 40, 28, 22],
        backgroundColor: 'rgba(214, 184, 143, 0.8)',
        borderColor: '#D6B88F',
        borderWidth: 2,
      },
      {
        label: 'Pilates Yoga Mat',
        data: [25, 30, 28, 35, 32, 24, 18],
        backgroundColor: 'rgba(44, 62, 61, 0.8)',
        borderColor: '#2C3E3D',
        borderWidth: 2,
      }
    ],
  };

  // Graphique de tendance mensuelle
  const monthlyTrendData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Taux de remplissage moyen (%)',
        data: [65, 68, 72, 70, 75, 78],
        borderColor: '#D6B88F',
        backgroundColor: 'rgba(214, 184, 143, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const exportData = () => {
    // Logique d'export des données
    console.log('Exporting attendance data...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Fréquentation des cours
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Analyse détaillée de la participation aux cours
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-elaia-charcoal text-white rounded-lg hover:bg-elaia-charcoal/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cours
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
              >
                <option value="all">Tous les cours</option>
                <option value="reformer">Pilates Reformer</option>
                <option value="mat">Pilates Yoga Mat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques par cours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {classAttendanceData.map((classData, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{classData.className}</h3>
                <div className={`flex items-center text-sm ${
                  classData.trend === 'up' ? 'text-green-600' : 
                  classData.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    classData.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {classData.trend === 'up' ? '+' : classData.trend === 'down' ? '-' : ''}
                  {classData.trend !== 'stable' && '5%'}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Réservations totales</span>
                  <span className="font-semibold">{classData.totalBookings}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Participants moyens</span>
                  <span className="font-semibold">
                    {classData.averageAttendance}/{classData.maxCapacity}
                  </span>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">Taux de remplissage</span>
                    <span className="font-semibold">{classData.fillRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        classData.fillRate >= 80 ? 'bg-green-500' :
                        classData.fillRate >= 60 ? 'bg-elaia-gold' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${classData.fillRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fréquentation par jour de la semaine
            </h3>
            <div className="h-64">
              <Bar data={weeklyAttendanceData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Évolution du taux de remplissage
            </h3>
            <div className="h-64">
              <Line data={monthlyTrendData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recommandations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">Pilates Reformer Intermédiaire</span> affiche un excellent taux de remplissage. 
                  Considérez l'ajout de créneaux supplémentaires.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">Pilates Yoga Mat Détente</span> montre une baisse de fréquentation. 
                  Une promotion ciblée pourrait relancer l'intérêt.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="text-gray-700">
                  Les <span className="font-medium">créneaux du week-end</span> sont moins fréquentés. 
                  Proposez des tarifs préférentiels ou des cours spéciaux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
