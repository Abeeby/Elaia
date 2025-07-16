import { useState } from 'react';
import { 
  TrendingUp, Users, Calendar, Euro, Clock,
  Download, BarChart3, PieChart, Activity, Star,
  ArrowUp, ArrowDown, Minus, FileText, AlertCircle
} from 'lucide-react';
import customToast from '../../utils/toast';
import { exportRevenueData, exportClassData, exportClientData } from '../../utils/exportUtils';
import Breadcrumbs from '../../components/Breadcrumbs';

// Types pour les données
interface MetricData {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  newClients: number;
}

interface ClassPopularity {
  name: string;
  bookings: number;
  revenue: number;
  averageOccupancy: number;
  growth: number;
}

interface ClientRetention {
  segment: string;
  count: number;
  percentage: number;
  color: string;
}

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);

  // Données réalistes pour Elaïa Studio Gland - Phase de lancement
  const metrics: Record<string, MetricData> = {
    revenue: { value: 12650, change: 18.7, trend: 'up', period: '30 derniers jours' },
    clients: { value: 89, change: 23.4, trend: 'up', period: '30 derniers jours' },
    bookings: { value: 156, change: 15.6, trend: 'up', period: '30 derniers jours' },
    occupancy: { value: 68, change: 12.3, trend: 'up', period: '30 derniers jours' },
    avgSessionValue: { value: 52, change: 8.9, trend: 'up', period: '30 derniers jours' },
    retention: { value: 85, change: 4.2, trend: 'up', period: '30 derniers jours' }
  };

  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 8200, bookings: 98, newClients: 18 },
    { month: 'Fév', revenue: 9400, bookings: 112, newClients: 22 },
    { month: 'Mar', revenue: 10800, bookings: 134, newClients: 19 },
    { month: 'Avr', revenue: 11200, bookings: 142, newClients: 16 },
    { month: 'Mai', revenue: 12100, bookings: 151, newClients: 24 },
    { month: 'Juin', revenue: 12650, bookings: 156, newClients: 21 }
  ];

  const classPopularity: ClassPopularity[] = [
    { name: 'Reformer Classique', bookings: 145, revenue: 6525, averageOccupancy: 87, growth: 15.2 },
    { name: 'Reformer Dynamique Flow', bookings: 132, revenue: 5940, averageOccupancy: 82, growth: 8.7 },
    { name: 'Reformer Booty & Core', bookings: 98, revenue: 4410, averageOccupancy: 76, growth: 22.1 },
    { name: 'Yoga Doux', bookings: 87, revenue: 2610, averageOccupancy: 73, growth: -5.3 },
    { name: 'Power Vinyasa Yoga', bookings: 76, revenue: 2280, averageOccupancy: 68, growth: 12.8 },
    { name: 'Reformer Balance', bookings: 54, revenue: 2430, averageOccupancy: 65, growth: 18.9 }
  ];

  const clientRetention: ClientRetention[] = [
    { segment: 'Clients fidèles (6+ mois)', count: 34, percentage: 38.2, color: 'bg-green-500' },
    { segment: 'Clients réguliers (3-6 mois)', count: 28, percentage: 31.5, color: 'bg-blue-500' },
    { segment: 'Nouveaux clients (0-3 mois)', count: 27, percentage: 30.3, color: 'bg-yellow-500' }
  ];

  const hourlyStats = [
    { hour: '6h-8h', bookings: 45, revenue: 2025, occupancy: 85 },
    { hour: '8h-10h', bookings: 67, revenue: 3015, occupancy: 92 },
    { hour: '10h-12h', bookings: 52, revenue: 2340, occupancy: 78 },
    { hour: '12h-14h', bookings: 34, revenue: 1530, occupancy: 65 },
    { hour: '14h-16h', bookings: 28, revenue: 1260, occupancy: 58 },
    { hour: '16h-18h', bookings: 41, revenue: 1845, occupancy: 72 },
    { hour: '18h-20h', bookings: 57, revenue: 2565, occupancy: 88 }
  ];

  const handleExport = async (type: string) => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Petit délai pour l'UX
      
      switch (type) {
        case 'revenus':
          exportRevenueData(revenueData);
          break;
        case 'clients':
          exportClientData([
            { segment: 'Super actifs (8+ séances/mois)', count: 23, percentage: 18.1, growth: '+12%' },
            { segment: 'Actifs (4-7 séances/mois)', count: 45, percentage: 35.4, growth: '+8%' },
            { segment: 'Occasionnels (1-3 séances/mois)', count: 39, percentage: 30.7, growth: '+2%' },
            { segment: 'Inactifs (0 séance ce mois)', count: 20, percentage: 15.8, growth: '-15%' }
          ]);
          break;
        case 'cours':
          exportClassData(classPopularity);
          break;
        case 'complet':
        case 'planning':
        default:
          // Pour les exports génériques, on exporte les données principales
          exportRevenueData(revenueData);
          break;
      }
      
      customToast.success(`Rapport ${type} exporté avec succès !`);
    } catch (error) {
      console.error('Erreur export:', error);
      customToast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-elaia-gray mb-2">
              Rapports détaillés
            </h1>
            <p className="text-lg text-elaia-gray">
              Analyses complètes et statistiques avancées de votre studio
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elaia-gold focus:border-transparent"
            >
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">90 derniers jours</option>
              <option value="365">1 an</option>
            </select>
            
            <button
              onClick={() => handleExport('complet')}
              disabled={isExporting}
              className="btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Export...' : 'Exporter'}
            </button>
          </div>
        </div>

        {/* Navigation des rapports */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {[
              { id: 'overview', label: '📊 Vue d\'ensemble', icon: BarChart3 },
              { id: 'revenue', label: '💰 Revenus', icon: Euro },
              { id: 'clients', label: '👥 Clients', icon: Users },
              { id: 'classes', label: '🏃 Cours', icon: Activity },
              { id: 'performance', label: '📈 Performance', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                  reportType === tab.id 
                    ? 'bg-elaia-gold text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {Object.entries(metrics).map(([key, metric]) => {
            const titles: Record<string, string> = {
              revenue: 'Chiffre d\'affaires',
              clients: 'Clients actifs',
              bookings: 'Réservations',
              occupancy: 'Taux d\'occupation',
              avgSessionValue: 'Valeur moyenne/séance',
              retention: 'Taux de rétention'
            };
            
            const icons: Record<string, React.ComponentType<{className?: string}>> = {
              revenue: Euro,
              clients: Users,
              bookings: Calendar,
              occupancy: Activity,
              avgSessionValue: Star,
              retention: Clock
            };
            
            const Icon = icons[key];
            
            return (
              <div key={key} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-6 w-6 text-elaia-gold" />
                  {renderTrendIcon(metric.trend)}
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{titles[key]}</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-elaia-gray">
                    {key === 'revenue' ? `${metric.value.toLocaleString()} CHF` : 
                     key === 'occupancy' || key === 'retention' ? `${metric.value}%` :
                     key === 'avgSessionValue' ? `${metric.value} CHF` :
                     metric.value.toLocaleString()}
                  </p>
                  <span className={`ml-2 text-sm font-medium ${getChangeColor(metric.change)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
              </div>
            );
          })}
        </div>

        {/* Contenu selon le type de rapport */}
        {reportType === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Évolution du chiffre d'affaires */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-elaia-gold" />
                Évolution du chiffre d'affaires
              </h3>
              <div className="space-y-3">
                {revenueData.slice(-6).map((data) => (
                  <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{data.month}</span>
                    <div className="text-right">
                      <div className="font-bold text-elaia-gray">{data.revenue.toLocaleString()} CHF</div>
                      <div className="text-sm text-gray-600">{data.bookings} réservations</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Répartition des clients */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-elaia-green" />
                Répartition des clients
              </h3>
              <div className="space-y-4">
                {clientRetention.map((segment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{segment.segment}</span>
                      <span className="text-sm font-bold text-elaia-gray">{segment.count} clients</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${segment.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${segment.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{segment.percentage}% du total</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportType === 'classes' && (
          <div className="space-y-8">
            {/* Popularité des cours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-6 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-elaia-mint" />
                Analyse des cours par popularité
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réservations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taux d'occupation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Croissance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classPopularity.map((classData, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{classData.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{classData.bookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{classData.revenue.toLocaleString()} CHF</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900">{classData.averageOccupancy}%</div>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-elaia-gold h-2 rounded-full"
                                style={{ width: `${classData.averageOccupancy}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            classData.growth > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {classData.growth > 0 ? '+' : ''}{classData.growth}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analyse par créneaux horaires */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-elaia-rose" />
                Performance par créneaux horaires
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {hourlyStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">{stat.hour}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Réservations</span>
                        <span className="font-medium">{stat.bookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Revenus</span>
                        <span className="font-medium">{stat.revenue} CHF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Occupation</span>
                        <span className="font-medium">{stat.occupancy}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {reportType === 'revenue' && (
          <div className="space-y-8">
            {/* Analyse des revenus détaillée */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-6 flex items-center">
                <Euro className="h-5 w-5 mr-2 text-elaia-gold" />
                Analyse détaillée des revenus
              </h3>
              
              {/* Métriques de revenus */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <h4 className="text-sm text-green-700 font-medium">Revenus totaux</h4>
                  <p className="text-2xl font-bold text-green-800">18,450 CHF</p>
                  <p className="text-sm text-green-600">+12.5% vs mois dernier</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <h4 className="text-sm text-blue-700 font-medium">Revenus par crédit</h4>
                  <p className="text-2xl font-bold text-blue-800">57 CHF</p>
                  <p className="text-sm text-blue-600">+15.2% vs mois dernier</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <h4 className="text-sm text-purple-700 font-medium">Abonnements actifs</h4>
                  <p className="text-2xl font-bold text-purple-800">89</p>
                  <p className="text-sm text-purple-600">+8.5% vs mois dernier</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <h4 className="text-sm text-orange-700 font-medium">Revenus par client</h4>
                  <p className="text-2xl font-bold text-orange-800">145 CHF</p>
                  <p className="text-sm text-orange-600">+3.2% vs mois dernier</p>
                </div>
              </div>

              {/* Répartition des sources de revenus */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Sources de revenus (30 derniers jours)</h4>
                  <div className="space-y-3">
                    {[
                      { source: 'Crédits Reformer (3 crédits)', amount: 11520, percentage: 62.4, color: 'bg-elaia-gold' },
                      { source: 'Crédits Yoga (2 crédits)', amount: 3840, percentage: 20.8, color: 'bg-elaia-green' },
                      { source: 'Abonnements mensuels', amount: 2250, percentage: 12.2, color: 'bg-elaia-mint' },
                      { source: 'Offres Welcome', amount: 840, percentage: 4.6, color: 'bg-elaia-rose' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 ${item.color} rounded mr-3`}></div>
                          <span className="text-sm font-medium text-gray-700">{item.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{item.amount.toLocaleString()} CHF</div>
                          <div className="text-xs text-gray-600">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Prévisions et objectifs</h4>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                      <h5 className="font-medium text-green-800">Objectif mensuel</h5>
                      <p className="text-sm text-green-700">20,000 CHF (92.3% atteint)</p>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92.3%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <h5 className="font-medium text-blue-800">Projection fin de mois</h5>
                      <p className="text-sm text-blue-700">21,200 CHF (+6% vs objectif)</p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                      <h5 className="font-medium text-yellow-800">Recommandation</h5>
                      <p className="text-sm text-yellow-700">Augmenter les créneaux Reformer Booty & Core (+22% de croissance)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'clients' && (
          <div className="space-y-8">
            {/* Analyse des clients */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-elaia-green" />
                Analyse de la clientèle
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Acquisition de clients */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Acquisition mensuelle</h4>
                  <div className="space-y-3">
                    {revenueData.slice(-6).map((data) => (
                      <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{data.month}</span>
                        <div className="text-right">
                          <div className="font-bold text-elaia-gray">+{data.newClients} nouveaux</div>
                          <div className="text-sm text-gray-600">{data.bookings} réservations</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Segmentation clients */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Segmentation par activité</h4>
                  <div className="space-y-4">
                    {[
                      { segment: 'Super actifs (8+ séances/mois)', count: 23, percentage: 18.1, growth: '+12%' },
                      { segment: 'Actifs (4-7 séances/mois)', count: 45, percentage: 35.4, growth: '+8%' },
                      { segment: 'Occasionnels (1-3 séances/mois)', count: 39, percentage: 30.7, growth: '+2%' },
                      { segment: 'Inactifs (0 séance ce mois)', count: 20, percentage: 15.8, growth: '-15%' }
                    ].map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.segment}</span>
                          <span className={`text-sm font-medium ${
                            item.growth.startsWith('+') ? 'text-green-600' : 
                            item.growth.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {item.growth}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-lg font-bold text-gray-900">{item.count} clients</span>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-elaia-green h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Alertes clients */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-6 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                Alertes et recommandations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">Clients à risque</h4>
                  <p className="text-2xl font-bold text-red-900">12</p>
                  <p className="text-sm text-red-700">Aucune réservation depuis 3+ semaines</p>
                  <button className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium">
                    Voir la liste →
                  </button>
                </div>
                
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h4 className="font-medium text-yellow-800 mb-2">Crédits expirés</h4>
                  <p className="text-2xl font-bold text-yellow-900">8</p>
                  <p className="text-sm text-yellow-700">Clients avec des crédits expirés ce mois</p>
                  <button className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                    Contacter →
                  </button>
                </div>
                
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium text-green-800 mb-2">Opportunités</h4>
                  <p className="text-2xl font-bold text-green-900">15</p>
                  <p className="text-sm text-green-700">Clients éligibles pour un upgrade</p>
                  <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium">
                    Proposer →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'performance' && (
          <div className="space-y-8">
            {/* KPIs de performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-elaia-gray mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-elaia-mint" />
                Indicateurs de performance clés
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { 
                    title: 'Croissance MoM', 
                    value: '+12.5%', 
                    description: 'Croissance mois sur mois',
                    trend: 'up',
                    color: 'text-green-600'
                  },
                  { 
                    title: 'LTV Client', 
                    value: '1,240 CHF', 
                    description: 'Valeur vie client moyenne',
                    trend: 'up',
                    color: 'text-blue-600'
                  },
                  { 
                    title: 'Coût acquisition', 
                    value: '45 CHF', 
                    description: 'Coût moyen d\'acquisition',
                    trend: 'down',
                    color: 'text-green-600'
                  },
                  { 
                    title: 'ROI Marketing', 
                    value: '320%', 
                    description: 'Retour sur investissement',
                    trend: 'up',
                    color: 'text-purple-600'
                  }
                ].map((kpi, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-600 mb-1">{kpi.title}</h4>
                    <p className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</p>
                    <p className="text-xs text-gray-500">{kpi.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Objectifs vs Réalisations */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Objectifs vs Réalisations</h4>
                <div className="space-y-4">
                  {[
                    { objective: 'Chiffre d\'affaires mensuel', target: 20000, actual: 18450, unit: 'CHF' },
                    { objective: 'Nouveaux clients', target: 30, actual: 29, unit: 'clients' },
                    { objective: 'Taux de rétention', target: 85, actual: 82, unit: '%' },
                    { objective: 'Taux d\'occupation', target: 80, actual: 78, unit: '%' }
                  ].map((item, index) => {
                    const progress = (item.actual / item.target) * 100;
                    const isGood = progress >= 90;
                    
                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">{item.objective}</span>
                          <span className={`font-bold ${isGood ? 'text-green-600' : 'text-orange-600'}`}>
                            {item.actual.toLocaleString()} / {item.target.toLocaleString()} {item.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isGood ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {progress.toFixed(1)}% de l'objectif atteint
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-elaia-gray mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleExport('revenus')}
              className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              <span className="font-medium text-green-700">Exporter rapport revenus</span>
            </button>
            
            <button
              onClick={() => handleExport('clients')}
              className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium text-blue-700">Exporter liste clients</span>
            </button>
            
            <button
              onClick={() => handleExport('planning')}
              className="flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              <span className="font-medium text-purple-700">Exporter planning</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
