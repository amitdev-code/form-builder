import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import type { RootState } from '../../../../store/store';
import { updateButtonContent, updateButtonDesign } from '../../../../store/slices/formBuilderSlice';

export const ButtonEditorLeftSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { formData, selectedSlide, selectedSlideContent } = useSelector((state: RootState) => state.formBuilder);

  // Get the currently selected slide and content
  const currentSlide = formData.find(slide => slide.id === selectedSlide);
  const selectedContent = currentSlide?.content.find(content => content.id === selectedSlideContent);

  // Button state
  const [buttonText, setButtonText] = useState(selectedContent?.button_design?.button_text || '');
  const [buttonColor, setButtonColor] = useState(selectedContent?.button_design?.button_color || '#ffffff');
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState(selectedContent?.button_design?.button_background_color || '#7257fe');
  const [buttonBorderColor, setButtonBorderColor] = useState(selectedContent?.button_design?.button_border_color || '#7257fe');
  const [buttonBorderRadius, setButtonBorderRadius] = useState(selectedContent?.button_design?.button_border_radius || '6px');
  const [buttonFontSize, setButtonFontSize] = useState(selectedContent?.button_design?.button_font_size || '14px');
  const [buttonFontWeight, setButtonFontWeight] = useState(selectedContent?.button_design?.button_font_weight || '500');
  const [buttonWidth, setButtonWidth] = useState(selectedContent?.button_design?.button_width || 'auto');
  const [buttonShadow, setButtonShadow] = useState(selectedContent?.button_design?.button_shadow || 'none');
  const [hasChanges, setHasChanges] = useState(false);

  // Text formatting state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Update local state when selected content changes
  useEffect(() => {
    if (selectedContent?.button_design) {
      const design = selectedContent.button_design;
      setButtonText(design.button_text || '');
      setButtonColor(design.button_color || '#ffffff');
      setButtonBackgroundColor(design.button_background_color || '#3B82F6');
      setButtonBorderColor(design.button_border_color || '#3B82F6');
      setButtonBorderRadius(design.button_border_radius || '6px');
      setButtonFontSize(design.button_font_size || '14px');
      setButtonFontWeight(design.button_font_weight || '500');
      setButtonWidth(design.button_width || 'auto');
      setButtonShadow(design.button_shadow || 'none');
      setHasChanges(false);
    }
  }, [selectedContent]);

  // Check for changes
  const checkForChanges = () => {
    if (!selectedContent?.button_design) return false;
    
    const design = selectedContent.button_design;
    return (
      buttonText !== (design.button_text || '') ||
      buttonColor !== (design.button_color || '#ffffff') ||
      buttonBackgroundColor !== (design.button_background_color || '#3B82F6') ||
      buttonBorderColor !== (design.button_border_color || '#3B82F6') ||
      buttonBorderRadius !== (design.button_border_radius || '6px') ||
      buttonFontSize !== (design.button_font_size || '14px') ||
      buttonFontWeight !== (design.button_font_weight || '500') ||
      buttonWidth !== (design.button_width || 'auto') ||
      buttonShadow !== (design.button_shadow || 'none')
    );
  };

  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [buttonText, buttonColor, buttonBackgroundColor, buttonBorderColor, buttonBorderRadius, buttonFontSize, buttonFontWeight, buttonWidth, buttonShadow, selectedContent]);

  const handleApplyButton = () => {
    if (!selectedContent || !currentSlide) return;

    // Update button text
    dispatch(updateButtonContent({
      slideId: currentSlide.id,
      contentId: selectedContent.id,
      buttonText: buttonText
    }));

    // Update button design properties
    const designUpdates = [
      { property: 'button_color', value: buttonColor },
      { property: 'button_background_color', value: buttonBackgroundColor },
      { property: 'button_border_color', value: buttonBorderColor },
      { property: 'button_border_radius', value: buttonBorderRadius },
      { property: 'button_font_size', value: buttonFontSize },
      { property: 'button_font_weight', value: buttonFontWeight },
      { property: 'button_width', value: buttonWidth },
      { property: 'button_shadow', value: buttonShadow }
    ];

    designUpdates.forEach(({ property, value }) => {
      dispatch(updateButtonDesign({
        slideId: currentSlide.id,
        contentId: selectedContent.id,
        designProperty: property,
        value: value
      }));
    });

    console.log('Applied button changes:', {
      buttonText,
      buttonColor,
      buttonBackgroundColor,
      buttonBorderColor,
      buttonBorderRadius,
      buttonFontSize,
      buttonFontWeight,
      buttonWidth,
      buttonShadow
    });
  };

  // Show message if no content is selected
  if (!selectedContent || selectedContent.type !== 'button') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Button Editor</h3>
          <p className="text-xs text-gray-500 mt-1">Edit button properties and styling</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-sm">No button selected</p>
            <p className="text-xs">Select a button element to edit its properties</p>
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
          <h3 className="text-sm font-semibold text-gray-900">Button Editor</h3>
          <p className="text-xs text-gray-500 mt-1">Edit button properties and styling</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Button Text */}
          <div className="px-4 py-3 border-b border-gray-200">
            <label className="text-xs font-medium text-gray-700 block mb-2">Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Enter button text..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            
            {/* Text Formatting Controls */}
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`w-8 h-8 flex items-center justify-center rounded border ${
                  isBold ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                title="Bold"
              >
                <Icon icon="mdi:format-bold" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`w-8 h-8 flex items-center justify-center rounded border ${
                  isItalic ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                title="Italic"
              >
                <Icon icon="mdi:format-italic" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`w-8 h-8 flex items-center justify-center rounded border ${
                  isUnderline ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                title="Underline"
              >
                <Icon icon="mdi:format-underline" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-3">Colors</h4>
            
            {/* Text Color */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 block mb-2">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 block mb-2">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={buttonBackgroundColor}
                  onChange={(e) => setButtonBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={buttonBackgroundColor}
                  onChange={(e) => setButtonBackgroundColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Border Color */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Border Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={buttonBorderColor}
                  onChange={(e) => setButtonBorderColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={buttonBorderColor}
                  onChange={(e) => setButtonBorderColor(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Sizing */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-3">Sizing</h4>
            
            {/* Width */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 block mb-2">Width</label>
              <select
                value={buttonWidth}
                onChange={(e) => setButtonWidth(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="auto">Auto</option>
                <option value="100px">100px</option>
                <option value="150px">150px</option>
                <option value="200px">200px</option>
                <option value="250px">250px</option>
                <option value="300px">300px</option>
                <option value="100%">100%</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 block mb-2">Font Size</label>
              <select
                value={buttonFontSize}
                onChange={(e) => setButtonFontSize(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Font Weight</label>
              <select
                value={buttonFontWeight}
                onChange={(e) => setButtonFontWeight(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
              </select>
            </div>
          </div>

          {/* Styling */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-3">Styling</h4>
            
            {/* Border Radius */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 block mb-2">Border Radius</label>
              <select
                value={buttonBorderRadius}
                onChange={(e) => setButtonBorderRadius(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="0px">None (0px)</option>
                <option value="2px">Small (2px)</option>
                <option value="4px">Medium (4px)</option>
                <option value="6px">Large (6px)</option>
                <option value="8px">Extra Large (8px)</option>
                <option value="12px">Rounded (12px)</option>
                <option value="20px">Pill (20px)</option>
              </select>
            </div>

            {/* Shadow */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Shadow</label>
              <select
                value={buttonShadow}
                onChange={(e) => setButtonShadow(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="none">None</option>
                <option value="0 1px 3px 0 rgba(0, 0, 0, 0.1)">Small</option>
                <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Medium</option>
                <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Large</option>
                <option value="0 20px 25px -5px rgba(0, 0, 0, 0.1)">Extra Large</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="px-4 py-3">
            <h4 className="text-xs font-medium text-gray-700 mb-3">Preview</h4>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 rounded transition-all"
                style={{
                  color: buttonColor,
                  backgroundColor: buttonBackgroundColor,
                  border: `1px solid ${buttonBorderColor}`,
                  borderRadius: buttonBorderRadius,
                  fontSize: buttonFontSize,
                  fontWeight: isBold ? 'bold' : buttonFontWeight,
                  width: buttonWidth === 'auto' ? 'auto' : buttonWidth,
                  boxShadow: buttonShadow,
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none'
                }}
              >
                {buttonText || 'Button Text'}
              </button>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-4 py-3 mt-auto">
          <button
            onClick={handleApplyButton}
            disabled={!hasChanges}
            className={`w-full py-2 px-3 rounded-lg transition-colors font-medium text-sm ${
              hasChanges 
                ? 'bg-primary text-white hover:bg-primary-600 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Apply Button
          </button>
        </div>
      </div>
    </Fragment>
  );
};
