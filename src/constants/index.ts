// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Fest Information
export const FEST_INFO = {
  name: 'Aavhaan 2026',
  organization: 'Shri Ram Group, Jabalpur',
  tagline: 'CODE IT. BUILD IT. BREAK LIMITS.',
  theme: 'Unity in Diversity',
  dates: {
    start: '2026-04-08',
    end: '2026-04-09',
  },
  venue: 'Shri Ram Group Campus, Jabalpur',
  description: 'The ultimate technology festival celebrating innovation, creativity, and technical excellence.',
  contact: {
    phone: ['9755042292', '9755042293'],
    email: 'info@srigroup.net',
    address: 'Near ITI Madhotal, Jabalpur (M.P.)',
  },
  socialMedia: {
    website: 'www.srigroup.net',
    instagram: '@sriramgroup',
    facebook: 'SriRamGroupJabalpur',
    twitter: '@sriramgroup',
    linkedin: 'sri-ram-group',
    youtube: 'SriRamGroupJabalpur',
  },
};

// Event Categories
export const EVENT_CATEGORIES = {
  CULTURAL: 'cultural',
  TECHNICAL: 'technical',
} as const;

// Event Days
export const EVENT_DAYS = {
  DAY_1: 1,
  DAY_2: 2,
} as const;

// Day Information
export const DAY_INFO = {
  1: {
    date: '2026-04-08',
    title: 'Cultural Day',
    theme: 'Unity in Diversity',
    description: 'Celebrating cultural diversity through traditional events and performances',
    events: [
      'Traditional Dress Show',
      'Folk Dance Performances',
      'Ethnic Fashion Walk',
      'Mr. & Ms. Ethnic Shri Ram',
      'Cultural Night',
      'Award Ceremony',
    ],
  },
  2: {
    date: '2026-04-09',
    title: 'Technical Day',
    theme: 'Innovation & Technology',
    description: 'Technical competitions, workshops, and grand prize ceremony',
    events: [
      'Coding Competitions',
      'Hackathon',
      'Technical Workshops',
      'Project Presentations',
      'Innovation Showcase',
      'DJ Night',
      'Grand Prize Ceremony',
    ],
  },
};

// Registration Status
export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  CHECKED_IN: 'checked_in',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PENDING_VERIFICATION: 'pending_verification',
  PAID: 'paid',
  REJECTED: 'rejected',
  FAILED: 'failed',
} as const;

// Participation Types
export const PARTICIPATION_TYPES = {
  SOLO: 'solo',
  TEAM: 'team',
} as const;

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Department Options
export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Pharmacy',
  'Management',
  'Commerce',
  'Arts',
  'Science',
  'Law',
  'Other',
];

// Year/Semester Options
export const YEAR_SEMESTER_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
];

// Announcement Types
export const ANNOUNCEMENT_TYPES = {
  INFO: 'info',
  URGENT: 'urgent',
  UPDATE: 'update',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Admin Roles
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  CULTURAL_ADMIN: 'cultural_admin',
  TECHNICAL_ADMIN: 'technical_admin',
  COORDINATOR: 'coordinator',
} as const;

// File Upload Constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  EVENTS_PER_PAGE: 12,
  REGISTRATIONS_PER_PAGE: 20,
  ANNOUNCEMENTS_PER_PAGE: 10,
};

// Cache Times (in milliseconds)
export const CACHE_TIMES = {
  EVENTS: 5 * 60 * 1000, // 5 minutes
  ANNOUNCEMENTS: 2 * 60 * 1000, // 2 minutes
  PAYMENT_CONFIG: 10 * 60 * 1000, // 10 minutes
  DASHBOARD_STATS: 1 * 60 * 1000, // 1 minute
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  REGISTRATION_ID: /^SRGTF2026-\d{6}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_NAME: 'Name should contain only letters and spaces (2-50 characters)',
  FILE_TOO_LARGE: 'File size should not exceed 5MB',
  INVALID_FILE_TYPE: 'Only JPEG, PNG, and WebP images are allowed',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  REGISTRATION_CLOSED: 'Registration for this event is closed.',
  EVENT_FULL: 'This event has reached maximum capacity.',
  DUPLICATE_REGISTRATION: 'You have already registered for this event.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUBMITTED: 'Registration submitted successfully! Please upload your payment screenshot.',
  PAYMENT_UPLOADED: 'Payment screenshot uploaded successfully! Your registration is under review.',
  REGISTRATION_APPROVED: 'Congratulations! Your registration has been approved.',
  TICKET_DOWNLOADED: 'Ticket downloaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  FILTERS: 'filters',
  RECENT_SEARCHES: 'recent_searches',
};

// Routes
export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:slug',
  SCHEDULE: '/schedule',
  REGISTRATION: '/registration/:eventId',
  MY_TICKETS: '/my-tickets',
  TICKET_LOOKUP: '/ticket-lookup',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_REGISTRATIONS: '/admin/registrations',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements',
  NOT_FOUND: '/404',
};

// Meta Tags
export const META_TAGS = {
  DEFAULT_TITLE: 'Aavhaan 2026 - Shri Ram Group, Jabalpur',
  DEFAULT_DESCRIPTION: 'Join the ultimate technology festival at Shri Ram Group, Jabalpur. Experience innovation, creativity, and technical excellence on April 8-9, 2026.',
  DEFAULT_KEYWORDS: 'aavhaan, tech fest, technology festival, shri ram group, jabalpur, coding competition, hackathon, cultural events, technical events',
  DEFAULT_IMAGE: '/images/og-image.jpg',
  SITE_NAME: 'Aavhaan 2026',
  TWITTER_HANDLE: '@sriramgroup',
};

// Feature Flags
export const FEATURES = {
  REAL_TIME_UPDATES: true,
  PUSH_NOTIFICATIONS: true,
  DARK_MODE: true,
  OFFLINE_MODE: false,
  ANALYTICS: true,
  ERROR_REPORTING: true,
};

// External Links
export const EXTERNAL_LINKS = {
  COLLEGE_WEBSITE: 'https://www.srigroup.net',
  GOOGLE_MAPS: 'https://maps.google.com/?q=Shri+Ram+Group+Jabalpur',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  SUPPORT_EMAIL: 'mailto:support@srigroup.net',
  SUPPORT_PHONE: 'tel:+919755042292',
};