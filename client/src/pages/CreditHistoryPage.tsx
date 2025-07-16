import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreditCard, TrendingUp, TrendingDown, RefreshCw, Download } from 'lucide-react';
import { creditService } from '../services/api';

interface CreditTransaction {
  id: number;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  description: string;
  date: string;
  remaining_after: number;
}

export default function CreditHistoryPage() {
  // Récupérer l'historique des crédits
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['credit-history'],
    queryFn: () => creditService.getCreditHistory(),
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'usage':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'refund':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-green-600';
      case 'usage':
        return 'text-red-600';
      case 'refund':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAmountDisplay = (type: string, amount: number) => {
    const sign = type === 'usage' ? '' : type === 'purchase' || type === 'refund' ? '+' : '';
    return `${sign}${amount}`;
  };

  if (isLoading) {
    return (
      <div className="py-8 bg-elaia-beige min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-elaia-gray">Chargement de l'historique...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 bg-elaia-beige min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">Erreur lors du chargement de l'historique</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-elaia-beige min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-elaia-gray mb-2">
            Historique des crédits
          </h1>
          <p className="text-lg text-elaia-gray">
            Suivez l'évolution de vos crédits
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <button className="btn-secondary text-sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </button>
          </div>
        </div>

        {/* Liste des transactions */}
        {history && history.length > 0 ? (
          <div className="space-y-4">
            {history.map((transaction: CreditTransaction) => (
              <div key={transaction.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-elaia-gray">
                        {transaction.description}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(transaction.date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                      {getAmountDisplay(transaction.type, transaction.amount)} crédits
                    </div>
                    <div className="text-sm text-gray-500">
                      Solde : {transaction.remaining_after} crédits
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Aucune transaction trouvée
            </p>
            <p className="text-sm text-gray-500">
              Vos achats et utilisations de crédits apparaîtront ici
            </p>
          </div>
        )}

        {/* Résumé */}
        {history && history.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-green-600 mb-2">
                <TrendingUp className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-elaia-gray mb-1">
                Crédits achetés
              </h3>
              <p className="text-2xl font-bold text-green-600">
                +{history.filter((t: CreditTransaction) => t.type === 'purchase').reduce((sum: number, t: CreditTransaction) => sum + t.amount, 0)}
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-red-600 mb-2">
                <TrendingDown className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-elaia-gray mb-1">
                Crédits utilisés
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {history.filter((t: CreditTransaction) => t.type === 'usage').reduce((sum: number, t: CreditTransaction) => sum + Math.abs(t.amount), 0)}
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-blue-600 mb-2">
                <RefreshCw className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-elaia-gray mb-1">
                Remboursements
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                +{history.filter((t: CreditTransaction) => t.type === 'refund').reduce((sum: number, t: CreditTransaction) => sum + t.amount, 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 