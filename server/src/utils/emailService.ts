import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingDetails {
  userEmail: string;
  userName: string;
  classTypeName: string;
  startTime: string;
  instructorName?: string;
  creditsUsed: number;
}

interface CancelDetails {
  userEmail: string;
  userName: string;
  classTypeName: string;
  startTime: string;
  creditsRefunded: number;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'elaia.studio.gland@gmail.com',
        pass: process.env.EMAIL_PASS || 'votre_mot_de_passe_app'
      }
    });
  }

  async sendBookingConfirmation(details: BookingDetails): Promise<void> {
    const formattedDate = format(new Date(details.startTime), 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'elaia.studio.gland@gmail.com',
      to: details.userEmail,
      subject: `✅ Réservation confirmée - ${details.classTypeName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37, #8B7355); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #D4AF37; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌿 Elaïa Studio</div>
              <h1>Réservation confirmée !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${details.userName}</strong>,</p>
              
              <div class="highlight">
                <h2 style="margin: 0;">Votre séance est réservée ✨</h2>
              </div>
              
              <div class="details">
                <h3>📋 Détails de votre réservation</h3>
                <p><strong>Cours :</strong> ${details.classTypeName}</p>
                <p><strong>Date et heure :</strong> ${formattedDate}</p>
                ${details.instructorName ? `<p><strong>Instructeur :</strong> ${details.instructorName}</p>` : ''}
                <p><strong>Crédits utilisés :</strong> ${details.creditsUsed}</p>
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📍 Informations pratiques</h3>
                <p><strong>Adresse :</strong> Elaïa Studio, Gland</p>
                <p><strong>Arrivée :</strong> Merci d'arriver 10 minutes avant le début du cours</p>
                <p><strong>Tenue :</strong> Vêtements confortables, chaussettes antidérapantes recommandées</p>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>⚠️ Annulation :</strong> Possible jusqu'à 12h avant le cours via votre espace client</p>
              </div>
              
              <div class="footer">
                <p>À très bientôt au studio ! 🧘‍♀️</p>
                <p style="font-size: 12px; color: #999;">
                  Elaïa Studio Pilates • Gland, Suisse<br>
                  elaia.studio.gland@gmail.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de confirmation envoyé à ${details.userEmail}`);
    } catch (error) {
      console.error('Erreur envoi email confirmation:', error);
      // On ne fait pas échouer la réservation si l'email échoue
    }
  }

  async sendCancellationConfirmation(details: CancelDetails): Promise<void> {
    const formattedDate = format(new Date(details.startTime), 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'elaia.studio.gland@gmail.com',
      to: details.userEmail,
      subject: `❌ Annulation confirmée - ${details.classTypeName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B7355, #A0A0A0); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #8B7355; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B7355; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌿 Elaïa Studio</div>
              <h1>Annulation confirmée</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${details.userName}</strong>,</p>
              
              <div class="highlight">
                <h2 style="margin: 0;">Votre réservation a été annulée</h2>
              </div>
              
              <div class="details">
                <h3>📋 Détails de l'annulation</h3>
                <p><strong>Cours :</strong> ${details.classTypeName}</p>
                <p><strong>Date et heure :</strong> ${formattedDate}</p>
                ${details.creditsRefunded > 0 ? `<p><strong>Crédits remboursés :</strong> ${details.creditsRefunded}</p>` : ''}
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>💡 Prochaines étapes</h3>
                <p>Vos crédits ont été automatiquement remboursés sur votre compte.</p>
                <p>Vous pouvez réserver un autre cours à tout moment via votre espace client.</p>
              </div>
              
              <div class="footer">
                <p>Au plaisir de vous revoir bientôt ! 🧘‍♀️</p>
                <p style="font-size: 12px; color: #999;">
                  Elaïa Studio Pilates • Gland, Suisse<br>
                  elaia.studio.gland@gmail.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email d'annulation envoyé à ${details.userEmail}`);
    } catch (error) {
      console.error('Erreur envoi email annulation:', error);
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'elaia.studio.gland@gmail.com',
      to: userEmail,
      subject: '🌟 Bienvenue chez Elaïa Studio !',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37, #8B7355); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #D4AF37; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .cta-button { background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌿 Elaïa Studio</div>
              <h1>Bienvenue dans la famille !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${userName}</strong>,</p>
              
              <div class="highlight">
                <h2 style="margin: 0;">Félicitations ! 🎉</h2>
                <p style="margin: 5px 0 0 0;">Votre compte Elaïa Studio est créé</p>
              </div>
              
              <p>Nous sommes ravis de vous accueillir dans notre communauté de passionnés de Pilates Reformer !</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>🎯 Vos prochaines étapes</h3>
                <ol>
                  <li><strong>Profitez de notre offre Welcome</strong> : 3 séances pour 45 CHF</li>
                  <li><strong>Réservez votre première séance</strong> en ligne</li>
                  <li><strong>Découvrez nos différents cours</strong> adaptés à tous les niveaux</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="cta-button">🎯 Réserver ma première séance</a>
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📍 Infos pratiques</h3>
                <p><strong>Adresse :</strong> Elaïa Studio, Gland</p>
                <p><strong>Parking :</strong> Gratuit devant le studio</p>
                <p><strong>Matériel :</strong> Fourni par le studio</p>
                <p><strong>Tenue :</strong> Vêtements confortables</p>
              </div>
              
              <div class="footer">
                <p>Hâte de vous rencontrer ! 🧘‍♀️</p>
                <p style="font-size: 12px; color: #999;">
                  Elaïa Studio Pilates • Gland, Suisse<br>
                  elaia.studio.gland@gmail.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de bienvenue envoyé à ${userEmail}`);
    } catch (error) {
      console.error('Erreur envoi email bienvenue:', error);
    }
  }
}

export const emailService = new EmailService(); 