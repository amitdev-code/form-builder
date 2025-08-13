import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import type { RootState } from '../../../../store/store';
import { updateSlide } from '../../../../store/slices/formBuilderSlice';

interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

export const SlideColor: React.FC = () => {
  const dispatch = useDispatch();
  const { formData, selectedSlide } = useSelector((state: RootState) => state.formBuilder);

  // Get the currently selected slide
  const currentSlide = formData.find(slide => slide.id === selectedSlide);

  // Initialize state from current slide
  const [selectedColor, setSelectedColor] = useState<string>(currentSlide?.backgroundColor || '#3B82F6');
  const [customColor, setCustomColor] = useState<string>(currentSlide?.backgroundColor || '#3B82F6');
  const [saturation, setSaturation] = useState<number>(100);
  const [opacity, setOpacity] = useState<number>((currentSlide?.backgroundOpacity || 1) * 100);
  const [rgbaColor, setRgbaColor] = useState<RGBA>({ r: 59, g: 130, b: 246, a: 1 });
  const [hslColor, setHslColor] = useState<HSL>({ h: 217, s: 91, l: 60 });
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorButtonRef = useRef<HTMLDivElement>(null);

  // Update local state when selected slide changes
  useEffect(() => {
    if (currentSlide) {
      setSelectedColor(currentSlide.backgroundColor || '#3B82F6');
      setCustomColor(currentSlide.backgroundColor || '#3B82F6');
      setOpacity((currentSlide.backgroundOpacity || 1) * 100);
      setHasChanges(false); // Reset changes when slide changes
    }
  }, [currentSlide]);

  // Check if current values differ from slide values
  const checkForChanges = () => {
    if (!currentSlide) return false;
    
    const currentColor = currentSlide.backgroundColor || '#3B82F6';
    const currentOpacity = (currentSlide.backgroundOpacity || 1) * 100;
    
    return selectedColor !== currentColor || opacity !== currentOpacity;
  };

  // Update hasChanges whenever color or opacity changes
  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [selectedColor, opacity, currentSlide]);

  const popularColors: ColorOption[] = [
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Orange', value: 'orange', hex: '#F97316' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Yellow', value: 'yellow', hex: '#EAB308' },
    { name: 'Teal', value: 'teal', hex: '#14B8A6' },
    { name: 'Indigo', value: 'indigo', hex: '#6366F1' },
    { name: 'Gray', value: 'gray', hex: '#6B7280' },
    { name: 'Slate', value: 'slate', hex: '#64748B' },
    { name: 'Emerald', value: 'emerald', hex: '#059669' },
  ];

  // Convert hex to RGB
  const hexToRgb = (hex: string): RGBA => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: opacity / 100
    } : { r: 0, g: 0, b: 0, a: 1 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  };

  // Update HSL color when selected color changes
  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHslColor({ h, s, l });
  }, [selectedColor]);

  // Apply saturation and opacity to color
  const getAdjustedColor = (): string => {
    const rgb = hexToRgb(selectedColor);
    const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Apply saturation as a percentage of the original saturation
    const adjustedSaturation = (saturation / 100) * s;
    const [r, g, b] = hslToRgb(h, adjustedSaturation, l);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  // Update RGBA color when selected color changes
  useEffect(() => {
    setRgbaColor(hexToRgb(selectedColor));
  }, [selectedColor]);

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color.hex);
    setCustomColor(color.hex);
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value);
    const [r, g, b] = hslToRgb(hue, hslColor.s, hslColor.l);
    const hex = rgbToHex(r, g, b);
    setHslColor(prev => ({ ...prev, h: hue }));
    setSelectedColor(hex);
    setCustomColor(hex);
  };

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSaturation(value);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setOpacity(value);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setCustomColor(value);
      setSelectedColor(value);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(255, numValue));
    const newRgba = { ...rgbaColor, [component]: clampedValue };
    setRgbaColor(newRgba);
    const hex = rgbToHex(newRgba.r, newRgba.g, newRgba.b);
    setSelectedColor(hex);
    setCustomColor(hex);
  };

  const handleApplyColor = () => {
    if (!currentSlide) return;

    // Update the slide in Redux with the new color and opacity
    dispatch(updateSlide({
      id: currentSlide.id,
      data: {
        backgroundColor: selectedColor,
        backgroundOpacity: opacity / 100,
        backgroundType: 'color' // Set to color type when applying a color
      }
    }));

    console.log('Applied color to slide:', currentSlide.id, 'Color:', selectedColor, 'Opacity:', opacity / 100);
  };

  const generateRandomColor = () => {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    // Convert to hex
    const hex = rgbToHex(r, g, b);
    
    // Update all color states
    setSelectedColor(hex);
    setCustomColor(hex);
    setRgbaColor({ r, g, b, a: opacity / 100 });
    
    // Update HSL values
    const [h, s, l] = rgbToHsl(r, g, b);
    setHslColor({ h, s, l });
  };

  const handleColorPickerToggle = () => {
    if (!showColorPicker && colorButtonRef.current) {
      const rect = colorButtonRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.top - 30,
        left: rect.left - 320 - 10 // Position to the left of the button (320px width + 10px gap)
      });
    }
    setShowColorPicker(!showColorPicker);
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node) &&
          colorButtonRef.current && !colorButtonRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const adjustedColor = getAdjustedColor();

  // Show message if no slide is selected
  if (!currentSlide) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Slide Color</h3>
          <p className="text-xs text-gray-500 mt-1">Choose a color for your slide</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-sm">No slide selected</p>
            <p className="text-xs">Select a slide to customize its color</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Slide Color</h3>
          <p className="text-xs text-gray-500 mt-1">Choose a color for your slide</p>
        </div>

        {/* Current Color Preview */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Current Color</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-lg border border-gray-300 shadow-sm"
                style={{ backgroundColor: adjustedColor }}
              ></div>
              <span className="text-xs font-mono text-gray-600">{adjustedColor}</span>
            </div>
          </div>
        </div>

        {/* Popular Colors */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 mb-3">Popular Colors</h4>
          <div className="grid grid-cols-6 gap-2">
            {popularColors.map((color) => (
              <div
                key={color.value}
                onClick={() => handleColorSelect(color)}
                className="group cursor-pointer transition-transform hover:scale-110"
                title={color.name}
              >
                <div 
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 mb-3">Custom Color</h4>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div
                ref={colorButtonRef}
                onClick={handleColorPickerToggle}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer shadow-sm"
                style={{ backgroundColor: customColor }}
              ></div>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                placeholder="#3B82F6"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Saturation Slider */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Saturation</span>
            <span className="text-xs text-gray-500">{saturation}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={handleSaturationChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="h-2 rounded-lg"
                style={{ 
                  width: `${saturation}%`,
                  background: `linear-gradient(to right, #e5e7eb 0%, ${selectedColor} 100%)`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Opacity Slider */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Opacity</span>
            <span className="text-xs text-gray-500">{opacity}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={handleOpacityChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="h-2 rounded-lg"
                style={{ 
                  width: `${opacity}%`,
                  background: `linear-gradient(to right, #e5e7eb 0%, ${selectedColor} 100%)`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-4 py-3 mt-auto">
          <button
            onClick={handleApplyColor}
            disabled={!hasChanges}
            className={`w-full py-2 px-3 rounded-lg transition-colors font-medium text-sm ${
              hasChanges 
                ? 'bg-primary text-white hover:bg-primary-600 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Apply Color
          </button>
        </div>
      </div>

      {/* Color Picker Modal - Fixed Position */}
      {showColorPicker && (
        <div 
          ref={colorPickerRef}
          className="fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80"
          style={{
            top: `${pickerPosition.top}px`,
            left: `${pickerPosition.left}px`
          }}
        >
          {/* Color Picker Header */}
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-semibold text-gray-900">Color Picker</h5>
            <button
              onClick={() => setShowColorPicker(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
            </button>
          </div>

          {/* Large Color Display */}
          <div className="relative mb-4">
            <div 
              className="w-full h-32 rounded-lg border border-gray-300 shadow-sm"
              style={{ backgroundColor: customColor }}
            >
              <button 
                onClick={generateRandomColor}
                className="absolute bottom-2 right-2 bg-white text-black text-xs px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                <Icon icon="solar:magic-stick-3-broken" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hue Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Hue</span>
              <span className="text-xs text-gray-500">{Math.round(hslColor.h)}°</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="360"
                value={hslColor.h}
                onChange={handleHueChange}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                }}
              />
            </div>
          </div>

          {/* Saturation/Lightness Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Saturation</span>
              <span className="text-xs text-gray-500">{Math.round(hslColor.s)}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={hslColor.s}
                onChange={(e) => {
                  const sat = parseInt(e.target.value);
                  const [r, g, b] = hslToRgb(hslColor.h, sat, hslColor.l);
                  const hex = rgbToHex(r, g, b);
                  setHslColor(prev => ({ ...prev, s: sat }));
                  setSelectedColor(hex);
                  setCustomColor(hex);
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #808080 0%, ${rgbToHex(...hslToRgb(hslColor.h, 100, hslColor.l))} 100%)`
                }}
              />
            </div>
          </div>

          {/* RGB/HEX Inputs */}
          <div className="grid grid-cols-5 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">HEX</label>
              <input
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-100 text-gray-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">R</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbaColor.r}
                onChange={(e) => handleRgbChange('r', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-black text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">G</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbaColor.g}
                onChange={(e) => handleRgbChange('g', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-black text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">B</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbaColor.b}
                onChange={(e) => handleRgbChange('b', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-black text-white"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">A</label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(opacity)}
                onChange={(e) => setOpacity(parseInt(e.target.value) || 100)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-black text-white"
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
