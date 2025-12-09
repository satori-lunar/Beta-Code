import { useState } from 'react';
import { MessageCircle, X, Send, Headphones, MessageSquare, FileQuestion, ChevronRight } from 'lucide-react';

interface HelpDeskProps {
  userName?: string;
}

export default function HelpDesk({ userName = 'there' }: HelpDeskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'menu' | 'chat' | 'faq'>('menu');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean; time: string }>>([
    { text: `Hi ${userName}! How can we help you today?`, isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  const faqs = [
    { question: 'How do I track my habits?', answer: 'Go to the Habits page from the sidebar. Click the "+" button to add a new habit, then check them off daily to build your streak!' },
    { question: 'How do I join a live class?', answer: 'Visit the Classes page and look for upcoming live sessions. Click "Join" when the class is about to start to open the Zoom link.' },
    { question: 'How do I log my meals?', answer: 'Navigate to the Nutrition page. Click "Add Meal" and enter your meal details including calories and macros.' },
    { question: 'How do I earn badges?', answer: 'Badges are earned automatically as you reach milestones! Check the Badges page to see what you\'ve earned and what\'s available.' },
    { question: 'How do I update my profile?', answer: 'Click on your profile picture in the top right corner and select "Settings" to update your personal information.' },
  ];

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
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100">
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

                <button
                  onClick={() => setActiveView('faq')}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-4 transition-colors group"
                >
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center text-sage-600">
                    <FileQuestion className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">FAQ</h4>
                    <p className="text-sm text-gray-500">Find quick answers</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                <a
                  href="mailto:support@wellnessdashboard.com"
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-4 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">Email Us</h4>
                    <p className="text-sm text-gray-500">support@wellnessdashboard.com</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </a>
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

            {activeView === 'faq' && (
              <div className="flex flex-col h-full">
                {/* Back button */}
                <button
                  onClick={() => setActiveView('menu')}
                  className="p-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 border-b"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to menu
                </button>

                {/* FAQ List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <details key={index} className="group bg-gray-50 rounded-xl">
                        <summary className="p-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between list-none">
                          {faq.question}
                          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" />
                        </summary>
                        <div className="px-4 pb-4 text-sm text-gray-600">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
