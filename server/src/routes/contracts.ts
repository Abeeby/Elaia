import { Router } from 'express';
import { dbRun, dbGet, dbAll } from '../utils/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Route pour récupérer le contrat type selon le plan
router.get('/template/:planId', async (req, res) => {
  try {
    const planId = req.params.planId;
    
    const plan = await dbGet(
      'SELECT * FROM subscription_plans WHERE id = ?',
      [planId]
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan non trouvé' });
    }

    // Générer le contrat selon le type de plan
    const contractTemplate = generateContractTemplate(plan);
    
    res.json({
      plan,
      contract: contractTemplate
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contrat:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du contrat' });
  }
});

// Route pour signer un contrat
router.post('/sign', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscription_id, signature_data, contract_type } = req.body;

    // Vérifier que l'abonnement appartient à l'utilisateur
    const subscription = await dbGet(
      'SELECT * FROM user_subscriptions WHERE id = ? AND user_id = ?',
      [subscription_id, userId]
    );

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    // Enregistrer la signature
    const result = await dbRun(`
      INSERT INTO contracts (user_id, subscription_id, contract_type, signature_data, signed_at, ip_address)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
    `, [userId, subscription_id, contract_type, signature_data, req.ip]);

    res.status(201).json({
      message: 'Contrat signé avec succès',
      contract_id: result.lastID
    });
  } catch (error) {
    console.error('Erreur lors de la signature du contrat:', error);
    res.status(500).json({ message: 'Erreur lors de la signature du contrat' });
  }
});

// Route pour récupérer les contrats signés de l'utilisateur
router.get('/my-contracts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const contracts = await dbAll(`
      SELECT 
        c.*,
        sp.name as plan_name,
        sp.type as plan_type
      FROM contracts c
      JOIN user_subscriptions us ON c.subscription_id = us.id
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE c.user_id = ?
      ORDER BY c.signed_at DESC
    `, [userId]);

    res.json(contracts);
  } catch (error) {
    console.error('Erreur lors de la récupération des contrats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contrats' });
  }
});

// Route pour télécharger un contrat signé
router.get('/download/:contractId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const contractId = req.params.contractId;

    const contract = await dbGet(`
      SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.email,
        sp.name as plan_name,
        sp.price,
        sp.description
      FROM contracts c
      JOIN users u ON c.user_id = u.id
      JOIN user_subscriptions us ON c.subscription_id = us.id
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE c.id = ? AND c.user_id = ?
    `, [contractId, userId]);

    if (!contract) {
      return res.status(404).json({ message: 'Contrat non trouvé' });
    }

    // Générer le PDF du contrat (simulé pour la démo)
    const contractPDF = generateContractPDF(contract);

    res.json({
      contract,
      download_url: `/api/contracts/pdf/${contractId}` // URL simulée
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du contrat:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement du contrat' });
  }
});

// Fonction pour générer le template de contrat
function generateContractTemplate(plan: any) {
  const baseContract = {
    title: 'Contrat d\'abonnement Elaia Studio',
    sections: [
      {
        title: 'Parties',
        content: [
          'Entre Elaia Studio, ci-après dénommé "le Studio"',
          'Et le client soussigné, ci-après dénommé "le Client"'
        ]
      },
      {
        title: 'Objet du contrat',
        content: [
          `Le présent contrat a pour objet la souscription à l'abonnement "${plan.name}"`,
          `Prix: ${plan.price} CHF`,
          plan.description
        ]
      },
      {
        title: 'Durée',
        content: plan.duration_days 
          ? [`Durée: ${plan.duration_days} jours à compter de la date de souscription`]
          : ['Abonnement mensuel renouvelable automatiquement']
      },
      {
        title: 'Conditions d\'utilisation',
        content: []
      }
    ]
  };

  // Ajouter les conditions spécifiques selon le type de plan
  if (plan.type === 'credits') {
    baseContract.sections[3].content.push(
      `Nombre de crédits: ${plan.credits}`,
      'Les crédits non utilisés à la fin de la période sont perdus'
    );
  } else if (plan.type === 'monthly') {
    if (plan.max_bookings_per_week) {
      baseContract.sections[3].content.push(
        `Maximum ${plan.max_bookings_per_week} réservations par semaine`
      );
    } else {
      baseContract.sections[3].content.push('Accès illimité aux cours');
    }
  }

  // Conditions générales
  baseContract.sections.push({
    title: 'Conditions générales',
    content: [
      'Annulation possible jusqu\'à 12h avant le cours',
      'En cas d\'annulation tardive, les crédits sont perdus',
      'Le Studio se réserve le droit de modifier le planning',
      'Respect du règlement intérieur obligatoire'
    ]
  });

  return baseContract;
}

// Fonction simulée pour générer un PDF
function generateContractPDF(contract: any) {
  // Dans une vraie application, on utiliserait une librairie comme pdfkit ou puppeteer
  return {
    filename: `contrat_${contract.id}_${contract.last_name}.pdf`,
    size: '125KB',
    generated_at: new Date().toISOString()
  };
}

export default router; 