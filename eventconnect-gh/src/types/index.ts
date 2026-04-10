// ============================================================
// EventConnect GH – Core TypeScript Types
// ============================================================

// ---------- Theme ----------

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  error: string;
  warning: string;
  text: string;
  textMuted: string;
  border: string;
  shadow: string;
}

export interface Typography {
  heading1: TextStyle;
  heading2: TextStyle;
  heading3: TextStyle;
  bodyLarge: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface BorderRadii {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg';

export interface ThemeTokens {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  radii: BorderRadii;
  shadow: (level: ShadowLevel) => object;
}

// ---------- Auth ----------

export type UserRole = 'customer' | 'vendor';
export type OnboardingStep = 'welcome' | 'phone' | 'otp' | 'user_type' | 'details' | 'complete';

export interface UserProfile {
  id: string;
  phone: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  onboarding_step: OnboardingStep;
  theme_preference: ThemeMode;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  category: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  rating: number;
  review_count: number;
  min_price: number | null;
  max_price: number | null;
  is_verified: boolean;
  is_active: boolean;
  service_areas: string[];
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  vendor: VendorProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ---------- Vendor / Service ----------

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface VendorService {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_urls: string[];
  duration_minutes: number | null;
  is_active: boolean;
}

// ---------- Booking ----------

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Booking {
  id: string;
  customer_id: string;
  vendor_id: string;
  service_id: string;
  event_date: string;
  event_time: string | null;
  event_location: string | null;
  event_lat: number | null;
  event_lng: number | null;
  status: BookingStatus;
  total_amount: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vendor?: VendorProfile;
  service?: VendorService;
  customer?: UserProfile;
}

// ---------- Chat ----------

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  booking_id: string | null;
  last_message: Message | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
  other_user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'system';
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

// ---------- Review ----------

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  vendor_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: UserProfile;
}

// ---------- Saved ----------

export interface SavedVendor {
  id: string;
  user_id: string;
  vendor_id: string;
  created_at: string;
  vendor?: VendorProfile;
}

// ---------- Payment ----------

export interface PaymentReference {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed';
  reference: string;
  paid_at: string | null;
  created_at: string;
}

// ---------- Notification ----------

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  data: Record<string, any>;
  is_read: boolean;
  type: string;
  created_at: string;
}

// ---------- Component Props ----------

export interface BaseComponentProps {
  style?: any;
  children?: React.ReactNode;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export type InputVariant = 'default' | 'filled' | 'outline';

export interface InputProps extends Omit<BaseComponentProps, 'children'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  variant?: InputVariant;
}

export interface CardProps extends BaseComponentProps {
  onPress?: () => void;
  elevation?: ShadowLevel;
  padding?: keyof Spacing;
  radius?: keyof BorderRadii;
}

export type ChipVariant = 'default' | 'selected' | 'outline' | 'filter';

export interface ChipProps extends BaseComponentProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  variant?: ChipVariant;
  size?: 'sm' | 'md';
}

export type SkeletonVariant = 'rect' | 'circle' | 'text';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  style?: any;
}
