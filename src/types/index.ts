// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: PaginationInfo;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string[];
  code?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Event Types
export interface Event {
  _id: string;
  title: string;
  slug: string;
  category: 'cultural' | 'technical';
  department: string;
  day: 1 | 2 | 3;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  shortDescription: string;
  fullDescription: string;
  rules: string[];
  eligibility: string;
  participationType: 'solo' | 'team';
  minTeamSize?: number;
  maxTeamSize?: number;
  entryFee: number;
  prizeDetails: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  registrationDeadline: string;
  maxRegistrations: number;
  currentRegistrations: number;
  posterImage: string;
  bannerImage: string;
  status: 'draft' | 'published' | 'closed';
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Registration Types
export interface TeamMember {
  name: string;
  email: string;
  phone: string;
  instituteName: string;
  department: string;
  yearOrSemester: string;
}

export interface Registration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  instituteName: string;
  department: string;
  yearOrSemester: string;
  city: string;
  gender: 'male' | 'female' | 'other';
  eventId: string;
  eventTitle: string;
  eventDay: number;
  participationType: 'solo' | 'team';
  teamName?: string;
  teamMembers?: TeamMember[];
  amountExpected: number;
  amountPaid: number;
  paymentMethod: string;
  transactionId?: string;
  paymentScreenshotUrl?: string;
  paymentStatus: 'pending' | 'pending_verification' | 'paid' | 'rejected' | 'failed';
  registrationStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'checked_in';
  adminRemarks?: string;
  uniqueRegistrationId: string;
  qrCodeUrl?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Registration Form Types
export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  instituteName: string;
  department: string;
  yearOrSemester: string;
  city: string;
  gender: 'male' | 'female' | 'other';
  participationType: 'solo' | 'team';
  teamName?: string;
  teamMembers?: TeamMember[];
  paymentScreenshot?: File;
  transactionId?: string;
}

// Payment Configuration
export interface PaymentConfig {
  _id: string;
  qrImage: string;
  upiId: string;
  payeeName: string;
  note: string;
  active: boolean;
  updatedAt: string;
}

// Announcement Types
export interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'urgent' | 'update';
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalRegistrations: number;
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  totalCheckedIn: number;
  totalPaidAmount: number;
  totalPendingVerifications: number;
  eventWiseStats: EventStats[];
  dayWiseStats: DayStats[];
  categoryWiseStats: CategoryStats[];
  latestRegistrations: Registration[];
  topEvents: EventStats[];
}

export interface EventStats {
  eventId: string;
  eventTitle: string;
  totalRegistrations: number;
  totalApproved: number;
  totalPending: number;
  totalRevenue: number;
}

export interface DayStats {
  day: number;
  totalRegistrations: number;
  totalApproved: number;
  totalRevenue: number;
}

export interface CategoryStats {
  category: string;
  totalRegistrations: number;
  totalApproved: number;
  totalRevenue: number;
}

// UI State Types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Notification[];
  modals: ModalState[];
  filters: FilterState;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
}

export interface ModalState {
  id: string;
  type: string;
  isOpen: boolean;
  data?: any;
}

export interface FilterState {
  events: EventFilters;
  registrations: RegistrationFilters;
}

export interface EventFilters {
  day?: number;
  category?: string;
  department?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}

export interface RegistrationFilters {
  eventId?: string;
  day?: number;
  paymentStatus?: string;
  registrationStatus?: string;
  search?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  instituteName: string;
  department: string;
  registrations: Registration[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
}

// Admin Types
export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'cultural_admin' | 'technical_admin' | 'coordinator';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

// Fest Information
export interface FestInfo {
  name: string;
  organization: string;
  dates: {
    start: string;
    end: string;
  };
  tagline: string;
  theme: string;
  venue: string;
  description: string;
}

// Homepage Stats
export interface HomepageStats {
  totalEvents: number;
  totalRegistrations: number;
  totalParticipants: number;
  daysRemaining: number;
}

// Form Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// API Hook Types
export interface UseApiOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export interface MutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: ErrorResponse) => void;
  onSettled?: () => void;
}

// Route Types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
  title?: string;
  description?: string;
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    sans: string;
    display: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  image?: string;
  actions?: React.ReactNode;
  hover?: boolean;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};