import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Calendar, CreditCard, Activity, Award, Clock, Euro, ArrowUp, ArrowDown } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { adminService } from '../../services/api';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
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

export default function AdminDashboard() {
  // Récupérer les statistiques
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
  });

  // Récupérer les réservations récentes
  const { data: recentBookings } = useQuery({
    queryKey: ['admin-recent-bookings'],
    queryFn: () => adminService.getBookings({ limit: 5 }),
  });

  // Récupérer les nouveaux clients
  const { data: newClients } = useQuery({
    queryKey: ['admin-new-clients'],
    queryFn: () => adminService.getClients({ 
      registered_after: format(startOfMonth(new Date()), 'yyyy-MM-dd') 
    }),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Données pour le graphique de revenus
  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Revenus mensuels',
        data: [12000, 15000, 13500, 17000, 16000, 19000],
        borderColor: '#D6B88F',
        backgroundColor: 'rgba(214, 184, 143, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Données pour le graphique des réservations
  const bookingsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Réservations',
        data: [45, 52, 48, 58, 55, 42, 38],
        backgroundColor: '#2C3E3D',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  const statsCards = [
    {
      title: 'Clients actifs',
      value: stats?.activeClients || 0,
      previousValue: stats?.previousActiveClients || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Revenus du mois',
      value: formatCurrency(stats?.monthlyRevenue || 0),
      previousValue: stats?.previousMonthlyRevenue || 0,
      icon: Euro,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Réservations',
      value: stats?.monthlyBookings || 0,
      previousValue: stats?.previousMonthlyBookings || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Taux de remplissage',
      value: `${stats?.occupancyRate || 0}%`,
      previousValue: stats?.previousOccupancyRate || 0,
      icon: Activity,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ohemia-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Bienvenue dans votre espace d'administration
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const growth = calculateGrowth(
              typeof stat.value === 'string' ? parseFloat(stat.value) : stat.value,
              stat.previousValue
            );
            const isPositive = growth >= 0;

            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(growth)}%
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus</h3>
            <div className="h-64">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Réservations par jour</h3>
            <div className="h-64">
              <Bar data={bookingsData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Réservations récentes</h3>
                <Link to="/admin/bookings" className="text-sm text-ohemia-accent hover:text-ohemia-accent/80">
                  Voir tout →
                </Link>
              </div>
            </div>
            <div className="divide-y">
              {recentBookings?.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.user?.first_name} {booking.user?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.class?.name} - {format(new Date(booking.class?.start_time), 'dd/MM à HH:mm')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Clients */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nouveaux clients</h3>
                <Link to="/admin/users" className="text-sm text-ohemia-accent hover:text-ohemia-accent/80">
                  Voir tout →
                </Link>
              </div>
            </div>
            <div className="divide-y">
              {newClients?.slice(0, 5).map((client: any) => (
                <div key={client.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-elaia-warm-gray/20 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-elaia-charcoal">
                          {client.first_name?.[0]}{client.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {client.first_name} {client.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(client.created_at), 'dd/MM')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 