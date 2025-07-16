// Utilitaires d'export pour les rapports admin

interface ExportData {
  [key: string]: string | number;
}

export const exportToCSV = (data: ExportData[], filename: string, headers: string[]) => {
  try {
    // Créer le contenu CSV
    const csvContent = [
      headers.join(','), // En-têtes
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Échapper les virgules et guillemets
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    // Créer le blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    throw new Error('Impossible d\'exporter les données');
  }
};

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  newClients: number;
}

interface ClassData {
  name: string;
  bookings: number;
  revenue: number;
  averageOccupancy: number;
  growth: number;
}

interface ClientData {
  segment: string;
  count: number;
  percentage: number;
  growth?: string;
}

export const exportRevenueData = (revenueData: RevenueData[]) => {
  const headers = ['Mois', 'Chiffre d\'affaires (CHF)', 'Réservations', 'Nouveaux clients'];
  const mappedData = revenueData.map(item => ({
    'Mois': item.month,
    'Chiffre d\'affaires (CHF)': item.revenue,
    'Réservations': item.bookings,
    'Nouveaux clients': item.newClients
  }));
  
  exportToCSV(mappedData, 'rapport_revenus', headers);
};

export const exportClassData = (classData: ClassData[]) => {
  const headers = ['Cours', 'Réservations', 'Revenus (CHF)', 'Taux d\'occupation (%)', 'Croissance (%)'];
  const mappedData = classData.map(item => ({
    'Cours': item.name,
    'Réservations': item.bookings,
    'Revenus (CHF)': item.revenue,
    'Taux d\'occupation (%)': item.averageOccupancy,
    'Croissance (%)': item.growth
  }));
  
  exportToCSV(mappedData, 'rapport_cours', headers);
};

export const exportClientData = (clientData: ClientData[]) => {
  const headers = ['Segment', 'Nombre de clients', 'Pourcentage (%)', 'Croissance'];
  const mappedData = clientData.map(item => ({
    'Segment': item.segment,
    'Nombre de clients': item.count,
    'Pourcentage (%)': item.percentage,
    'Croissance': item.growth || 'N/A'
  }));
  
  exportToCSV(mappedData, 'rapport_clients', headers);
}; 