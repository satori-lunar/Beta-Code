import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart,
  MessageCircle,
  Send,
  Pin,
  Image as ImageIcon,
  BookOpen,
  Megaphone,
  HelpCircle
} from 'lucide-react';
import { useIsAdmin } from '../hooks/useAdmin';

interface Channel {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  is_private: boolean;
}

interface Post {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  is_pinned: boolean;
  pinned_by: string | null;
  pinned_at: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: {
    name: string;
    avatar_url: string | null;
  };
  channel?: {
    name: string;
    icon: string | null;
    color: string;
  };
  user_liked?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  likes_count: number;
  created_at: string;
  user?: {
    name: string;
    avatar_url: string | null;
  };
  user_liked?: boolean;
}

export default function Community() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  // Fetch channels
  useEffect(() => {
    async function fetchChannels() {
      try {
        const { data, error } = await (supabase as any)
          .from('community_channels')
          .select('*')
          .order('name');

        if (error) throw error;
        setChannels((data || []) as Channel[]);
        if (data && data.length > 0 && !selectedChannel) {
          setSelectedChannel(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    }
    fetchChannels();
  }, [selectedChannel]);

  // Fetch posts
  useEffect(() => {
    if (!selectedChannel) return;

    async function fetchPosts() {
      try {
        setLoading(true);
        const { data, error } = await (supabase as any)
          .from('community_posts')
          .select(`
            *,
            user:users!community_posts_user_id_fkey(full_name, name, avatar_url),
            channel:community_channels!community_posts_channel_id_fkey(name, icon, color)
          `)
          .eq('channel_id', selectedChannel)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Check which posts user has liked
        if (user && data) {
          const postIds = data.map((p: any) => p.id);
          const { data: likes } = await (supabase as any)
            .from('community_post_likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', postIds);

          const likedPostIds = new Set(likes?.map((l: any) => l.post_id) || []);
          data.forEach((post: any) => {
            post.user_liked = likedPostIds.has(post.id);
          });
        }

        setPosts((data || []) as Post[]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [selectedChannel, user]);

  // Fetch comments for expanded post
  useEffect(() => {
    if (!expandedPost) return;

    async function fetchComments() {
      try {
        const { data, error } = await (supabase as any)
          .from('community_post_comments')
          .select(`
            *,
            user:users!community_post_comments_user_id_fkey(full_name, name, avatar_url)
          `)
          .eq('post_id', expandedPost)
          .is('parent_comment_id', null)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Check which comments user has liked
        if (user && data) {
          const commentIds = data.map((c: any) => c.id);
          const { data: likes } = await (supabase as any)
            .from('community_comment_likes')
            .select('comment_id')
            .eq('user_id', user.id)
            .in('comment_id', commentIds);

          const likedCommentIds = new Set(likes?.map((l: any) => l.comment_id) || []);
          data.forEach((comment: any) => {
            comment.user_liked = likedCommentIds.has(comment.id);
          });
        }

        if (expandedPost) {
          setPostComments(prev => ({
            ...prev,
            [expandedPost]: (data || []) as Comment[]
          }));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    fetchComments();
  }, [expandedPost, user]);

  const handleCreatePost = async () => {
    if (!user || !selectedChannel || !newPostContent.trim()) return;

    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (newPostImage) {
        const fileExt = newPostImage.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(fileName, newPostImage);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('community-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const { error } = await (supabase as any)
        .from('community_posts')
        .insert({
          channel_id: selectedChannel,
          user_id: user.id,
          content: newPostContent,
          image_url: imageUrl
        });

      if (error) throw error;

      setNewPostContent('');
      setNewPostImage(null);
      // Refresh posts
      const { data } = await (supabase as any)
        .from('community_posts')
        .select(`
          *,
          user:users!community_posts_user_id_fkey(name, avatar_url),
          channel:community_channels!community_posts_channel_id_fkey(name, icon, color)
        `)
        .eq('channel_id', selectedChannel)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data[0]) {
        setPosts(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    try {
      if (currentlyLiked) {
        const { error } = await (supabase as any)
          .from('community_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('community_post_likes')
          .insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            user_liked: !currentlyLiked,
            likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handlePinPost = async (postId: string, currentlyPinned: boolean) => {
    if (!user || !isAdmin) return;

    try {
      const { error } = await (supabase as any)
        .from('community_posts')
        .update({
          is_pinned: !currentlyPinned,
          pinned_by: !currentlyPinned ? user.id : null,
          pinned_at: !currentlyPinned ? new Date().toISOString() : null
        })
        .eq('id', postId);

      if (error) throw error;

      // Refresh posts to reorder
      const { data } = await (supabase as any)
        .from('community_posts')
        .select(`
          *,
          user:users!community_posts_user_id_fkey(name, avatar_url),
          channel:community_channels!community_posts_channel_id_fkey(name, icon, color)
        `)
        .eq('channel_id', selectedChannel)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (data) {
        // Check likes
        const postIds = data.map((p: any) => p.id);
        const { data: likes } = await (supabase as any)
          .from('community_post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedPostIds = new Set(likes?.map((l: any) => l.post_id) || []);
        data.forEach((post: any) => {
          post.user_liked = likedPostIds.has(post.id);
        });

        setPosts(data as Post[]);
      }
    } catch (error) {
      console.error('Error pinning post:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment[postId]?.trim()) return;

    try {
      const { error } = await (supabase as any)
        .from('community_post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment[postId]
        });

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [postId]: '' }));
      
      // Refresh comments
      const { data } = await (supabase as any)
        .from('community_post_comments')
        .select(`
          *,
          user:users!community_post_comments_user_id_fkey(name, avatar_url)
        `)
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true });

      if (data) {
        const commentIds = data.map((c: any) => c.id);
        const { data: likes } = await (supabase as any)
          .from('community_comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', commentIds);

        const likedCommentIds = new Set(likes?.map((l: any) => l.comment_id) || []);
        data.forEach((comment: any) => {
          comment.user_liked = likedCommentIds.has(comment.id);
        });

        setPostComments(prev => ({
          ...prev,
          [postId]: data as Comment[]
        }));

        // Update comments count
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, comments_count: post.comments_count + 1 };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const pinnedPosts = posts.filter(p => p.is_pinned);
  const regularPosts = posts.filter(p => !p.is_pinned);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Community
          </h1>
          <p className="text-gray-600">Connect, share, and learn together</p>
        </div>

        {/* Channel Selector */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {channels.map(channel => {
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    selectedChannel === channel.id
                      ? 'bg-coral-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  style={selectedChannel === channel.id ? {} : { borderLeft: `4px solid ${channel.color}` }}
                >
                  {channel.icon && <span className="text-lg">{channel.icon}</span>}
                  <span>{channel.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Create Post */}
        {selectedChannel && (
          <div className="card mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.name || user?.email || 'You'}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-coral-600 font-semibold">
                    {(user?.user_metadata?.name || user?.email || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-coral-500"
                  rows={3}
                />
                {newPostImage && (
                  <div className="mt-2 relative">
                    <img
                      src={URL.createObjectURL(newPostImage)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setNewPostImage(null)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <ImageIcon className="w-5 h-5 text-gray-500 hover:text-coral-500" />
                  </label>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Pin className="w-5 h-5 text-coral-500" />
              <h2 className="font-semibold text-gray-900">Pinned</h2>
            </div>
            {pinnedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onPin={isAdmin ? handlePinPost : undefined}
                onToggleComments={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                expanded={expandedPost === post.id}
                comments={postComments[post.id] || []}
                newComment={newComment[post.id] || ''}
                onCommentChange={(value) => setNewComment(prev => ({ ...prev, [post.id]: value }))}
                onAddComment={() => handleAddComment(post.id)}
              />
            ))}
          </div>
        )}

        {/* Regular Posts Feed */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500 mx-auto"></div>
          </div>
        ) : regularPosts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {regularPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onPin={isAdmin ? handlePinPost : undefined}
                onToggleComments={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                expanded={expandedPost === post.id}
                comments={postComments[post.id] || []}
                newComment={newComment[post.id] || ''}
                onCommentChange={(value) => setNewComment(prev => ({ ...prev, [post.id]: value }))}
                onAddComment={() => handleAddComment(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({
  post,
  onLike,
  onPin,
  onToggleComments,
  expanded,
  comments,
  newComment,
  onCommentChange,
  onAddComment
}: {
  post: Post;
  onLike: (postId: string, currentlyLiked: boolean) => void;
  onPin?: (postId: string, currentlyPinned: boolean) => void;
  onToggleComments: () => void;
  expanded: boolean;
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
}) {
  return (
    <div className="card">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center">
            {post.user?.avatar_url ? (
              <img
                src={post.user.avatar_url}
                alt={post.user.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <span className="text-coral-600 font-semibold">
                {(post.user?.name || 'U')[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{(post.user as any)?.full_name || post.user?.name || 'Anonymous'}</span>
              {post.is_pinned && (
                <Pin className="w-4 h-4 text-coral-500" />
              )}
            </div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
        {onPin && (
          <button
            onClick={() => onPin(post.id, post.is_pinned)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title={post.is_pinned ? 'Unpin' : 'Pin post'}
          >
            <Pin className={`w-5 h-5 ${post.is_pinned ? 'text-coral-500 fill-current' : 'text-gray-400'}`} />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            className="w-full mt-3 rounded-lg"
          />
        )}
      </div>

      {/* Engagement */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onLike(post.id, post.user_liked || false)}
          className={`flex items-center gap-2 ${post.user_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
        >
          <Heart className={`w-5 h-5 ${post.user_liked ? 'fill-current' : ''}`} />
          <span>{post.likes_count}</span>
        </button>
        <button
          onClick={onToggleComments}
          className="flex items-center gap-2 text-gray-500 hover:text-coral-500"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments_count}</span>
        </button>
      </div>

      {/* Comments Section */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3 mb-3">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {comment.user?.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm font-semibold">
                      {((comment.user as any)?.name || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-sm text-gray-900">{(comment.user as any)?.full_name || (comment.user as any)?.name || 'Anonymous'}</span>
                    <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-3">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newComment.trim()) {
                  onAddComment();
                }
              }}
            />
            <button
              onClick={onAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

