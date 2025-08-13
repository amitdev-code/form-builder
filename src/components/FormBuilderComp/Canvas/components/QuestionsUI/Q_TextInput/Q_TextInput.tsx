import React, { useState, useRef, useEffect } from 'react';

// Validation types
type ValidationType = 'email' | 'number' | 'phone' | 'url' | 'password' | 'date' | 'time' | 'zipcode' | 'creditcard' | 'custom';

// Custom validation interface
interface CustomValidation {
  pattern: string;
  message: string;
  expectedValue?: string;
}

// Props interface for the Q_TextInput component
interface Q_TextInputProps {
  // Basic props
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  
  // Variant props
  variant?: 'floating' | 'sticky' | 'icon' | 'outlined' | 'filled' | 'minimal';
  icon?: string; // Icon class or path
  iconPosition?: 'left' | 'right';
  
  // Styling props
  size?: 'sm' | 'md' | 'lg' | 'xl';
  width?: string;
  height?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  backgroundColor?: string;
  textColor?: string;
  placeholderColor?: string;
  labelColor?: string;
  focusColor?: string;
  errorColor?: string;
  
  // Typography props
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: string;
  
  // Spacing props
  padding?: string;
  margin?: string;
  gap?: string;
  
  // State props
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  errorMessageAlignment?: 'left' | 'center' | 'right';
  errorMessageFontSize?: string;
  success?: boolean;
  successMessage?: string;
  
  // Validation props
  validation?: ValidationType;
  customValidation?: CustomValidation;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showValidationMessage?: boolean;
  
  // Animation props
  animation?: boolean;
  animationDuration?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'bounce';
  
  // Accessibility props
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  
  // Event props
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  onEnter?: () => void;
  onValidationChange?: (isValid: boolean, message: string) => void;
  
  // Custom props
  className?: string;
  style?: React.CSSProperties;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

export const Q_TextInput: React.FC<Q_TextInputProps> = ({
  // Basic props
  value = '',
  onChange,
  placeholder = '',
  label = '',
  type = 'text',
  
  // Variant props
  variant = 'floating',
  icon,
  iconPosition = 'left',
  
  // Styling props
  size = 'md',
  width = '100%',
  height,
  borderRadius = '8px',
  borderColor = '#e2e8f0',
  borderWidth = '1px',
  backgroundColor = '#ffffff',
  textColor = '#1a202c',
  placeholderColor = '#a0aec0',
  labelColor = '#4a5568',
  focusColor = '#3182ce',
  errorColor = '#e53e3e',
  
  // Typography props
  fontSize,
  fontWeight = '400',
  fontFamily,
  letterSpacing,
  lineHeight,
  
  // Spacing props
  padding,
  margin = '0',
  gap = '8px',
  
  // State props
  disabled = false,
  readonly = false,
  required = false,
  error = false,
  errorMessage = '',
  errorMessageAlignment = 'left',
  errorMessageFontSize = '12px',
  success = false,
  successMessage = '',
  
  // Validation props
  validation,
  customValidation,
  validateOnChange = true,
  validateOnBlur = true,
  showValidationMessage = true,
  
  // Animation props
  animation = true,
  animationDuration = '0.2s',
  animationType = 'fade',
  
  // Accessibility props
  id,
  name,
  ariaLabel,
  ariaDescribedBy,
  
  // Event props
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onEnter,
  onValidationChange,
  
  // Custom props
  className = '',
  style = {},
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus = false,
  spellCheck = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!value);
  const [validationError, setValidationError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update filled state when value changes
  useEffect(() => {
    setIsFilled(!!value);
  }, [value]);

  // Validation patterns
  const validationPatterns = {
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address'
    },
    number: {
      pattern: /^\d+$/,
      message: 'Please enter only numbers'
    },
    phone: {
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    },
    url: {
      pattern: /^https?:\/\/.+/,
      message: 'Please enter a valid URL starting with http:// or https://'
    },
    password: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
    },
    date: {
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: 'Please enter a valid date in YYYY-MM-DD format'
    },
    time: {
      pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Please enter a valid time in HH:MM format'
    },
    zipcode: {
      pattern: /^\d{5}(-\d{4})?$/,
      message: 'Please enter a valid ZIP code'
    },
    creditcard: {
      pattern: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
      message: 'Please enter a valid credit card number'
    }
  };

