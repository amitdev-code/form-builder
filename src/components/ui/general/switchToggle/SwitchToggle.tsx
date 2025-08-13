import React from 'react';
import { cn } from '../../../../utils/cn';

export interface SwitchToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: 'default' | 'modern' | 'minimal' | 'rounded' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  showStatus?: boolean;
  className?: string;
  trackColor?: string;
  thumbColor?: string;
  activeColor?: string;
  inactiveColor?: string;
}

const SwitchToggle: React.FC<SwitchToggleProps> = ({
  checked,
  onChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  label,
  labelPosition = 'right',
  showStatus = false,
  className,
  trackColor,
  thumbColor,
  activeColor,
  inactiveColor
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled) {
      onChange(!checked);
    }
  };

  // Calculate size classes
  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return {
          track: 'h-5 w-9',
          thumb: 'h-3 w-3',
          translate: checked ? 'translate-x-4' : 'translate-x-1'
        };
      case 'md':
        return {
          track: 'h-6 w-11',
          thumb: 'h-4 w-4',
          translate: checked ? 'translate-x-5' : 'translate-x-1'
        };
      case 'lg':
        return {
          track: 'h-7 w-14',
          thumb: 'h-5 w-5',
          translate: checked ? 'translate-x-7' : 'translate-x-1'
        };
      default:
        return {
          track: 'h-6 w-11',
          thumb: 'h-4 w-4',
          translate: checked ? 'translate-x-5' : 'translate-x-1'
        };
    }
  })();

  // Calculate variant classes
  const variantClasses = (() => {
    switch (variant) {
      case 'modern':
        return {
          track: cn(
            'relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out',
            sizeClasses.track,
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            checked 
              ? activeColor || 'bg-gradient-to-r from-blue-500 to-purple-600' 
              : inactiveColor || 'bg-gray-200 hover:bg-gray-300',
            className
          ),
          thumb: cn(
            'inline-block rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out',
            sizeClasses.thumb,
            sizeClasses.translate,
            thumbColor || 'bg-white'
          )
        };
      
      case 'minimal':
        return {
          track: cn(
            'relative inline-flex items-center rounded-full transition-colors duration-200',
            sizeClasses.track,
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            checked 
              ? activeColor || 'bg-blue-600' 
              : inactiveColor || 'bg-gray-300',
            className
          ),
          thumb: cn(
            'inline-block rounded-full bg-white transition-transform duration-200',
            sizeClasses.thumb,
            sizeClasses.translate,
            thumbColor || 'bg-white'
          )
        };
      
      case 'rounded':
        return {
          track: cn(
            'relative inline-flex items-center rounded-lg transition-all duration-300 ease-in-out',
            sizeClasses.track,
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            checked 
              ? activeColor || 'bg-green-500' 
              : inactiveColor || 'bg-gray-200',
            className
          ),
          thumb: cn(
            'inline-block rounded-md bg-white shadow-md transition-all duration-300 ease-in-out',
            sizeClasses.thumb,
            sizeClasses.translate,
            thumbColor || 'bg-white'
          )
        };
      
      case 'pill':
        return {
          track: cn(
            'relative inline-flex items-center rounded-full transition-all duration-500 ease-in-out',
            sizeClasses.track,
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            checked 
              ? activeColor || 'bg-gradient-to-r from-pink-500 to-red-500' 
              : inactiveColor || 'bg-gray-200',
            className
          ),
          thumb: cn(
            'inline-block rounded-full bg-white shadow-lg transition-all duration-500 ease-in-out',
            sizeClasses.thumb,
            sizeClasses.translate,
            thumbColor || 'bg-white',
            checked && 'scale-110'
          )
        };
      
      default:
        return {
          track: cn(
            'relative inline-flex items-center rounded-full transition-colors duration-200',
            sizeClasses.track,
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            checked 
              ? activeColor || 'bg-blue-600' 
              : inactiveColor || 'bg-gray-200',
            className
          ),
          thumb: cn(
            'inline-block rounded-full bg-white transition-transform duration-200',
            sizeClasses.thumb,
            sizeClasses.translate,
            thumbColor || 'bg-white'
          )
        };
    }
  })();

  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <span className={cn(
        'text-xs font-medium',
        labelPosition === 'left' ? 'mr-3' : 'ml-3',
        disabled ? 'text-gray-400' : 'text-gray-700'
      )}>
        {label}
      </span>
    );
  };

  const renderStatus = () => {
    if (!showStatus) return null;
    
    return (
      <span className={cn(
        'ml-2 text-xs font-medium',
        disabled ? 'text-gray-400' : 'text-gray-500'
      )}>
        {checked ? 'ON' : 'OFF'}
      </span>
    );
  };

  return (
    <div className="flex items-center">
      {labelPosition === 'left' && renderLabel()}
      
      <button
        type="button"
        onClick={handleToggle}
        onMouseDown={(e) => e.preventDefault()}
        disabled={disabled}
        className={variantClasses.track}
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle switch'}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={variantClasses.thumb} />
      </button>
      
      {labelPosition === 'right' && renderLabel()}
      {renderStatus()}
    </div>
  );
};

export default SwitchToggle; 