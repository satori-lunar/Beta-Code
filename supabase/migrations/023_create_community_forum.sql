-- Community Forum Tables
-- Creates tables for community forum/chat with subchats, posts, comments, and pinned content

-- Community Channels (subchats)
CREATE TABLE IF NOT EXISTS public.community_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name or emoji
  color TEXT DEFAULT '#6366f1', -- Channel color
  is_private BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.community_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT, -- Optional image attachment
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_by UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Coach who pinned it
  pinned_at TIMESTAMPTZ,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Likes (many-to-many)
CREATE TABLE IF NOT EXISTS public.community_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Post Comments
CREATE TABLE IF NOT EXISTS public.community_post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.community_post_comments(id) ON DELETE CASCADE, -- For nested replies
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment Likes
CREATE TABLE IF NOT EXISTS public.community_comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES public.community_post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Channel Members (for private channels)
CREATE TABLE IF NOT EXISTS public.community_channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.community_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_posts_channel_id ON public.community_posts(channel_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON public.community_posts(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_post_comments_post_id ON public.community_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_post_id ON public.community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_channel_members_channel_id ON public.community_channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_community_channel_members_user_id ON public.community_channel_members(user_id);

-- Enable Row Level Security
ALTER TABLE public.community_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_channel_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Channels
CREATE POLICY "Anyone can view public channels"
  ON public.community_channels FOR SELECT
  USING (is_private = FALSE OR created_by = auth.uid());

CREATE POLICY "Coaches can create channels"
  ON public.community_channels FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Coaches can update channels"
  ON public.community_channels FOR UPDATE
  USING (created_by = auth.uid());

-- RLS Policies for Posts
CREATE POLICY "Users can view posts in accessible channels"
  ON public.community_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_channels cc
      WHERE cc.id = community_posts.channel_id
      AND (cc.is_private = FALSE OR EXISTS (
        SELECT 1 FROM public.community_channel_members ccm
        WHERE ccm.channel_id = cc.id AND ccm.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can create posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Post Likes
CREATE POLICY "Users can view likes"
  ON public.community_post_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.community_post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.community_post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Comments
CREATE POLICY "Users can view comments on accessible posts"
  ON public.community_post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_posts cp
      JOIN public.community_channels cc ON cc.id = cp.channel_id
      WHERE cp.id = community_post_comments.post_id
      AND (cc.is_private = FALSE OR EXISTS (
        SELECT 1 FROM public.community_channel_members ccm
        WHERE ccm.channel_id = cc.id AND ccm.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can create comments"
  ON public.community_post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.community_post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.community_post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Comment Likes
CREATE POLICY "Users can view comment likes"
  ON public.community_comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like comments"
  ON public.community_comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON public.community_comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Channel Members
CREATE POLICY "Users can view channel members"
  ON public.community_channel_members FOR SELECT
  USING (true);

CREATE POLICY "Coaches can add members"
  ON public.community_channel_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_channels cc
      WHERE cc.id = community_channel_members.channel_id
      AND cc.created_by = auth.uid()
    )
  );

-- Function to update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for post likes count
CREATE TRIGGER update_post_likes_count_trigger
  AFTER INSERT OR DELETE ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Function to update post comments count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for post comments count
CREATE TRIGGER update_post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.community_post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Create default channels
INSERT INTO public.community_channels (name, description, icon, color, is_private)
VALUES
  ('General', 'General community discussions', '💬', '#6366f1', FALSE),
  ('Resources', 'Coaches share important resources and materials', '📚', '#10b981', FALSE),
  ('Announcements', 'Important announcements and updates', '📢', '#f59e0b', FALSE),
  ('Support', 'Get help and support from the community', '🤝', '#ef4444', FALSE)
ON CONFLICT DO NOTHING;

