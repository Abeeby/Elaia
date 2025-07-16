import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Calendar, CreditCard, Info, Phone, MapPin } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'action';
  actions?: Array<{
    label: string;
    type: 'navigate' | 'action';
    value: string;
  }>;
}

interface QuickReply {
  text: string;
  response: string;
  actions?: Array<{
    label: string;
    type: 'navigate' | 'action';
    value: string;
  }>;
}

const quickReplies: QuickReply[] = [
  {
    text: "Réserver un cours",
    response: "Je peux vous aider à réserver un cours ! Voici vos options :",
    actions: [
      { label: "Voir le planning", type: "navigate", value: "/schedule" },
      { label: "Cours débutants", type: "action", value: "beginner-classes" },
      { label: "Cours avancés", type: "action", value: "advanced-classes" }
    ]
  },
  {
    text: "Mes crédits",
    response: "Concernant vos crédits, je peux vous aider avec :",
    actions: [
      { label: "Voir mon solde", type: "navigate", value: "/dashboard" },
      { label: "Acheter des crédits", type: "navigate", value: "/pricing" },
      { label: "Historique", type: "navigate", value: "/credits/history" }
    ]
  },
  {
    text: "Horaires du studio",
    response: "📍 **Elaïa Studio - Gland**\n\n🕐 **Horaires d'ouverture :**\n• Lundi - Vendredi : 7h00 - 21h00\n• Samedi : 8h00 - 18h00\n• Dimanche : 9h00 - 17h00\n\n📞 **Contact :** +41 22 XXX XX XX"
  },
  {
    text: "Types de cours",
    response: "🧘‍♀️ **Nos cours disponibles :**\n\n• **Pilates Reformer Débutant** (3 crédits)\n• **Pilates Reformer Intermédiaire** (3 crédits)\n• **Pilates Yoga Mat Détente** (2 crédits)\n• **Cours Pré/Post-natal** (3 crédits)\n\nTous nos cours sont adaptés à votre niveau !",
    actions: [
      { label: "Voir le planning", type: "navigate", value: "/schedule" },
      { label: "En savoir plus", type: "navigate", value: "/about" }
    ]
  },
  {
    text: "Annuler une réservation",
    response: "Pour annuler une réservation :",
    actions: [
      { label: "Mes réservations", type: "navigate", value: "/bookings" }
    ]
  }
];

const botResponses: Record<string, string> = {
  'beginner-classes': "🌟 **Cours pour débutants :**\n\n• **Pilates Reformer Débutant** - Parfait pour commencer\n• **Pilates Yoga Mat Détente** - Doux et relaxant\n\nNos instructeurs vous guideront pas à pas !",
  'advanced-classes': "💪 **Cours avancés :**\n\n• **Pilates Reformer Intermédiaire**\n• **Pilates Reformer Avancé**\n\nPour ceux qui veulent se challenger !",
  'default': "Je comprends que vous avez une question. Voici comment je peux vous aider :",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message de bienvenue
      const welcomeMessage: Message = {
        id: '1',
        text: "👋 Bonjour ! Je suis Elaïa, votre assistante virtuelle.\n\nComment puis-je vous aider aujourd'hui ?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'quick-reply'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'text' | 'quick-reply' | 'action' = 'text', actions?: Message['actions']) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      sender,
      timestamp: new Date(),
      type,
      actions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Ajouter le message de l'utilisateur
    addMessage(inputValue, 'user');
    const userMessage = inputValue.toLowerCase();
    setInputValue('');

    // Simuler le typing
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      // Analyser le message et répondre
      let response = '';
      let actions: Message['actions'] = undefined;

      if (userMessage.includes('réserv') || userMessage.includes('cours') || userMessage.includes('planning')) {
        const quickReply = quickReplies.find(qr => qr.text === "Réserver un cours");
        response = quickReply?.response || '';
        actions = quickReply?.actions;
      } else if (userMessage.includes('crédit') || userMessage.includes('solde') || userMessage.includes('paiement')) {
        const quickReply = quickReplies.find(qr => qr.text === "Mes crédits");
        response = quickReply?.response || '';
        actions = quickReply?.actions;
      } else if (userMessage.includes('horaire') || userMessage.includes('ouvert') || userMessage.includes('ferme')) {
        const quickReply = quickReplies.find(qr => qr.text === "Horaires du studio");
        response = quickReply?.response || '';
      } else if (userMessage.includes('annul')) {
        const quickReply = quickReplies.find(qr => qr.text === "Annuler une réservation");
        response = quickReply?.response || '';
        actions = quickReply?.actions;
      } else if (userMessage.includes('type') || userMessage.includes('cours') || userMessage.includes('pilates')) {
        const quickReply = quickReplies.find(qr => qr.text === "Types de cours");
        response = quickReply?.response || '';
        actions = quickReply?.actions;
      } else if (userMessage.includes('merci') || userMessage.includes('bye') || userMessage.includes('au revoir')) {
        response = "De rien ! N'hésitez pas à revenir si vous avez d'autres questions. À bientôt chez Elaïa Studio ! 😊";
      } else {
        response = "Je ne suis pas sûre de comprendre votre question. Voici les sujets sur lesquels je peux vous aider :";
        actions = [
          { label: "Réserver un cours", type: "action", value: "booking" },
          { label: "Mes crédits", type: "action", value: "credits" },
          { label: "Horaires", type: "action", value: "hours" },
          { label: "Contact", type: "action", value: "contact" }
        ];
      }

      addMessage(response, 'bot', actions ? 'action' : 'text', actions);
    }, 1000 + Math.random() * 1000); // Délai réaliste
  };

  const handleQuickReply = (reply: QuickReply) => {
    addMessage(reply.text, 'user');
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(reply.response, 'bot', reply.actions ? 'action' : 'text', reply.actions);
    }, 800);
  };

  const handleAction = (action: { label: string; type: 'navigate' | 'action'; value: string }) => {
    if (action.type === 'navigate') {
      window.location.href = action.value;
    } else if (action.type === 'action') {
      const response = botResponses[action.value] || botResponses.default;
      addMessage(action.label, 'user');
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(response, 'bot');
      }, 800);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bouton du chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-elaia-gold hover:bg-elaia-gold/90 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50 animate-bounce"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Interface du chatbot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl z-50 border border-gray-200 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-elaia-gold to-elaia-green text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Elaïa Assistant</h3>
                  <p className="text-sm opacity-90">En ligne • Répond en ~1min</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-elaia-gold text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-elaia-gold text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    
                    {/* Actions */}
                    {message.actions && (
                      <div className="mt-3 space-y-2">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleAction(action)}
                            className="block w-full text-left px-3 py-2 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick replies (uniquement pour le premier message) */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Suggestions :</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.slice(0, 4).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs transition-colors text-left"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elaia-gold focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-elaia-gold hover:bg-elaia-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Elaïa Assistant • Powered by AI ✨
            </p>
          </div>
        </div>
      )}
    </>
  );
} 