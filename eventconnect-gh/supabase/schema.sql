-- ============================================================
-- EventConnect GH – Complete Supabase Database Schema
-- ============================================================
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'vendor')),
  onboarding_step TEXT NOT NULL DEFAULT 'phone' CHECK (onboarding_step IN ('welcome', 'phone', 'otp', 'user_type', 'details', 'complete')),
  is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
  theme_preference TEXT NOT NULL DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  interests TEXT[] DEFAULT '{}',
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. VENDORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  category TEXT NOT NULL,
  location TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  min_price INTEGER,
  max_price INTEGER,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  service_areas TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}'::JSONB,
  business_phone TEXT,
  business_email TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. VENDOR SERVICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendor_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_price INTEGER NOT NULL CHECK (base_price >= 0),
  image_urls TEXT[] DEFAULT '{}',
  duration_minutes INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.vendor_services(id) ON DELETE SET NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  event_location TEXT,
  event_lat DECIMAL(10, 8),
  event_lng DECIMAL(11, 8),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. PAYMENT REFERENCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'refunded')),
  reference TEXT NOT NULL UNIQUE,
  gateway TEXT NOT NULL DEFAULT 'paystack' CHECK (gateway IN ('paystack', 'mobile_money', 'cash')),
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. CONVERSATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  last_message_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_conversation CHECK (participant1_id != participant2_id),
  CONSTRAINT unique_conversation UNIQUE (participant1_id, participant2_id)
);

-- ============================================================
-- 7. MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_review UNIQUE (booking_id, reviewer_id)
);

-- ============================================================
-- 9. SAVED VENDORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_save UNIQUE (user_id, vendor_id)
);

-- ============================================================
-- 10. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('booking', 'message', 'payment', 'review', 'system', 'promo')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 11. SERVICE CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. VENDOR GALLERY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendor_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_location ON public.vendors(location);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON public.vendors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_services_vendor_id ON public.vendor_services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_id ON public.bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON public.conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON public.conversations(participant2_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON public.reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_saved_vendors_user_id ON public.saved_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_gallery ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Vendors RLS
CREATE POLICY "Anyone can view active vendors" ON public.vendors FOR SELECT USING (is_active = true);
CREATE POLICY "Vendor can update own profile" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create vendor profile" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vendor Services RLS
CREATE POLICY "Anyone can view active services" ON public.vendor_services FOR SELECT USING (is_active = true);
CREATE POLICY "Vendor can manage own services" ON public.vendor_services FOR ALL USING (
  vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
);

-- Bookings RLS
CREATE POLICY "Customers can view own bookings" ON public.bookings FOR SELECT USING (
  customer_id = auth.uid() OR vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
);
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customers and vendors can update bookings" ON public.bookings FOR UPDATE USING (
  customer_id = auth.uid() OR vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
);

-- Payment References RLS
CREATE POLICY "Users can view own payments" ON public.payment_references FOR SELECT USING (
  booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid())
);
CREATE POLICY "Users can create payments" ON public.payment_references FOR INSERT WITH CHECK (
  booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid())
);

-- Conversations RLS
CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT USING (
  participant1_id = auth.uid() OR participant2_id = auth.uid()
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  participant1_id = auth.uid() OR participant2_id = auth.uid()
);

-- Messages RLS
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM public.conversations
    WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
  )
);
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND conversation_id IN (
    SELECT id FROM public.conversations
    WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
  )
);
CREATE POLICY "Participants can update messages" ON public.messages FOR UPDATE USING (sender_id = auth.uid());

-- Reviews RLS
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for own bookings" ON public.reviews FOR INSERT WITH CHECK (
  reviewer_id = auth.uid() AND booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid())
);

-- Saved Vendors RLS
CREATE POLICY "Users can view own saves" ON public.saved_vendors FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can save vendors" ON public.saved_vendors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can unsave vendors" ON public.saved_vendors FOR DELETE USING (user_id = auth.uid());

-- Notifications RLS
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Service Categories RLS
CREATE POLICY "Anyone can view categories" ON public.service_categories FOR SELECT USING (is_active = true);

-- Vendor Gallery RLS
CREATE POLICY "Anyone can view gallery" ON public.vendor_gallery FOR SELECT USING (true);
CREATE POLICY "Vendor can manage own gallery" ON public.vendor_gallery FOR ALL USING (
  vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE OR REPLACE TRIGGER vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE OR REPLACE TRIGGER vendor_services_updated_at BEFORE UPDATE ON public.vendor_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE OR REPLACE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE OR REPLACE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update conversation on new message
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations SET updated_at = NOW(), last_message_id = NEW.id WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_new_message AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();

-- Update vendor rating on new review
CREATE OR REPLACE FUNCTION public.update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.vendors SET
    rating = (SELECT AVG(rating) FROM public.reviews WHERE vendor_id = NEW.vendor_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE vendor_id = NEW.vendor_id)
  WHERE id = NEW.vendor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_new_review AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_vendor_rating();

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================================
-- SEED DATA: Service Categories
-- ============================================================
INSERT INTO public.service_categories (name, icon, slug, sort_order) VALUES
  ('Weddings', '💍', 'weddings', 1),
  ('Birthdays', '🎂', 'birthdays', 2),
  ('Corporate Events', '💼', 'corporate', 3),
  ('Concerts', '🎵', 'concerts', 4),
  ('Funerals', '🕊️', 'funerals', 5),
  ('Parties', '🎉', 'parties', 6),
  ('Religious Events', '🙏', 'religious', 7),
  ('Cultural Events', '🌍', 'cultural', 8),
  ('Photography', '📷', 'photography', 9),
  ('Catering', '🍽️', 'catering', 10),
  ('Decoration', '🎨', 'decoration', 11),
  ('Music & DJ', '🎧', 'music_dj', 12)
ON CONFLICT (slug) DO NOTHING;