  // Generate custom regex based on expected value
  const generateCustomRegex = (expectedValue: string): RegExp => {
    // Convert expected value to regex pattern
    let pattern = expectedValue
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
      .replace(/\\d/g, '\\d') // Handle digit placeholders
      .replace(/\\w/g, '\\w') // Handle word character placeholders
      .replace(/\\s/g, '\\s') // Handle space placeholders
      .replace(/\\n/g, '\\n') // Handle newline placeholders
      .replace(/\\t/g, '\\t'); // Handle tab placeholders

    return new RegExp(`^${pattern}$`);
  };

  // Validate input value
  const validateInput = (inputValue: string): { isValid: boolean; message: string } => {
    // If no validation is set, return valid
    if (!validation && !customValidation) {
      return { isValid: true, message: '' };
    }

    // Check if required field is empty
    if (required && !inputValue.trim()) {
      return { isValid: false, message: 'This field is required' };
    }

    // If empty and not required, consider valid
    if (!inputValue.trim()) {
      return { isValid: true, message: '' };
    }

    // Custom validation
    if (customValidation) {
      try {
        const regex = customValidation.pattern.startsWith('/') 
          ? new RegExp(customValidation.pattern.slice(1, -1))
          : generateCustomRegex(customValidation.pattern);
        
        if (!regex.test(inputValue)) {
          return { isValid: false, message: customValidation.message };
        }
      } catch (error) {
        console.error('Invalid custom regex pattern:', customValidation.pattern);
        return { isValid: false, message: 'Invalid validation pattern' };
      }
    }

    // Built-in validation
    if (validation && validation !== 'custom' && validationPatterns[validation]) {
      const { pattern, message } = validationPatterns[validation];
      if (!pattern.test(inputValue)) {
        return { isValid: false, message };
      }
    }

    return { isValid: true, message: '' };
  };

  // Handle validation
  const handleValidation = (inputValue: string) => {
    const validationResult = validateInput(inputValue);
    setIsValid(validationResult.isValid);
    setValidationError(validationResult.message);
    onValidationChange?.(validationResult.isValid, validationResult.message);
  };

  // Size configurations
  const sizeConfigs = {
    sm: {
      padding: '8px 12px',
      fontSize: '14px',
      height: '36px',
      iconSize: '16px',
    },
    md: {
      padding: '12px 16px',
      fontSize: '16px',
      height: '44px',
      iconSize: '20px',
    },
    lg: {
      padding: '16px 20px',
      fontSize: '18px',
      height: '52px',
      iconSize: '24px',
    },
    xl: {
      padding: '20px 24px',
      fontSize: '20px',
      height: '60px',
      iconSize: '28px',
    },
  };

