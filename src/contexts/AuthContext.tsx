import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User } from '../types';
import { sessionStorage, STORAGE_KEYS } from '../utils/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  completeOnboarding: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'LOAD_STATE'; payload: AuthState };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  onboardingCompleted: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        onboardingCompleted: false, // New users need onboarding
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        onboardingCompleted: false,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        onboardingCompleted: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboardingCompleted: true,
      };
    case 'LOAD_STATE':
      return {
        ...action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Save state to session storage
  const saveState = (authState: AuthState) => {
    try {
      sessionStorage.set(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify({
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        onboardingCompleted: authState.onboardingCompleted,
        error: authState.error,
      }));
    } catch (error) {
      console.error('Error saving auth state to session storage:', error);
    }
  };

  // Load state from session storage
  const loadState = (): AuthState | null => {
    try {
      const savedState = sessionStorage.get(STORAGE_KEYS.AUTH_TOKEN);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return {
          user: parsedState.user,
          isAuthenticated: parsedState.isAuthenticated,
          isLoading: false,
          error: parsedState.error,
          onboardingCompleted: parsedState.onboardingCompleted,
        };
      }
    } catch (error) {
      console.error('Error loading auth state from session storage:', error);
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        onboardingCompleted: false,
      };
      dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
      saveState(newState);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Login failed' });
    }
  };

  const logout = () => {
    dispatch({ type: 'AUTH_LOGOUT' });
    sessionStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        email: userData.email,
        name: userData.name,
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        onboardingCompleted: false,
      };
      dispatch({ type: 'AUTH_SUCCESS', payload: mockUser });
      saveState(newState);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Registration failed' });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      dispatch({ type: 'UPDATE_USER', payload: userData });
      // Update session storage with new user data
      const updatedUser = state.user ? { ...state.user, ...userData } : null;
      const newState = {
        ...state,
        user: updatedUser,
      };
      saveState(newState);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Profile update failed' });
    }
  };

  const completeOnboarding = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    // Update session storage with onboarding completion
    const newState = {
      ...state,
      onboardingCompleted: true,
    };
    saveState(newState);
  };

  useEffect(() => {
    // Load state from session storage on mount
    const savedState = loadState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    } else {
      // No saved state, set as not authenticated
      dispatch({ type: 'AUTH_FAILURE', payload: '' });
    }
  }, []);

  // Save state to session storage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      saveState(state);
    }
  }, [state]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 