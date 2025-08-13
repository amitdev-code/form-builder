import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { updateQuestionContent, updateQuestionDesign } from '../../../../store/slices/formBuilderSlice';
import { Q_TextInput } from '../../Canvas/components/QuestionsUI/Q_TextInput/Q_TextInput';
import Select from '../../../ui/general/select/Select';
import { TextEditor } from '../../../ui/general/TextEditor/TextEditor';
import { SwitchToggle } from '../../../ui/general/switchToggle';
import { Icon } from '@iconify/react';
import { HexColorPicker } from 'react-colorful';

export const QuestionEditorLeftSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { formData, selectedSlide, selectedSlideContent } = useSelector((state: RootState) => state.formBuilder);

  // Get the currently selected slide and content
  const currentSlide = formData.find(slide => slide.id === selectedSlide);
  const selectedContent = currentSlide?.content.find(content => content.id === selectedSlideContent);

  // Local state for form inputs
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'text' | 'single_select' | 'multi_select' | 'rating' | 'slider'>('text');
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionPlaceholder, setQuestionPlaceholder] = useState('');
  const [questionErrorMessage, setQuestionErrorMessage] = useState('');

  // Question styling states
  const [questionTextAlignment, setQuestionTextAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [questionDescriptionAlignment, setQuestionDescriptionAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [questionErrorMessageAlignment, setQuestionErrorMessageAlignment] = useState<'left' | 'center' | 'right'>('left');

  // Text input specific states
  const [inputType, setInputType] = useState<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  const [inputVariant, setInputVariant] = useState<'floating' | 'sticky' | 'icon' | 'outlined' | 'filled' | 'minimal'>('floating');
  const [inputSize, setInputSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [inputWidth, setInputWidth] = useState('100%');
  const [inputBorderRadius, setInputBorderRadius] = useState('8px');
  const [inputBorderColor, setInputBorderColor] = useState('#e2e8f0');
  const [inputBackgroundColor, setInputBackgroundColor] = useState('#ffffff');
  const [inputTextColor, setInputTextColor] = useState('#1a202c');
  const [inputPlaceholderColor, setInputPlaceholderColor] = useState('#a0aec0');
  const [inputFocusColor, setInputFocusColor] = useState('#3182ce');
  const [inputErrorColor, setInputErrorColor] = useState('#e53e3e');
  const [inputFontSize, setInputFontSize] = useState('');
  const [inputFontWeight, setInputFontWeight] = useState('400');

  // Validation states
  const [validation, setValidation] = useState<'email' | 'number' | 'phone' | 'url' | 'password' | 'date' | 'time' | 'zipcode' | 'creditcard' | 'custom' | undefined>(undefined);
  const [customValidationPattern, setCustomValidationPattern] = useState('');
  const [customValidationMessage, setCustomValidationMessage] = useState('');

  // Color picker state
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showFocusColorPicker, setShowFocusColorPicker] = useState(false);

  // Get color picker position based on available space
  const getColorPickerPosition = (buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (!buttonRef.current) return 'right-0';
    
    const rect = buttonRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const pickerWidth = 200; // Approximate width of color picker
    
    // If there's not enough space on the right, position on the left
    if (rect.right + pickerWidth > windowWidth) {
      return 'left-0';
    }
    
    return 'right-0';
  };

  // Color button refs
  const borderColorButtonRef = React.useRef<HTMLButtonElement>(null);
  const backgroundColorButtonRef = React.useRef<HTMLButtonElement>(null);
  const textColorButtonRef = React.useRef<HTMLButtonElement>(null);
  const focusColorButtonRef = React.useRef<HTMLButtonElement>(null);

  // Handle click outside color pickers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.color-picker-container')) {
        setShowBorderColorPicker(false);
        setShowBackgroundColorPicker(false);
        setShowTextColorPicker(false);
        setShowFocusColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize form with selected content data
  useEffect(() => {
    if (selectedContent && selectedContent.type === 'question' && selectedContent.question_design) {
      const design = selectedContent.question_design;
      
      setQuestionText(design.question_text || '');
      setQuestionType(design.question_type || 'text');
      setQuestionDescription(design.question_description || '');
      setQuestionPlaceholder(design.question_placeholder || '');
      setQuestionErrorMessage(design.question_error_message || '');
      
      // Question styling properties
      setQuestionTextAlignment(design.question_alignment || 'center');
      setQuestionDescriptionAlignment(design.question_description_alignment || 'center');
      setQuestionErrorMessageAlignment(design.question_error_message_alignment || 'left');
      
      // Text input properties
      setInputType(design.input_type || 'text');
      setInputVariant(design.input_variant || 'floating');
      setInputSize(design.input_size || 'md');
      setInputWidth(design.input_width || '100%');
      setInputBorderRadius(design.input_border_radius || '8px');
      setInputBorderColor(design.input_border_color || '#e2e8f0');
      setInputBackgroundColor(design.input_background_color || '#ffffff');
      setInputTextColor(design.input_text_color || '#1a202c');
      setInputPlaceholderColor(design.input_placeholder_color || '#a0aec0');
      setInputFocusColor(design.input_focus_color || '#3182ce');
      setInputErrorColor(design.input_error_color || '#e53e3e');
      setInputFontSize(design.input_font_size || '');
      setInputFontWeight(design.input_font_weight || '400');
      
      // Validation properties
      setValidation(design.validation);
      setCustomValidationPattern(design.custom_validation?.pattern || '');
      setCustomValidationMessage(design.custom_validation?.message || '');
    }
  }, [selectedContent]);

  // Handle question text change
  const handleQuestionTextChange = (value: string) => {
    setQuestionText(value);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionContent({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        questionText: value
      }));
    }
  };

  // Handle question type change
  const handleQuestionTypeChange = (type: 'text' | 'single_select' | 'multi_select' | 'rating' | 'slider') => {
    setQuestionType(type);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_type',
        value: type
      }));
    }
  };

  // Handle required change
  const handleRequiredChange = (required: boolean) => {
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_required',
        value: required
      }));
    }
  };

  // Handle description change
  const handleDescriptionChange = (value: string) => {
    setQuestionDescription(value);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_description',
        value
      }));
    }
  };

  // Handle placeholder change
  const handlePlaceholderChange = (value: string) => {
    setQuestionPlaceholder(value);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_placeholder',
        value
      }));
    }
  };

  // Handle error message change
  const handleErrorMessageChange = (value: string) => {
    setQuestionErrorMessage(value);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_error_message',
        value
      }));
    }
  };

  // Handle question text alignment change
  const handleQuestionTextAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    setQuestionTextAlignment(alignment);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_alignment',
        value: alignment
      }));
    }
  };

  // Handle question description alignment change
  const handleQuestionDescriptionAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    setQuestionDescriptionAlignment(alignment);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_description_alignment',
        value: alignment
      }));
    }
  };

  // Handle error message alignment change
  const handleErrorMessageAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    setQuestionErrorMessageAlignment(alignment);
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: 'question_error_message_alignment',
        value: alignment
      }));
    }
  };

  // Handle input property changes
  const handleInputPropertyChange = (property: string, value: string) => {
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: property,
        value
      }));
    }
  };

  // Handle validation property changes
  const handleValidationPropertyChange = (property: string, value: any) => {
    if (selectedSlide && selectedSlideContent) {
      dispatch(updateQuestionDesign({
        slideId: selectedSlide,
        contentId: selectedSlideContent,
        designProperty: property,
        value
      }));
    }
  };

  // Render text input controls
  const renderTextInputControls = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Text Input Settings</h3>
        
        {/* Input Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Input Type</label>
          <Select
            options={[
              { value: 'text', label: 'Text' },
              { value: 'email', label: 'Email' },
              { value: 'password', label: 'Password' },
              { value: 'number', label: 'Number' },
              { value: 'tel', label: 'Phone' },
              { value: 'url', label: 'URL' }
            ]}
            value={inputType}
            onChange={(value) => {
              setInputType(value as any);
              handleInputPropertyChange('input_type', value as string);
            }}
            placeholder="Select input type"
            size="md"
            variant="default"
          />
        </div>

        {/* Input Variant */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Input Variant</label>
          <Select
            options={[
              { value: 'floating', label: 'Floating Label' },
              { value: 'sticky', label: 'Sticky Label' },
              { value: 'icon', label: 'With Icon' },
              { value: 'outlined', label: 'Outlined' },
              { value: 'filled', label: 'Filled' },
              { value: 'minimal', label: 'Minimal' }
            ]}
            value={inputVariant}
            onChange={(value) => {
              setInputVariant(value as any);
              handleInputPropertyChange('input_variant', value as string);
            }}
            placeholder="Select input variant"
            size="md"
            variant="default"
          />
        </div>

        {/* Input Size */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Input Size</label>
          <Select
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' }
            ]}
            value={inputSize}
            onChange={(value) => {
              setInputSize(value as any);
              handleInputPropertyChange('input_size', value as string);
            }}
            placeholder="Select input size"
            size="md"
            variant="default"
          />
        </div>

        {/* Width */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Width</label>
          <input
            type="text"
            value={inputWidth}
            onChange={(e) => {
              setInputWidth(e.target.value);
              handleInputPropertyChange('input_width', e.target.value);
            }}
            placeholder="100%"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Border Radius</label>
          <input
            type="text"
            value={inputBorderRadius}
            onChange={(e) => {
              setInputBorderRadius(e.target.value);
              handleInputPropertyChange('input_border_radius', e.target.value);
            }}
            placeholder="8px"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700 uppercase">Border Color</label>
            <div className="relative color-picker-container">
              <button
                type="button"
                className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: inputBorderColor }}
                onClick={() => setShowBorderColorPicker(!showBorderColorPicker)}
                ref={borderColorButtonRef}
              />
              {showBorderColorPicker && (
                <div className={`absolute top-full z-10 mt-2 ${getColorPickerPosition(borderColorButtonRef)}`}>
                  <HexColorPicker
                    color={inputBorderColor}
                    onChange={(color) => {
                      setInputBorderColor(color);
                      handleInputPropertyChange('input_border_color', color);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700 uppercase">Background Color</label>
            <div className="relative color-picker-container">
              <button
                type="button"
                className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: inputBackgroundColor }}
                onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
                ref={backgroundColorButtonRef}
              />
              {showBackgroundColorPicker && (
                <div className={`absolute top-full z-10 mt-2 ${getColorPickerPosition(backgroundColorButtonRef)}`}>
                  <HexColorPicker
                    color={inputBackgroundColor}
                    onChange={(color) => {
                      setInputBackgroundColor(color);
                      handleInputPropertyChange('input_background_color', color);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700 uppercase">Text Color</label>
            <div className="relative color-picker-container">
              <button
                type="button"
                className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: inputTextColor }}
                onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                ref={textColorButtonRef}
              />
              {showTextColorPicker && (
                <div className={`absolute top-full z-10 mt-2 ${getColorPickerPosition(textColorButtonRef)}`}>
                  <HexColorPicker
                    color={inputTextColor}
                    onChange={(color) => {
                      setInputTextColor(color);
                      handleInputPropertyChange('input_text_color', color);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700 uppercase">Focus Color</label>
            <div className="relative color-picker-container">
              <button
                type="button"
                className="w-8 h-8 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: inputFocusColor }}
                onClick={() => setShowFocusColorPicker(!showFocusColorPicker)}
                ref={focusColorButtonRef}
              />
              {showFocusColorPicker && (
                <div className={`absolute top-full z-10 mt-2 ${getColorPickerPosition(focusColorButtonRef)}`}>
                  <HexColorPicker
                    color={inputFocusColor}
                    onChange={(color) => {
                      setInputFocusColor(color);
                      handleInputPropertyChange('input_focus_color', color);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Font Size and Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Font Size</label>
            <input
              type="text"
              value={inputFontSize}
              onChange={(e) => {
                setInputFontSize(e.target.value);
                handleInputPropertyChange('input_font_size', e.target.value);
              }}
              placeholder="16px"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Font Weight</label>
            <Select
              options={[
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' }
              ]}
              value={inputFontWeight}
              onChange={(value) => {
                setInputFontWeight(value as string);
                handleInputPropertyChange('input_font_weight', value as string);
              }}
              placeholder="Select font weight"
              size="md"
              variant="default"
            />
          </div>
        </div>
      </div>
    );
  };

  // Render validation controls
  const renderValidationControls = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Validation Settings</h3>
        
        {/* Validation Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Validation Type</label>
          <Select
            options={[
              { value: '', label: 'No Validation' },
              { value: 'email', label: 'Email' },
              { value: 'number', label: 'Number' },
              { value: 'phone', label: 'Phone' },
              { value: 'url', label: 'URL' },
              { value: 'password', label: 'Password' },
              { value: 'date', label: 'Date' },
              { value: 'time', label: 'Time' },
              { value: 'zipcode', label: 'ZIP Code' },
              { value: 'creditcard', label: 'Credit Card' },
              { value: 'custom', label: 'Custom' }
            ]}
            value={validation || ''}
            onChange={(value) => {
              const val = value || undefined;
              setValidation(val as any);
              handleValidationPropertyChange('validation', val);
            }}
            placeholder="Select validation type"
            size="md"
            variant="default"
          />
        </div>

        {/* Custom Validation */}
        {validation === 'custom' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Custom Pattern</label>
              <input
                type="text"
                value={customValidationPattern}
                onChange={(e) => {
                  setCustomValidationPattern(e.target.value);
                  handleValidationPropertyChange('custom_validation', {
                    pattern: e.target.value,
                    message: customValidationMessage
                  });
                }}
                placeholder="Enter regex pattern"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Error Message</label>
              <input
                type="text"
                value={customValidationMessage}
                onChange={(e) => {
                  setCustomValidationMessage(e.target.value);
                  handleValidationPropertyChange('custom_validation', {
                    pattern: customValidationPattern,
                    message: e.target.value
                  });
                }}
                placeholder="Enter error message"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Validation Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700 uppercase">Validate on Change</label>
            <SwitchToggle
              checked={selectedContent?.question_design?.validate_on_change || false}
              onChange={(checked) => {
                if (selectedSlide && selectedSlideContent) {
                  dispatch(updateQuestionDesign({
                    slideId: selectedSlide,
                    contentId: selectedSlideContent,
                    designProperty: 'validate_on_change',
                    value: checked
                  }));
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700 uppercase">Validate on Blur</label>
            <SwitchToggle
              checked={selectedContent?.question_design?.validate_on_blur || false}
              onChange={(checked) => {
                if (selectedSlide && selectedSlideContent) {
                  dispatch(updateQuestionDesign({
                    slideId: selectedSlide,
                    contentId: selectedSlideContent,
                    designProperty: 'validate_on_blur',
                    value: checked
                  }));
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-700 uppercase">Show Validation Message</label>
            <SwitchToggle
              checked={selectedContent?.question_design?.show_validation_message || false}
              onChange={(checked) => {
                if (selectedSlide && selectedSlideContent) {
                  dispatch(updateQuestionDesign({
                    slideId: selectedSlide,
                    contentId: selectedSlideContent,
                    designProperty: 'show_validation_message',
                    value: checked
                  }));
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render preview
  const renderPreview = () => {
    if (questionType === 'text') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Q_TextInput
              label={questionText || 'Question Text'}
              placeholder={questionPlaceholder || 'Enter your answer'}
              type={inputType}
              variant={inputVariant}
              size={inputSize}
              width={inputWidth}
              borderRadius={inputBorderRadius}
              borderColor={inputBorderColor}
              backgroundColor={inputBackgroundColor}
              textColor={inputTextColor}
              placeholderColor={inputPlaceholderColor}
              focusColor={inputFocusColor}
              errorColor={inputErrorColor}
              fontSize={inputFontSize}
              fontWeight={inputFontWeight}
              validation={validation}
              customValidation={validation === 'custom' ? {
                pattern: customValidationPattern,
                message: customValidationMessage
              } : undefined}
              validateOnChange={selectedContent?.question_design?.validate_on_change || false}
              validateOnBlur={selectedContent?.question_design?.validate_on_blur || false}
              showValidationMessage={selectedContent?.question_design?.show_validation_message || false}
              required={selectedContent?.question_design?.question_required || false}
              errorMessage={questionErrorMessage}
              errorMessageAlignment={questionErrorMessageAlignment}
              errorMessageFontSize={selectedContent?.question_design?.question_error_message_font_size || '12px'}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-600">Preview for {questionType} will be implemented soon.</p>
        </div>
      </div>
    );
  };

  // Render based on question type
  const renderQuestionTypeControls = () => {
    switch (questionType) {
      case 'text':
        return renderTextInputControls();
      case 'single_select':
        return <div className="p-4 text-gray-600">Single select controls will be implemented soon.</div>;
      case 'multi_select':
        return <div className="p-4 text-gray-600">Multi select controls will be implemented soon.</div>;
      case 'rating':
        return <div className="p-4 text-gray-600">Rating controls will be implemented soon.</div>;
      case 'slider':
        return <div className="p-4 text-gray-600">Slider controls will be implemented soon.</div>;
      default:
        return null;
    }
  };

  if (!selectedContent || selectedContent.type !== 'question') {
    return (
      <div className="p-4">
        <p className="text-gray-500">No question selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-h-screen overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900">Question Editor</h2>

      {/* Question Type */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Question Type</label>
        <Select
          options={[
            { value: 'text', label: 'Text Input' },
            { value: 'single_select', label: 'Single Select' },
            { value: 'multi_select', label: 'Multi Select' },
            { value: 'rating', label: 'Rating' },
            { value: 'slider', label: 'Slider' }
          ]}
          value={questionType}
          onChange={(value) => handleQuestionTypeChange(value as any)}
          placeholder="Select question type"
          size="md"
          variant="default"
        />
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Question Text</label>
        <TextEditor
          value={questionText}
          onChange={handleQuestionTextChange}
          placeholder="Enter your question"
          className="border border-gray-300 rounded-md"
        />
      </div>

      {/* Question Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-gray-700 uppercase">Description (Optional)</label>
          <div className="flex items-center">
            <SwitchToggle
              label="Enabled"
              checked={selectedContent?.question_design?.question_description_enabled || false}
              onChange={(enabled) => {
                if (selectedSlide && selectedSlideContent) {
                  dispatch(updateQuestionDesign({
                    slideId: selectedSlide,
                    contentId: selectedSlideContent,
                    designProperty: 'question_description_enabled',
                    value: enabled
                  }));
                }
              }}
            />
          </div>
        </div>
        {selectedContent?.question_design?.question_description_enabled && (
          <TextEditor
            value={questionDescription}
            onChange={handleDescriptionChange}
            placeholder="Add a description to help users understand the question"
            className="border border-gray-300 rounded-md"
          />
        )}
      </div>

      {/* Required */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-700 uppercase">Required Question</label>
        <SwitchToggle
          checked={selectedContent?.question_design?.question_required || false}
          onChange={(checked) => handleRequiredChange(checked)}
        />
      </div>

      {/* Placeholder */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Placeholder Text</label>
        <input
          type="text"
          value={questionPlaceholder}
          onChange={(e) => handlePlaceholderChange(e.target.value)}
          placeholder="Enter placeholder text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Message */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Error Message</label>
        <input
          type="text"
          value={questionErrorMessage}
          onChange={(e) => handleErrorMessageChange(e.target.value)}
          placeholder="Enter error message"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Question Text Alignment */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Question Text Alignment</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleQuestionTextAlignmentChange('left')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionTextAlignment === 'left'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-left-line" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleQuestionTextAlignmentChange('center')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionTextAlignment === 'center'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-center-line" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleQuestionTextAlignmentChange('right')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionTextAlignment === 'right'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-right-line" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Question Description Alignment */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Description Alignment</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleQuestionDescriptionAlignmentChange('left')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionDescriptionAlignment === 'left'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-left-line" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleQuestionDescriptionAlignmentChange('center')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionDescriptionAlignment === 'center'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-center-line" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleQuestionDescriptionAlignmentChange('right')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionDescriptionAlignment === 'right'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-right-line" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Message Alignment */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Error Message Alignment</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleErrorMessageAlignmentChange('left')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionErrorMessageAlignment === 'left'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-left-line" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleErrorMessageAlignmentChange('center')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionErrorMessageAlignment === 'center'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-center-line" className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleErrorMessageAlignmentChange('right')}
            className={`w-10 h-10 px-2 py-2 text-sm font-medium rounded-md border transition-colors flex items-center justify-center ${
              questionErrorMessageAlignment === 'right'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon icon="mingcute:align-right-line" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Type-specific controls */}
      {renderQuestionTypeControls()}

      {/* Validation controls */}
      {questionType === 'text' && renderValidationControls()}

      {/* Preview */}
      {renderPreview()}
    </div>
  );
};
