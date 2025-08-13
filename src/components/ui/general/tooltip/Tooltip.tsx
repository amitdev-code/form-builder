import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../../utils/cn';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  textColor?: string;
  backgroundColor?: string;
  className?: string;
  delay?: number;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  textColor = 'text-primary',
  backgroundColor = 'bg-white',
  className,
  delay = 200,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipClasses = () => {
    const baseClasses = cn(
      'absolute z-[9999] px-3 py-2 text-[11px] min-w-max font-semibold rounded-lg shadow-lg',
      textColor,
      backgroundColor,
      'transition-opacity duration-200',
      'pointer-events-none',
      className
    );

    switch (placement) {
      case 'top':
        return cn(baseClasses, 'bottom-full left-1/2 -translate-x-1/2 mb-2');
      case 'bottom':
        return cn(baseClasses, 'top-full left-1/2 -translate-x-1/2 mt-2');
      case 'left':
        return cn(baseClasses, 'right-full top-1/2 -translate-y-1/2 mr-2');
      case 'right':
        return cn(baseClasses, 'left-full top-1/2 -translate-y-1/2 ml-2');
      default:
        return baseClasses;
    }
  };

  const getArrowClasses = () => {
    const baseArrowClasses = 'absolute w-2 h-2 transform rotate-45';
    
    switch (placement) {
      case 'top':
        return cn(baseArrowClasses, backgroundColor, 'top-full left-1/2 -translate-x-1/2 -mt-1');
      case 'bottom':
        return cn(baseArrowClasses, backgroundColor, 'bottom-full left-1/2 -translate-x-1/2 -mb-1');
      case 'left':
        return cn(baseArrowClasses, backgroundColor, 'left-full top-1/2 -translate-y-1/2 -ml-1');
      case 'right':
        return cn(baseArrowClasses, backgroundColor, 'right-full top-1/2 -translate-y-1/2 -mr-1');
      default:
        return '';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={cn('inline-block', className)}
      >
        {children}
      </div>

      {isVisible && (
        <div className={getTooltipClasses()}>
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 