// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
}

// Route types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  isProtected?: boolean;
  roles?: string[];
  layout?: React.ComponentType;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
} 

export interface FormSettings {
  navigation : {
    navigationLayout: 'bottom' | 'floating';
  },
  general : {
    brandLogo: string;
    showWebezeBranding: boolean;
    fontFamily: string;
    headerNavMenu: boolean;
    headerNavMenuItems: {
      id: string;
      name: string;
      url: string;
    }[];
    footerNavMenu: boolean;
    footerNavMenuItems: {
      id: string;
      name: string;
      url: string;
    }[];
    addedHeaderItems: {
      id: string;
      name: string;
      url: string;
    }[];
    addedFooterItems: {
      id: string;
      name: string;
      url: string;
    }[];
  }
}

export interface FormSlide {
  id: string;
  name: string;
  description: string;
  type: 'welcome' | 'question' | 'result' | 'thankyou';
  visible: boolean;
  backgroundType: 'color' | 'image';
  backgroundColor: string;
  backgroundOpacity: number;
  backgroundImage: string;
  backgroundImagePosition?: string;
  backgroundImageSize?: string;
  backgroundImageRepeat?: string;
  layout: 'full-width' | 'divided-lr' | 'boxed-full' | 'boxed-lr' | 'boxed-ud';
  variant: string;
  content: {
    id: string;
    type: 'text' | 'media' | 'question' | 'button';
    text_design?: {
      text?: string;
      type?: 'header' | 'subheader' | 'body' | 'caption' | 'other';
      font_family?: string;
      font_size?: string;
      font_color?: string;
      font_alignment?: string;
      font_weight?: string;
      font_style?: string;
      font_decoration?: string;
      font_spacing?: string;
      font_line_height?: string;
      font_letter_spacing?: string;
      font_tracking?: string;
      font_transform?: string;
    }
    media_design?: {
      media? : string;
      mediaType?: 'image' | 'video';
      mediaAlt?: string;
      mediaCaption?: string;
      mediaDescription?: string;
      mediaWidth?: string;
      mediaHeight?: string;
      mediaPosition?: string;
      mediaAlignment?: string;
      mediaOverlay?: boolean;
      mediaOverlayColor?: string;
      mediaOverlayOpacity?: number;
      mediaOverlayPosition?: string;
    }
    question_design?: {
      question_type?: 'text' | 'single_select' | 'multi_select' | 'rating' | 'slider';
      question_text?: string;
      question_options?: string[];
      question_required?: boolean;
      question_description?: string;
      question_description_enabled?: boolean;
      question_placeholder?: string;
      question_error_message?: string;
      
      // Text input specific properties
      input_type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
      input_variant?: 'floating' | 'sticky' | 'icon' | 'outlined' | 'filled' | 'minimal';
      input_size?: 'sm' | 'md' | 'lg' | 'xl';
      input_width?: string;
      input_height?: string;
      input_border_radius?: string;
      input_border_color?: string;
      input_border_width?: string;
      input_background_color?: string;
      input_text_color?: string;
      input_placeholder_color?: string;
      input_focus_color?: string;
      input_error_color?: string;
      input_font_size?: string;
      input_font_weight?: string;
      input_font_family?: string;
      input_padding?: string;
      input_margin?: string;
      
      // Validation properties
      validation?: 'email' | 'number' | 'phone' | 'url' | 'password' | 'date' | 'time' | 'zipcode' | 'creditcard' | 'custom';
      custom_validation?: {
        pattern: string;
        message: string;
        expectedValue?: string;
      };
      validate_on_change?: boolean;
      validate_on_blur?: boolean;
      show_validation_message?: boolean;
      
      // Single/Multi select specific properties
      select_type?: 'radio' | 'checkbox' | 'dropdown';
      select_layout?: 'vertical' | 'horizontal' | 'grid';
      select_style?: 'default' | 'card' | 'button' | 'minimal';
      select_max_selections?: number;
      select_min_selections?: number;
      
      // Rating specific properties
      rating_max?: number;
      rating_style?: 'star' | 'heart' | 'number' | 'emoji';
      rating_size?: 'sm' | 'md' | 'lg' | 'xl';
      rating_color?: string;
      rating_empty_color?: string;
      rating_hover_color?: string;
      
      // Slider specific properties
      slider_min?: number;
      slider_max?: number;
      slider_step?: number;
      slider_default_value?: number;
      slider_show_value?: boolean;
      slider_show_ticks?: boolean;
      slider_orientation?: 'horizontal' | 'vertical';
      slider_color?: string;
      slider_track_color?: string;
      slider_thumb_color?: string;
      
      // General styling properties
      question_font_size?: string;
      question_font_color?: string;
      question_font_weight?: string;
      question_font_family?: string;
      question_alignment?: 'left' | 'center' | 'right';
      question_description_alignment?: 'left' | 'center' | 'right';
      question_description_font_size?: string;
      question_error_message_alignment?: 'left' | 'center' | 'right';
      question_error_message_font_size?: string;
      question_margin?: string;
      question_padding?: string;
    }
    button_design?: {
      button_text?: string;
      button_url?: string;
      button_color?: string;
      button_background_color?: string;
      button_border_color?: string;
      button_border_radius?: string;
      button_font_size?: string;
      button_font_weight?: string;
      button_width?: string;
      button_shadow?: string;
    }
  }[]
}