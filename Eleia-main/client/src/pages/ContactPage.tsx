import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import customToast from '../utils/toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: 'renseignement',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      customToast.success('Votre message a été envoyé avec succès !');
      setFormData({ nom: '', email: '', sujet: 'renseignement', message: '' });
    } catch {
      customToast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-elaia-cream">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920" 
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-elaia-charcoal/60 to-elaia-charcoal/40"></div>
      </div>
        
        <div className="relative z-10 text-center text-elaia-white px-6">
          <h1 className="heading-xl mb-4">Contact</h1>
          <p className="body-lg max-w-2xl mx-auto opacity-90">
            Nous sommes à votre écoute pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
            <div className="text-center">
              <div className="w-16 h-16 bg-elaia-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-elaia-charcoal" />
              </div>
              <h3 className="heading-sm text-elaia-charcoal mb-4">Adresse</h3>
              <p className="body-md text-elaia-warm-gray">
                rue de l'Etraz 14<br />
                1196 Gland<br />
                Suisse
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-elaia-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-elaia-charcoal" />
              </div>
              <h3 className="heading-sm text-elaia-charcoal mb-4">Téléphone</h3>
              <a 
                href="tel:+41797181009" 
                className="body-md text-ohemia-accent hover:text-elaia-charcoal transition-colors"
              >
                079 718 10 09
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-elaia-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-elaia-charcoal" />
              </div>
              <h3 className="heading-sm text-elaia-charcoal mb-4">Email</h3>
              <a 
                href="mailto:contact@elaia-studio.ch" 
                className="body-md text-ohemia-accent hover:text-elaia-charcoal transition-colors"
              >
                contact@elaia-studio.ch
              </a>
            </div>
          </div>
          
          {/* Form and Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
          <div>
              <h2 className="heading-md text-elaia-charcoal mb-8">
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="sujet" className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
                    Sujet
                  </label>
                  <select
                    id="sujet"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    className="input-field appearance-none"
                  >
                    <option value="renseignement">Demande de renseignement</option>
                    <option value="reclamation">Réclamation</option>
                    <option value="reservation">Problème de réservation</option>
                    <option value="collaboration">Proposition de collaboration</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                      Envoi en cours
                    </>
                  ) : (
                    <>
                      Envoyer
                      <Send className="h-4 w-4 ml-3" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map and Info */}
            <div>
              <h2 className="heading-md text-elaia-charcoal mb-8">
                Nous trouver
              </h2>
              
              <div className="mb-8 overflow-hidden border border-elaia-muted">
                <iframe 
                  src="https://maps.google.com/maps?q=rue%20de%20l'Etraz%2014,%201196%20Gland&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-80 grayscale"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Elaïa Studio"
                />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-4">
                    Accès & Parking
                  </h3>
                  <ul className="space-y-2 text-elaia-warm-gray">
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-ohemia-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Parking gratuit disponible sur place</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-ohemia-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Accessible en transports publics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-ohemia-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>À 2 minutes à pied de la gare de Gland</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horaires */}
      <section className="py-24 bg-elaia-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Clock className="h-12 w-12 text-ohemia-accent mx-auto mb-8" />
            <h2 className="heading-lg text-elaia-charcoal mb-12">
              Horaires d'ouverture
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
                  Lundi - Vendredi
                </h3>
                <p className="text-2xl font-playfair text-elaia-warm-gray">
                  06:30 - 21:00
                </p>
              </div>
              <div>
                <h3 className="text-sm font-inter uppercase tracking-wider text-elaia-charcoal mb-3">
                  Samedi - Dimanche
                </h3>
                <p className="text-2xl font-playfair text-elaia-warm-gray">
                  08:00 - 18:00
                </p>
              </div>
            </div>
            
            <p className="text-sm text-elaia-warm-gray mt-12">
              Horaires susceptibles d'évoluer selon la demande
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 