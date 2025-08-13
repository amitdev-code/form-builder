import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { HexColorPicker } from 'react-colorful';
import type { RootState } from '../../../../store/store';
import {
    updateTextContent,
    updateTextDesign
} from '../../../../store/slices/formBuilderSlice';
import { TextEditor } from '../../../ui/general/TextEditor/TextEditor';
import Slider from '../../../ui/general/slider/Slider';
import Select from '../../../ui/general/select/Select';

export const TextEditorLeftSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const { formData, selectedSlide, selectedSlideContent } = useSelector((state: RootState) => state.formBuilder);

    // Get current slide and selected content
    const currentSlide = formData.find(slide => slide.id === selectedSlide);
    const selectedContent = currentSlide?.content.find(content => content.id === selectedSlideContent);

    // Local state for form controls
    const [fontSize, setFontSize] = useState<string>('');
    const [fontSizeUnit, setFontSizeUnit] = useState<'px' | 'em' | 'rem'>('px');
    const [fontSpacing, setFontSpacing] = useState<number>(0);
    const [fontLineHeight, setFontLineHeight] = useState<number>(1.5);
    const [fontLetterSpacing, setFontLetterSpacing] = useState<number>(0);
    const [fontColor, setFontColor] = useState<string>('#000000');
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

    // Refs for click outside handling
    const colorPickerRef = useRef<HTMLDivElement>(null);

    // Initialize form when content changes
    useEffect(() => {
        if (selectedContent?.text_design) {
            const design = selectedContent.text_design;
            setFontSize(design.font_size?.replace(/[^\d.]/g, '') || '16');
            setFontSizeUnit(design.font_size?.includes('em') ? 'em' : design.font_size?.includes('rem') ? 'rem' : 'px');
            setFontSpacing(parseFloat(design.font_spacing || '0'));
            setFontLineHeight(parseFloat(design.font_line_height || '1.5'));
            setFontLetterSpacing(parseFloat(design.font_letter_spacing || '0'));
            setFontColor(design.font_color || '#000000');
        }
    }, [selectedContent]);

    // Click outside handler for color picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
        };

        if (showColorPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    if (!currentSlide || !selectedContent || selectedContent.type !== 'text') {
        return (
            <div className="p-4 text-center text-gray-500">
                <Icon icon="mdi:text" className="w-8 h-8 mx-auto mb-2" />
                <p>Select a text element to edit</p>
            </div>
        );
    }

    const handleTextChange = (newText: string) => {
        if (selectedSlide && selectedSlideContent) {
            dispatch(updateTextContent({
                slideId: selectedSlide,
                contentId: selectedSlideContent,
                text: newText
            }));
        }
    };

    const handleDesignChange = (property: string, value: string | number) => {
        if (selectedSlide && selectedSlideContent) {
            dispatch(updateTextDesign({
                slideId: selectedSlide,
                contentId: selectedSlideContent,
                designProperty: property,
                value
            }));
        }
    };

    const handleFontSizeChange = (newSize: string) => {
        setFontSize(newSize);
        handleDesignChange('font_size', `${newSize}${fontSizeUnit}`);
    };

    const handleFontSizeIncrement = () => {
        const newSize = parseFloat(fontSize) + 1;
        handleFontSizeChange(newSize.toString());
    };

    const handleFontSizeDecrement = () => {
        const newSize = Math.max(1, parseFloat(fontSize) - 1);
        handleFontSizeChange(newSize.toString());
    };

    const handleFontLineHeightChange = (value: number) => {
        setFontLineHeight(value);
        handleDesignChange('font_line_height', value.toString());
    };

    const handleFontLetterSpacingChange = (value: number) => {
        setFontLetterSpacing(value);
        handleDesignChange('font_letter_spacing', value.toString());
    };

    const handleFontColorChange = (color: string) => {
        setFontColor(color);
        handleDesignChange('font_color', color);
    };

    return (
        <div className="p-4 space-y-6 overflow-y-auto h-full max-h-[calc(100vh-2rem)] scrollbar-hide">
            {/* Text Content Editor */}
            <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-700 uppercase">Text Content</label>
                <TextEditor
                    value={selectedContent.text_design?.text || ''}
                    onChange={handleTextChange}
                    placeholder="Enter your text here..."
                    className="w-full"
                />
            </div>

            {/* Font Transform */}
            <div className="space-y-3 flex items-center gap-5">
                <label className="block text-xs font-medium text-gray-700 uppercase">Text Transform</label>
                <Select
                    options={[
                        { value: 'none', label: 'None' },
                        { value: 'uppercase', label: 'Uppercase' },
                        { value: 'lowercase', label: 'Lowercase' },
                        { value: 'capitalize', label: 'Capitalize' }
                    ]}
                    value={selectedContent.text_design?.font_transform || 'none'}
                    onChange={(value) => handleDesignChange('font_transform', value as string)}
                    placeholder="Select transform"
                    size="sm"
                    className="w-1/2"
                />
            </div>

            {/* Font Color */}
            <div className="space-y-3 flex items-center gap-5">
                <label className="block text-xs font-medium text-gray-700 uppercase">Font Color</label>
                <div className="flex items-center space-x-2">
                    <div className="relative" ref={colorPickerRef}>
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: fontColor }}
                        >
                            <Icon icon="bx:color-fill" className="w-4 h-4 text-white" />
                        </button>
                        {showColorPicker && (
                            <div className="absolute z-10 mt-2">
                                <HexColorPicker color={fontColor} onChange={handleFontColorChange} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3 flex items-center gap-5">
                <label className="block text-xs font-medium text-gray-700 uppercase">Font Size</label>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleFontSizeDecrement}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <Icon icon="mdi:minus" className="w-3 h-3" />
                    </button>
                    <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        className="w-16 text-xs text-center border border-gray-300 rounded-md px-2 py-1.5"
                        min="1"
                    />
                    <button
                        onClick={handleFontSizeIncrement}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <Icon icon="mdi:plus" className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Font Alignment */}
            <div className="space-y-3 flex items-center gap-5">
                <label className="block text-xs font-medium text-gray-700 uppercase">Alignment</label>
                <div className="flex space-x-2">
                    {[
                        { value: 'left', icon: 'mdi:format-align-left' },
                        { value: 'center', icon: 'mdi:format-align-center' },
                        { value: 'right', icon: 'mdi:format-align-right' }
                    ].map((alignment) => (
                        <button
                            key={alignment.value}
                            onClick={() => handleDesignChange('font_alignment', alignment.value)}
                            className={`p-2 border rounded-md ${selectedContent.text_design?.font_alignment === alignment.value
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <Icon icon={alignment.icon} className="w-3 h-3" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Spacing */}
            <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-700 uppercase">
                    Letter Spacing: {fontLetterSpacing}px
                </label>
                <Slider
                    min={-5}
                    max={10}
                    step={0.1}
                    value={fontLetterSpacing}
                    onChange={handleFontLetterSpacingChange}
                    showTooltip={true}
                    tooltipContent={(value) => `${value}px`}
                    valueSuffix="px"
                    className="w-full"
                />
            </div>

            {/* Line Height */}
            <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-700 uppercase">
                    Line Height: {fontLineHeight}
                </label>
                <Slider
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={fontLineHeight}
                    onChange={handleFontLineHeightChange}
                    showTooltip={true}
                    tooltipContent={(value) => value.toString()}
                    className="w-full"
                />
            </div>
        </div>
    );
};
