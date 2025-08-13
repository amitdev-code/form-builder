import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../../utils/cn';

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showTooltip?: boolean;
  tooltipPlacement?: 'top' | 'bottom';
  tooltipContent?: (value: number) => string;
  checkpoints?: number[];
  checkpointLabels?: Record<number, string>;
  className?: string;
  disabled?: boolean;
  showValue?: boolean;
  valueSuffix?: string;
  valuePrefix?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  showTooltip = true,
  tooltipPlacement = 'top',
  tooltipContent,
  checkpoints = [],
  checkpointLabels = {},
  className,
  disabled = false,
  showValue = false,
  valueSuffix = '',
  valuePrefix = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showValueTooltip, setShowValueTooltip] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate percentage for current value
  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  // Calculate value from percentage
  const getValueFromPercentage = (percentage: number) => {
    const rawValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    // Format to max 2 decimal places
    return Number.isInteger(steppedValue) ? steppedValue : Number(steppedValue.toFixed(2));
  };

  // Handle mouse/touch events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = getValueFromPercentage(percentage);
    
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove as any);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle click on track
  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = getValueFromPercentage(percentage);
    
    onChange(newValue);
  };

  // Handle checkpoint click
  const handleCheckpointClick = (checkpointValue: number) => {
    if (disabled) return;
    onChange(checkpointValue);
  };

  // Generate tooltip content
  const getTooltipContent = () => {
    if (tooltipContent) {
      return tooltipContent(value);
    }
    // Format value to max 2 decimal places
    const formattedValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
    return `${valuePrefix}${formattedValue}${valueSuffix}`;
  };

  // Generate checkpoints
  const generateCheckpoints = () => {
    if (checkpoints.length === 0) return null;

    return checkpoints.map((checkpoint) => {
      const percentage = getPercentage(checkpoint);
      const isActive = value >= checkpoint;
      const label = checkpointLabels[checkpoint] || checkpoint.toString();

      return (
        <div
          key={checkpoint}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{ left: `${percentage}%` }}
          onClick={() => handleCheckpointClick(checkpoint)}
        >
          <div
            className={cn(
              'w-3 h-3 rounded-full border-2 transition-all duration-200',
              isActive
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-300 hover:border-blue-300'
            )}
          />
          {label && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs text-gray-500 whitespace-nowrap">
              {label}
            </div>
          )}
        </div>
      );
    });
  };

  const currentPercentage = getPercentage(value);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Value Display */}
      {showValue && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">
            {valuePrefix}{min}{valueSuffix}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {valuePrefix}{value}{valueSuffix}
          </span>
          <span className="text-xs text-gray-500">
            {valuePrefix}{max}{valueSuffix}
          </span>
        </div>
      )}

      {/* Slider Track */}
      <div
        ref={sliderRef}
        className={cn(
          'relative w-full h-2 bg-gray-200 rounded-full cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleTrackClick}
      >
        {/* Filled Track */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-200"
          style={{ width: `${currentPercentage}%` }}
        />

        {/* Checkpoints */}
        {generateCheckpoints()}

        {/* Thumb */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-md transition-all duration-200',
            isDragging && 'scale-110 shadow-lg',
            disabled && 'cursor-not-allowed'
          )}
          style={{ left: `${currentPercentage}%` }}
          onMouseDown={handleMouseDown}
          onMouseEnter={() => setShowValueTooltip(true)}
          onMouseLeave={() => setShowValueTooltip(false)}
        />

        {/* Tooltip */}
        {showTooltip && showValueTooltip && (
          <div
            className={cn(
              'absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-lg whitespace-nowrap',
              tooltipPlacement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              'left-1/2 -translate-x-1/2'
            )}
          >
            {getTooltipContent()}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-gray-800 transform rotate-45',
                tooltipPlacement === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1',
                'left-1/2 -translate-x-1/2'
              )}
            />
          </div>
        )}
      </div>

      {/* Step Indicators (if step is small enough) */}
      {step <= (max - min) / 10 && (
        <div className="flex justify-between mt-1">
          {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
            const stepValue = min + i * step;
            const isActive = value >= stepValue;
            
            return (
              <div
                key={stepValue}
                className={cn(
                  'w-1 h-1 rounded-full transition-colors duration-200',
                  isActive ? 'bg-blue-500' : 'bg-gray-300'
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Slider; 