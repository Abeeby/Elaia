import { useState, useEffect } from 'react';
import { MessageCircle, Clock, Check, Reply, Eye, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessage {
  id: number;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  message: string;
  response: string;
  status: 'unread' | 'read' | 'responded';
  created_at: string;
  responded_at: string;
  responded_by_name: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Erreur récupération messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/chat/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, status: 'read' } : msg
          )
        );
      }
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const sendResponse = async (messageId: number) => {
    if (!responseText.trim()) return;

    setIsResponding(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/chat/messages/${messageId}/respond`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseText }),
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, status: 'responded', response: responseText, responded_at: new Date().toISOString() }
              : msg
          )
        );
        setResponseText('');
        setSelectedMessage(null);
        
        // TODO: Envoyer email automatique à la personne
        alert('Réponse envoyée ! (Email automatique à implémenter)');
      }
    } catch (error) {
      console.error('Erreur envoi réponse:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <MessageCircle className="h-4 w-4" />;
      case 'read': return <Eye className="h-4 w-4" />;
      case 'responded': return <Check className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread': return 'Non lu';
      case 'read': return 'Lu';
      case 'responded': return 'Répondu';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages Chatbot</h1>
        <p className="text-gray-600">
          Gérez les messages reçus via le chatbot du site web
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-red-800 font-semibold">
                {messages.filter(m => m.status === 'unread').length}
              </p>
              <p className="text-red-600 text-sm">Non lus</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-yellow-800 font-semibold">
                {messages.filter(m => m.status === 'read').length}
              </p>
              <p className="text-yellow-600 text-sm">Lus</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-green-800 font-semibold">
                {messages.filter(m => m.status === 'responded').length}
              </p>
              <p className="text-green-600 text-sm">Répondus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun message reçu pour le moment</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                message.status === 'unread' ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span className="ml-1">{getStatusText(message.status)}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(message.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      {message.visitor_name && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {message.visitor_name}
                        </div>
                      )}
                      {message.visitor_email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {message.visitor_email}
                        </div>
                      )}
                      {message.visitor_phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {message.visitor_phone}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-900">{message.message}</p>
                  </div>

                  {message.response && (
                    <div className="bg-blue-50 p-3 rounded mt-3">
                      <p className="text-sm text-blue-800">
                        <strong>Votre réponse :</strong> {message.response}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Répondu le {format(new Date(message.responded_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {message.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      Marquer lu
                    </button>
                  )}
                  
                  {message.status !== 'responded' && (
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      <Reply className="h-4 w-4 inline mr-1" />
                      Répondre
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de réponse */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Répondre à {selectedMessage.visitor_name || 'ce visiteur'}
            </h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Message original :</p>
              <p className="text-gray-900">{selectedMessage.message}</p>
            </div>

            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Tapez votre réponse..."
              className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setResponseText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={() => sendResponse(selectedMessage.id)}
                disabled={isResponding || !responseText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isResponding ? 'Envoi...' : 'Envoyer réponse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 