  const currentSize = sizeConfigs[size];

  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (validateOnBlur) {
      handleValidation(value);
    }
    onBlur?.();
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter?.();
    }
    onKeyDown?.(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyUp?.(e);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setIsFilled(!!newValue);
    
    if (validateOnChange) {
      handleValidation(newValue);
    }
  };

  // Get dynamic styles based on state
  const getDynamicStyles = () => {
    const hasError = error || (!isValid && validationError);
    const baseStyles: React.CSSProperties = {
      width,
      height: height || currentSize.height,
      padding: padding || currentSize.padding,
      fontSize: fontSize || currentSize.fontSize,
      fontWeight,
      fontFamily,
      letterSpacing,
      lineHeight,
      borderRadius,
      border: `${borderWidth} solid ${hasError ? errorColor : isFocused ? focusColor : borderColor}`,
      backgroundColor: disabled ? '#f7fafc' : backgroundColor,
      color: disabled ? '#a0aec0' : textColor,
      margin,
      transition: animation ? `all ${animationDuration} ease-in-out` : 'none',
      outline: 'none',
      ...style,
    };

    // Add animation classes
    if (animation) {
      switch (animationType) {
        case 'slide':
          baseStyles.transform = isFocused ? 'translateY(-2px)' : 'translateY(0)';
          break;
        case 'scale':
          baseStyles.transform = isFocused ? 'scale(1.02)' : 'scale(1)';
          break;
        case 'bounce':
          baseStyles.transform = isFocused ? 'translateY(-4px)' : 'translateY(0)';
          break;
        default:
          break;
      }
    }

    return baseStyles;
  };

  // Get label styles
  const getLabelStyles = (): React.CSSProperties => {
    const baseLabelStyles: React.CSSProperties = {
      color: labelColor,
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '4px',
      display: 'block',
      transition: animation ? `all ${animationDuration} ease-in-out` : 'none',
    };

    if (variant === 'floating') {
      return {
        ...baseLabelStyles,
        position: 'absolute' as const,
        top: isFocused || isFilled ? '8px' : '50%',
        left: '16px',
        transform: isFocused || isFilled ? 'translateY(-50%) scale(0.85)' : 'translateY(-50%)',
        color: isFocused ? focusColor : labelColor,
        fontSize: isFocused || isFilled ? '12px' : '16px',
        backgroundColor: backgroundColor,
        padding: '0 4px',
        zIndex: 1,
      };
    }

    return baseLabelStyles;
  };

  // Get container styles
  const getContainerStyles = (): React.CSSProperties => {
    const baseContainerStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap,
    };

    if (variant === 'floating') {
      return {
        ...baseContainerStyles,
        position: 'relative',
      };
    }

    return baseContainerStyles;
  };

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;

    const iconStyles: React.CSSProperties = {
      fontSize: currentSize.iconSize,
      color: isFocused ? focusColor : labelColor,
      transition: animation ? `all ${animationDuration} ease-in-out` : 'none',
    };

    return (
      <div style={iconStyles}>
        {icon.startsWith('http') || icon.startsWith('/') ? (
          <img src={icon} alt="" style={{ width: currentSize.iconSize, height: currentSize.iconSize }} />
        ) : (
          <i className={icon}></i>
        )}
      </div>
    );
  };

  // Render input field
  const renderInput = () => {
    const inputStyles = getDynamicStyles();

    return (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder={variant === 'floating' ? '' : placeholder}
        disabled={disabled}
        readOnly={readonly}
        required={required}
        id={id}
        name={name}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedBy}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        spellCheck={spellCheck}
        style={{
          ...inputStyles,
          paddingLeft: icon && iconPosition === 'left' ? '48px' : inputStyles.paddingLeft,
          paddingRight: icon && iconPosition === 'right' ? '48px' : inputStyles.paddingRight,
        }}
        className={`q-text-input ${className}`.trim()}
      />
    );
  };

  // Render based on variant
  const renderVariant = () => {
    switch (variant) {
      case 'floating':
        return (
          <div style={getContainerStyles()}>
            {label && (
              <label style={getLabelStyles()}>
                {label}
              </label>
            )}
            {icon && iconPosition === 'left' && (
              <div style={{ position: 'absolute' as const, left: '16px', zIndex: 2 }}>
                {renderIcon()}
              </div>
            )}
            {renderInput()}
            {icon && iconPosition === 'right' && (
              <div style={{ position: 'absolute' as const, right: '16px', zIndex: 2 }}>
                {renderIcon()}
              </div>
            )}
          </div>
        );

      case 'sticky':
        return (
          <div style={getContainerStyles()}>
            {label && (
              <label style={getLabelStyles()}>
                {label}
              </label>
            )}
            <div style={{ position: 'relative' as const, display: 'flex', alignItems: 'center' }}>
              {icon && iconPosition === 'left' && (
                <div style={{ position: 'absolute' as const, left: '16px', zIndex: 2 }}>
                  {renderIcon()}
                </div>
              )}
              {renderInput()}
              {icon && iconPosition === 'right' && (
                <div style={{ position: 'absolute' as const, right: '16px', zIndex: 2 }}>
                  {renderIcon()}
                </div>
              )}
            </div>
          </div>
        );

      case 'icon':
        return (
          <div style={getContainerStyles()}>
            {icon && iconPosition === 'left' && renderIcon()}
            {renderInput()}
            {icon && iconPosition === 'right' && renderIcon()}
          </div>
        );

      case 'outlined':
        return (
          <div style={getContainerStyles()}>
            {label && (
              <label style={getLabelStyles()}>
                {label}
              </label>
            )}
            {renderInput()}
          </div>
        );

      case 'filled':
        return (
          <div style={getContainerStyles()}>
            {label && (
              <label style={getLabelStyles()}>
                {label}
              </label>
            )}
            {renderInput()}
          </div>
        );

      case 'minimal':
        return (
          <div style={getContainerStyles()}>
            {renderInput()}
          </div>
        );

      default:
        return renderInput();
    }
  };

  // Render status messages
  const renderStatusMessage = () => {
    const hasError = error || (!isValid && validationError);
    const errorMsg = error ? errorMessage : validationError;
    
    if (hasError && errorMsg && showValidationMessage) {
      const textAlign = errorMessageAlignment === 'center' ? 'center' : errorMessageAlignment === 'right' ? 'right' : 'left';
      return (
        <div style={{ color: errorColor, fontSize: errorMessageFontSize || '12px', marginTop: '4px', textAlign }}>
          {errorMsg}
        </div>
      );
    }

    if (success && successMessage) {
      return (
        <div style={{ color: '#38a169', fontSize: '12px', marginTop: '4px' }}>
          {successMessage}
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      {renderVariant()}
      {renderStatusMessage()}
    </div>
  );
};
