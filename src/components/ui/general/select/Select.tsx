import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { cn } from '../../../../utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  error?: boolean;
  errorMessage?: string;
  showArrow?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
  error = false,
  errorMessage,
  showArrow = true,
  searchable = false,
  clearable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current option
  const currentOption = options.find(option => option.value === value);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !option.disabled
      )
    : options.filter(option => !option.disabled);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, filteredOptions]);

  // Auto-scroll to highlighted option
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleToggle = () => {
    if (disabled) return;
    
    if (!isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };

  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (e: React.MouseEvent, option: SelectOption) => {
    e.preventDefault();
    e.stopPropagation();
    handleOptionSelect(option);
  };

  const handleOptionMouseDown = (e: React.MouseEvent, option: SelectOption) => {
    e.preventDefault();
    e.stopPropagation();
    handleOptionSelect(option);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white border-gray-300 hover:border-gray-400',
    outline: 'bg-transparent border-gray-300 hover:border-gray-400',
    filled: 'bg-gray-50 border-gray-300 hover:border-gray-400',
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Select Trigger */}
      <div
        ref={selectRef}
        className={cn(
          'relative flex items-center justify-between w-full px-3 border rounded-md cursor-pointer transition-colors duration-200',
          sizeClasses[size],
          variantClasses[variant],
          error && 'border-red-500 focus:border-red-500',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-100',
          isOpen && 'border-blue-500 ring-1 ring-blue-500'
        )}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Display Value */}
        <div className="flex-1 min-w-0">
          {searchable && isOpen ? (
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-transparent outline-none placeholder-gray-400"
              placeholder="Search..."
              autoFocus
            />
          ) : (
            <span className={cn(
              'block truncate text-xs uppercase',
              !currentOption && 'text-gray-400'
            )}>
              {currentOption ? currentOption.label : placeholder}
            </span>
          )}
        </div>

        {/* Clear Button */}
        {clearable && value && !disabled && (
          <button
            onClick={handleClear}
            className="ml-2 p-1 hover:bg-gray-100 rounded"
            type="button"
          >
            <Icon icon="mdi:close" className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Arrow Icon */}
        {showArrow && (
          <Icon
            icon="mdi:chevron-down"
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width
          }}
          role="listbox"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-500 uppercase">
              No options found
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={cn(
                  'px-3 py-2 cursor-pointer transition-colors duration-150 text-xs uppercase flex items-center justify-between',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  !option.disabled && 'hover:bg-blue-50',
                  index === highlightedIndex && 'bg-blue-50',
                  option.value === value && 'bg-blue-100 text-blue-900'
                )}
                onClick={(e) => handleOptionClick(e, option)}
                onMouseDown={(e) => handleOptionMouseDown(e, option)}
                role="option"
                aria-selected={option.value === value}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Icon icon="mdi:check" className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))
          )}
        </div>,
        document.body
      )}

      {/* Error Message */}
      {error && errorMessage && (
        <div className="mt-1 text-sm text-red-500">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Select; 