-- Help Desk chat support: messages and admin visibility

-- Create help_messages table for threaded ticket conversations
CREATE TABLE IF NOT EXISTS public.help_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.help_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('member', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_help_messages_ticket_id ON public.help_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_help_messages_sender_id ON public.help_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_help_messages_created_at ON public.help_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.help_messages ENABLE ROW LEVEL SECURITY;

-- RLS: members can see messages on their own tickets
CREATE POLICY "Users can view own ticket messages" ON public.help_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.help_tickets t
    WHERE t.id = help_messages.ticket_id
      AND t.user_id = auth.uid()
  )
);

-- RLS: admins can see all messages (identified by email)
CREATE POLICY "Admins can view all ticket messages" ON public.help_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.email = 'YOUR_ADMIN_EMAIL_HERE'
  )
);

-- RLS: members can insert messages on their own tickets
CREATE POLICY "Users can insert own ticket messages" ON public.help_messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.help_tickets t
    WHERE t.id = ticket_id
      AND t.user_id = auth.uid()
  )
);

-- RLS: admins can insert messages on any ticket
CREATE POLICY "Admins can insert ticket messages" ON public.help_messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.email = 'YOUR_ADMIN_EMAIL_HERE'
  )
);

-- Allow admins to view and update all help tickets (in addition to user-specific policies)
CREATE POLICY "Admins can view all tickets" ON public.help_tickets
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.email = 'YOUR_ADMIN_EMAIL_HERE'
  )
);

CREATE POLICY "Admins can update all tickets" ON public.help_tickets
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.email = 'YOUR_ADMIN_EMAIL_HERE'
  )
);
