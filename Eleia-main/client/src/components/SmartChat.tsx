import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export default function SmartChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessageToAPI = async (message: string, contact?: ContactInfo) => {
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          name: contact?.name || null,
          email: contact?.email || null,
          phone: contact?.phone || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.message, 'bot');
        return true;
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      addMessage("Désolé, une erreur s'est produite. Veuillez réessayer.", 'bot');
    }
    return false;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue;
    addMessage(userMessage, 'user');
    setInputValue('');
    setIsSubmitting(true);

    // Première demande de message
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage("Merci pour votre message ! Pour mieux vous aider, pourriez-vous me donner vos coordonnées ?", 'bot');
        setShowContactForm(true);
        setIsSubmitting(false);
      }, 1000);
    } else {
      // Messages suivants - sauvegarder en base
      await sendMessageToAPI(userMessage, contactInfo);
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email) {
      addMessage("Merci de renseigner au moins votre nom et email.", 'bot');
      return;
    }

    setIsSubmitting(true);
    setShowContactForm(false);

    // Envoyer le message original avec les coordonnées
    const originalMessage = messages.find(m => m.sender === 'user')?.text || '';
    await sendMessageToAPI(originalMessage, contactInfo);
    
    addMessage(`Parfait ${contactInfo.name} ! Vos coordonnées ont été enregistrées. Albina ou son équipe vous recontacteront rapidement !`, 'bot');
    setIsSubmitting(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-elaia-gold hover:bg-elaia-gold/90 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl z-50 border">
          <div className="bg-elaia-gold text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Assistant Elaïa</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm">
                👋 Bonjour ! Comment puis-je vous aider ?
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-elaia-gold text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            
            {/* Formulaire de contact */}
            {showContactForm && (
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="flex items-center mb-3">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Vos coordonnées</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Votre nom *"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Votre email *"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Votre téléphone (optionnel)"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleContactSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </div>
            )}
            
            {isSubmitting && (
              <div className="text-center text-gray-500 text-sm">
                ⏳ En cours d'envoi...
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleSendMessage()}
              placeholder="Tapez votre message..."
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-elaia-gold disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSubmitting}
              className="px-4 py-2 bg-elaia-gold text-white rounded-lg hover:bg-elaia-gold/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
} 