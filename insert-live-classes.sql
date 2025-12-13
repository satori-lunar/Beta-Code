-- Insert Live Classes into Supabase
-- Run this in Supabase SQL Editor
-- This script inserts all weekly live classes with correct dates matching their weekdays
-- The app will display only the weekday and time (e.g., "Sunday, 7:30 AM")
-- Dates used: Sunday: Dec 15, Monday: Dec 16, Tuesday: Dec 17, Wednesday: Dec 18, Thursday: Dec 19, Friday: Dec 20

-- First, delete any existing live classes to avoid duplicates (optional - comment out if you want to keep existing)
-- DELETE FROM public.live_classes;

-- Insert all live classes
INSERT INTO public.live_classes (
  title,
  description,
  instructor,
  scheduled_at,
  duration,
  zoom_link,
  category
) VALUES
  -- Sunday Classes
  (
    'Plan Your Week',
    'Create a calendar/meal/exercise/work plan for your week that you feel confident in following. This is essentially a study hall session to plan your week with a coach available for questions and coaching on calendar follow through.',
    'Coach Emily B',
    '2024-12-15 07:30:00-05'::timestamptz, -- Sunday, December 15, 7:30 AM ET
    45,
    NULL,
    'Planning'
  ),
  (
    'Rooted Weight Health',
    'Covering a variety of topics related to weight health, common obstacles we all face and strategies we can learn to pair with those obstacles.',
    'Coach Emily B',
    '2024-12-15 08:30:00-05'::timestamptz, -- Sunday, 8:30 AM ET
    45,
    NULL,
    'Weight Health'
  ),
  
  -- Monday Classes
  (
    'The Heart of Nourishment',
    'Nourishment is more than food — it''s what feeds your body, mind, heart, and spirit. In this reflective and creative workshop, you''ll be guided through visualization and self-discovery to explore what true nourishment means to you. You''ll create your own "nourishment menu" and reconnect with intention and compassion for your well-being.',
    'Coach Emily M',
    '2024-12-16 09:00:00-05'::timestamptz, -- Monday, 9:00 AM ET
    45,
    NULL,
    'Nourishment'
  ),
  (
    'Foundations in Motion',
    'A gentle, yet empowering, entry point into movement for everyday life. This 30-minute weekly session focuses on improving strength, balance, mobility, and confidence through simple, functional movements. Each class blends education and movement, helping participants understand WHY we move certain ways and HOW to build a foundation safely. Our goal is to help participants: Move better in daily life (lifting, reaching, bending, standing up), Improve strength and stamina gradually, Build confidence to join more advanced programs, Feel supported in a welcoming, judgment-free environment. No fancy clothes or equipment required.',
    'Coach Rebecca',
    '2024-12-16 10:30:00-05'::timestamptz, -- Monday, 10:30 AM ET
    30,
    NULL,
    'Fitness'
  ),
  (
    'Hatha Yoga',
    'Move at your own pace from your own space, with classes encompassing strengthening postures, revitalizing flows, nourishing stretches and soothing relaxation. We''ll alleviate common discomforts, work on balance in the body and in life, and cultivate a calm, clear mind. Recommended props: yoga mat, 2 yoga blocks, yoga strap, blanket.',
    'Meghan',
    '2024-12-16 16:00:00-05'::timestamptz, -- Monday, December 16, 4:00 PM ET
    60,
    NULL,
    'Yoga'
  ),
  (
    'Seedlings',
    'In this gentle, guided class, you''ll learn how to recognize your thoughts, understand your emotions, and begin practicing the tools that help you grow stronger roots. Whether you''re brand new to coaching or simply looking for a refresher in the model, this is a safe, supportive space to ask questions, explore your inner landscape, and build confidence one practice at a time. Together, we''ll revisit and relearn the model, deepen our understanding, and most importantly — connect in community. Come hang out, grow alongside others, and nurture the resilience that helps you thrive.',
    'Coach Emily B',
    '2024-12-16 17:30:00-05'::timestamptz, -- Monday, 5:30 PM ET
    45,
    NULL,
    'Coaching Fundamentals'
  ),
  
  -- Tuesday Classes
  (
    'Inner Chords',
    'A unique space where music and poetry meet reflection. This class helps you access feelings you may not otherwise know how to reach. Come ready to journal, listen, and let the notes guide you into deeper awareness. Ride into your day with company as you tune in — this hour offers a mix of calm, uplift, and transformative energy. Because this class meets at the start of your morning, we''ll steer toward emotions that energize and ground you: peace, clarity, connection, and lightness. Think of it as a reset for your inner world — helping you feel better on purpose before the day begins.',
    'Coach Emily M',
    '2024-12-17 08:00:00-05'::timestamptz, -- Tuesday, 8:00 AM ET
    45,
    NULL,
    'Meditation'
  ),
  (
    'Strength in Motion',
    'Build strength and confidence as you move with purpose. This class uses a mix of bodyweight and weights-based exercises designed to challenge your muscles, improve posture, and increase stability. Whether you''re new to strength training or ready to push a little further, you''ll leave feeling strong, steady, and empowered.',
    'Coach Rebecca',
    '2024-12-17 09:00:00-05'::timestamptz, -- Tuesday, 9:00 AM ET
    45,
    NULL,
    'Exercise'
  ),
  (
    'The Reflecting Pool',
    'Explore why we do what we do. This class examines thought patterns, emotional habits, and the psychology of personal growth. Insightful, structured, and thought-provoking.',
    'Coach Emily M',
    '2024-12-17 10:00:00-05'::timestamptz, -- Tuesday, 10:00 AM ET
    45,
    NULL,
    'Personal Growth'
  ),
  (
    'Wisdom Rising',
    'Wisdom Rising is a weekly class designed to honor the transitions of midlife as a time of growth, strength, and renewal. Together, we''ll explore the foundations of a healthy, vibrant midlife—drawing from a holistic "menopause toolkit" that includes movement, nutrition, stress management, sleep support, and mindset practices, as well as community. Each week offers a blend of education, guided practices, and open conversation. You''ll walk away with both practical tools and a deeper sense of connection—discovering that the challenges of menopause, from hot flashes to brain fog, are not just obstacles to manage but invitations to rise into new wisdom and vitality. This is a space where women gather to feel seen and supported, to share stories, and to cultivate resilience in community. Midlife is not an ending; it''s the rising of a new chapter—one where wisdom, strength, and possibility come together. Join us weekly as we learn, share, and rise stronger—together.',
    'Coach Beth',
    '2024-12-17 16:00:00-05'::timestamptz, -- Tuesday, 4:00 PM ET
    45,
    NULL,
    'Wisdom'
  ),
  (
    '2-Bite Tuesdays',
    '2-Bite Tuesdays is a gentle, eye-opening workshop that helps you pause long enough to actually taste your food—and your life. In this class, we explore the simple practice of taking just two intentional bites before you decide what comes next. Those two bites become a moment of awareness, a moment of connection, and a moment of truth. Inside the calm, grounded energy of birch & stone, you''ll learn how the first two bites can: reveal whether you''re hungry or just seeking comfort, help you notice taste, texture, and satisfaction, slow down emotional or automatic eating, shift you from "snacking on autopilot" to "eating with intention", reconnect you with your body without rules or restriction. This practice isn''t about eating less—it''s about knowing yourself more. Come curious, come open, come as you are. Let two small bites be the beginning of a much bigger change.',
    'Coach Dani',
    '2024-12-17 22:00:00-05'::timestamptz, -- Tuesday, 10:00 PM ET
    45,
    NULL,
    'Wellness'
  ),
  
  -- Wednesday Classes
  (
    'Refreshed & Ready',
    'Give yourself a midweek moment to breathe, reset, and get clear. In this workshop, we''ll slow down long enough to notice what''s weighing on your mind, sort through the mental clutter, and choose one simple next step that brings you back into focus. You''ll leave feeling lighter, steady, and ready to move through the rest of your week with clarity and confidence.',
    'Birch & Stone Coaching',
    '2024-12-18 06:30:00-05'::timestamptz, -- Wednesday, 6:30 AM ET
    45,
    NULL,
    'Wellness'
  ),
  (
    'Grief & Growth',
    'Grief has many stages and waves of emotions that go along with it. You don''t need to navigate those waters alone. Coach Emily holds an intimate space for you to connect with others who carry grief, while also gently nudging you not to discount the potential that your life still holds.',
    'Coach Emily M',
    '2024-12-18 10:00:00-05'::timestamptz, -- Wednesday, 10:00 AM ET
    45,
    NULL,
    'Grief & Growth'
  ),
  (
    'Instinctive Meditation',
    'Instinctive Meditation works with your thoughts, emotions, and energy—not against them. In this space, you''ll learn to meditate in a way that feels natural, restorative, and even pleasurable. Because rest isn''t a reward—it''s a requirement. And reconnection starts right here.',
    'Coach Tobey',
    '2024-12-18 19:00:00-05'::timestamptz, -- Wednesday, 7:00 PM ET
    45,
    'https://us02web.zoom.us/j/89113624969',
    'Meditation'
  ),
  
  -- Thursday Classes
  (
    'Rooted Weight Health',
    'Covering a variety of topics related to weight health, common obstacles we all face and strategies we can learn to pair with those obstacles.',
    'Coach Emily B',
    '2024-12-19 06:00:00-05'::timestamptz, -- Thursday, 6:00 AM ET
    45,
    NULL,
    'Weight Health'
  ),
  (
    'Tangled: Challenging Relationships',
    'Tangled is a space for exploring the complexity of human relationships—whether with partners, parents, children, friends, or colleagues. Many of us find ourselves caught in dynamics that leave us questioning our worth, doubting our voice, or losing sight of who we are. This class helps you gently untangle those knots.',
    'Coach Emily B',
    '2024-12-19 13:30:00-05'::timestamptz, -- Thursday, 1:30 PM ET
    45,
    NULL,
    'Relationships'
  ),
  (
    'Evenings with Emily B',
    'Settle in for a calm, end-of-day hour with Emily. This class is a soft landing after a long week — a place to exhale, sort through what''s been heavy, and reconnect with yourself before the day is done. Each session offers gentle coaching, simple grounding practices, and one small shift to carry into tomorrow. Come as you are. Leave a little lighter, clearer, and more supported.',
    'Coach Emily B',
    '2024-12-19 19:30:00-05'::timestamptz, -- Thursday, 7:30 PM ET
    45,
    NULL,
    'Wellness'
  ),
  
  -- Friday Classes
  (
    'The Habit Lab',
    'Where intention turns into momentum. Progress in real time — together. Feel like something else has been running the show lately — your phone 📱, snacking 🍫, or saying yes when you mean no 🙃? It''s time to take back the wheel. 💡 In The Habit Lab, you''ll: 🔹 Experiment with small, sustainable changes, 🔹 Use your Habit Tracker to spot patterns + progress, 🔹 Build habits that actually stick, 🔹 Get accountability + authentic support, 🔹 Celebrate real progress — not perfection. 8 weeks. Real data. Real growth. Ready to reclaim your habits? 🚀',
    'Coach Emily M',
    '2024-12-20 08:00:00-05'::timestamptz, -- Friday, 8:00 AM ET
    45,
    NULL,
    'Wellness'
  ),
  (
    'Energy in Motion',
    'Ignite your energy with aerobic interval training that keeps your heart pumping and your body moving. Using styles like Tabata and other high-energy intervals, this class blends bursts of effort with moments of recovery to boost endurance, burn calories, and elevate your mood. Expect a fun, sweat-filled session that leaves you recharged and ready for the day.',
    'Coach Rebecca',
    '2024-12-20 09:00:00-05'::timestamptz, -- Friday, 9:00 AM ET
    45,
    NULL,
    'Exercise'
  ),
  (
    'Nighttime Nurturing',
    'Nighttime Nurturing is a cozy, calming evening workshop designed to support you when the day winds down… and the urges, emotions, and habits often wind up. If evenings are when you snack, scroll, graze, wander the pantry, or feel yourself slipping into old routines, this class is your soft landing place. Each session offers: gentle coaching around nighttime snacking, overeating, and emotional urges, practices for comfort, grounding, and emotional regulation, simple tools to unwind without using food to soothe, cozy rituals that cue rest, not cravings, a warm, supportive community to end your day with intention. Nighttime Nurturing is where you learn to care for yourself after hours—with warmth, honesty, and zero shame. It''s the quiet shift that changes everything about your nights… and your tomorrow.',
    'Coach Dani',
    '2024-12-20 23:00:00-05'::timestamptz, -- Friday, 11:00 PM ET
    45,
    'https://us02web.zoom.us/j/87954176691',
    'Wellness'
  );

-- Verify the data
SELECT 
  title,
  instructor,
  scheduled_at,
  duration,
  category,
  zoom_link
FROM public.live_classes
ORDER BY scheduled_at;
