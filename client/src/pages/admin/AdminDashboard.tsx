import { Users, TrendingUp, Calendar, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Tableau de bord administrateur
      </h1>
      
      <p className="text-gray-600">
        Version de débogage - Charts désactivés
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus du mois</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crédits vendus</p>
              <p className="text-2xl font-semibold text-gray-900">-</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
} 