import { useState } from 'react';
import { MessageCircle, X, Send, Headphones, MessageSquare, ChevronRight } from 'lucide-react';

interface HelpDeskProps {
  userName?: string;
}

export default function HelpDesk({ userName = 'there' }: HelpDeskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'menu' | 'chat'>('menu');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean; time: string }>>([
    { text: `Hi ${userName}! How can we help you today?`, isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { text: message, isUser: true, time }]);
    setMessage('');

    // Simulate response
    setTimeout(() => {
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [...prev, {
        text: "Thank you for your message! Our support team typically responds within 24 hours. For urgent matters, please check our FAQ section.",
        isUser: false,
        time: responseTime
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Help Desk Panel */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm h-[500px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-coral-500 to-coral-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Help & Support</h3>
                <p className="text-xs text-white/80">We're here to help!</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveView('menu');
              }}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'menu' && (
              <div className="p-4 space-y-3">
                <p className="text-gray-600 text-sm mb-4">How can we help you today?</p>

                <button
                  onClick={() => setActiveView('chat')}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-4 transition-colors group"
                >
                  <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center text-coral-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">Chat with Us</h4>
                    <p className="text-sm text-gray-500">Send us a message</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              </div>
            )}

            {activeView === 'chat' && (
              <div className="flex flex-col h-full">
                {/* Back button */}
                <button
                  onClick={() => setActiveView('menu')}
                  className="p-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 border-b"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to menu
                </button>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.isUser
                            ? 'bg-coral-500 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.isUser ? 'text-white/70' : 'text-gray-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="w-10 h-10 bg-coral-500 text-white rounded-full flex items-center justify-center hover:bg-coral-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ view removed – chat only */}
          </div>
        </div>
      )}
    </>
  );
}
