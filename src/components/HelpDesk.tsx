import { useEffect, useState } from 'react';
import { MessageCircle, X, Send, Headphones, MessageSquare, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface HelpDeskProps {
  userName?: string;
}

export default function HelpDesk({ userName = 'there' }: HelpDeskProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'menu' | 'chat'>('menu');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean; time: string }>>([]);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastViewedAt, setLastViewedAt] = useState<Date | null>(() => {
    // Load from localStorage on component mount
    const saved = localStorage.getItem('helpdesk-last-viewed');
    return saved ? new Date(saved) : null;
  });

  // Load or create a ticket for this user when chat opens
  useEffect(() => {
    const initChat = async () => {
      if (!isOpen || !user) return;

      setLoading(true);
      try {
        // Always load the most recent ticket for this user (any status)
        const { data: existingTickets, error: ticketError } = await (supabase as any)
          .from('help_tickets')
          .select('id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (ticketError) {
          console.error('Error loading existing help ticket:', ticketError);
        }

        let activeTicketId = existingTickets && existingTickets.length > 0 ? existingTickets[0].id : null;
        setTicketId(activeTicketId);

        const greeting = {
          text: `Hi ${userName}! How can we help you today?`,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Load existing messages for this ticket if we have one
        if (activeTicketId) {
          const { data: messages, error: messagesError } = await (supabase as any)
            .from('help_messages')
            .select('message, sender_id, sender_role, created_at')
            .eq('ticket_id', activeTicketId)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error loading help messages:', messagesError);
            setChatMessages([greeting]);
          } else {
            setChatMessages([
              greeting,
              ...(messages || []).map((m: any) => ({
                text: m.message as string,
                isUser: m.sender_role === 'member',
                time: m.created_at
                  ? new Date(m.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '',
              })),
            ]);
          }
        } else {
          // No previous ticket – just show greeting
          setChatMessages([greeting]);
        }
      } finally {
        setLoading(false);
      }
    };

    void initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id]);

  // Live updates: subscribe to new help_messages for this ticket
  useEffect(() => {
    if (!ticketId || !isOpen || !user) return;

    const channel = (supabase as any)
      .channel(`help-messages-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'help_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload: any) => {
          const m = payload.new;
          // We already append the user's own messages optimistically
          if (m.sender_id === user.id) return;

          setChatMessages(prev => [
            ...prev,
            {
              text: m.message as string,
              isUser: m.sender_role === 'member',
              time: m.created_at
                ? new Date(m.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '',
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      (supabase as any).removeChannel(channel);
    };
  }, [ticketId, isOpen, user?.id]);

  // Count unread admin messages
  const updateUnreadCount = async () => {
    if (!user || !ticketId) {
      setUnreadCount(0);
      return;
    }

    // Don't count unread if chat is currently open
    if (isOpen) {
      setUnreadCount(0);
      return;
    }

    try {
      const { data: messages, error } = await (supabase as any)
        .from('help_messages')
        .select('created_at, sender_role')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages for unread count:', error);
        setUnreadCount(0);
        return;
      }

      // Count admin messages newer than last viewed time
      const unreadMessages = messages?.filter((msg: any) => {
        const messageTime = new Date(msg.created_at);
        return msg.sender_role !== 'member' && (!lastViewedAt || messageTime > lastViewedAt);
      }) || [];

      setUnreadCount(unreadMessages.length);
    } catch (err) {
      console.error('Error updating unread count:', err);
      setUnreadCount(0);
    }
  };

  // Update unread count when ticket changes or when new messages arrive
  useEffect(() => {
    updateUnreadCount();
  }, [ticketId, lastViewedAt, user?.id, isOpen]);

  // Update unread count when new messages arrive (from real-time subscription)
  useEffect(() => {
    if (!ticketId || !user) return;

    const channel = (supabase as any)
      .channel(`help-messages-unread-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'help_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload: any) => {
          const m = payload.new;
          // Only count if it's from admin and user hasn't viewed it yet
          if (m.sender_role !== 'member' && (!lastViewedAt || new Date(m.created_at) > lastViewedAt)) {
            setUnreadCount(prev => prev + 1);

            // Show browser notification if permission granted and chat is closed
            if (!isOpen && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('New Support Message', {
                body: m.message.length > 100 ? m.message.substring(0, 100) + '...' : m.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'help-desk-message'
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      (supabase as any).removeChannel(channel);
    };
  }, [ticketId, lastViewedAt, user?.id, isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!user) {
      alert('Please sign in to contact support.');
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const outgoingText = message;
    setChatMessages(prev => [...prev, { text: outgoingText, isUser: true, time }]);
    setMessage('');

    try {
      setLoading(true);

      let activeTicketId = ticketId;

      // If we don't yet have a ticket, create one now
      if (!activeTicketId) {
        const { data: newTicket, error: ticketError } = await (supabase as any)
          .from('help_tickets')
          .insert({
            user_id: user.id,
            subject: 'Help Desk Chat',
            message: outgoingText,
            status: 'open'
          } as any)
          .select('id')
          .single();

        if (ticketError) {
          console.error('Error creating help ticket:', ticketError);
          return;
        }

        activeTicketId = newTicket?.id;
        setTicketId(activeTicketId || null);
      }

      if (!activeTicketId) return;

      // Store the message in help_messages
      const { error: msgError } = await (supabase as any)
        .from('help_messages')
        .insert({
          ticket_id: activeTicketId,
          sender_id: user.id,
          sender_role: 'member',
          message: outgoingText
        } as any);

      if (msgError) {
        console.error('Error saving help message:', msgError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button - positioned above mobile nav */}
      <button
        onClick={() => {
          setIsOpen(true);
          setUnreadCount(0); // Clear badge immediately when opening

          // Request notification permission if not already granted
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
          }
        }}
        className={`fixed bottom-24 lg:bottom-6 right-4 lg:right-6 w-14 h-14 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-50 ${isOpen ? 'hidden' : ''} ${unreadCount > 0 ? 'animate-pulse' : ''}`}
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <>
            {/* Animated notification badge */}
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 animate-bounce shadow-lg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></div>
          </>
        )}
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
                // Update last viewed time when closing chat so future messages are counted as unread
                const now = new Date();
                setLastViewedAt(now);
                localStorage.setItem('helpdesk-last-viewed', now.toISOString());
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
                  {loading && (
                    <p className="text-xs text-gray-400 mb-2">Syncing with support...</p>
                  )}
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
