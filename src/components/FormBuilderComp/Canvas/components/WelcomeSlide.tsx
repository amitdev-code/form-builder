import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { setSelectedSlideContent, openLeftSidebar, closeRightSidebar, openRightSidebar, closeLeftSidebar, setActiveSection } from '../../../../store/slices/formBuilderSlice';
import { Header, Footer, NavigationMenu } from './common';

export const WelcomeSlide: React.FC = () => {
    const dispatch = useDispatch();
    const { formData, selectedSlide, formSettings, selectedSlideContent } = useSelector((state: RootState) => state.formBuilder);

    // Get the currently selected slide
    const currentSlide = formData.find(slide => slide.id === selectedSlide);

    // Handle content item click
    const handleContentClick = (contentId: string) => {
        dispatch(setSelectedSlideContent(contentId));
        dispatch(openLeftSidebar());
        dispatch(closeRightSidebar());
    };

    // Handle click outside content (on slide background)
    const handleSlideBackgroundClick = (e: React.MouseEvent) => {
        // Only handle if clicking on the slide background, not on content
        if (e.target === e.currentTarget) {
            dispatch(setSelectedSlideContent(null));
            dispatch(closeLeftSidebar());
            dispatch(openRightSidebar());
            dispatch(setActiveSection('build'));
        }
    };

    // Check if the selected slide is actually a welcome type slide
    if (!currentSlide || currentSlide.type !== 'welcome') {
        return (
            <div className="min-h-[525px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <p>No welcome slide selected</p>
                </div>
            </div>
        );
    }

    // Get background styling based on slide properties
    const getBackgroundStyle = () => {
        if (currentSlide.backgroundImage) {
            return {
                backgroundImage: `url(${currentSlide.backgroundImage})`,
                backgroundSize: currentSlide.backgroundImageSize || 'cover',
                backgroundPosition: currentSlide.backgroundImagePosition || 'center',
                backgroundRepeat: currentSlide.backgroundImageRepeat || 'no-repeat',
                backgroundColor: currentSlide.backgroundColor, // Fallback color
                opacity: currentSlide.backgroundOpacity
            };
        }

        // For color background, apply the color with opacity
        if (currentSlide.backgroundType === 'color') {
            const color = currentSlide.backgroundColor;
            const opacity = currentSlide.backgroundOpacity;

            // Convert hex to rgba if needed
            if (color.startsWith('#')) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return {
                    backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`
                };
            }

            // If it's already rgba or other format, apply opacity
            return {
                backgroundColor: color,
                opacity: opacity
            };
        }

        // Default fallback
        return {
            backgroundColor: currentSlide.backgroundColor || '#ffffff',
            opacity: currentSlide.backgroundOpacity || 1
        };
    };

    const renderLayout = () => {
        switch (currentSlide.layout) {
            case 'full-width':
                return renderFullWidthLayout(currentSlide.variant);
        }
    }

    const renderFullWidthLayout = (variant: string) => {
        if (variant === 'fw-1') {
            return (
                <div
                    className="flex-1 flex items-center justify-center"
                    onClick={handleSlideBackgroundClick}
                >
                    <div className="w-full max-w-4xl text-center flex flex-col items-center justify-center">
                        {/* Render welcome slide content */}
                        {
                            currentSlide.content.map((item, index) => {

                                if (item.type === 'text') {
                                    const isSelected = selectedSlideContent === item.id;

                                    // Apply text design styles
                                    const textStyle: React.CSSProperties = {};
                                    if (item.text_design) {
                                        const design = item.text_design;
                                        if (design.font_size) textStyle.fontSize = design.font_size;
                                        if (design.font_color) textStyle.color = design.font_color;
                                        if (design.font_alignment) textStyle.textAlign = design.font_alignment as 'left' | 'center' | 'right';
                                        if (design.font_weight) textStyle.fontWeight = design.font_weight;
                                        if (design.font_style) textStyle.fontStyle = design.font_style;
                                        if (design.font_decoration) textStyle.textDecoration = design.font_decoration;
                                        if (design.font_spacing) textStyle.wordSpacing = `${design.font_spacing}px`;
                                        if (design.font_line_height) textStyle.lineHeight = design.font_line_height;
                                        if (design.font_letter_spacing) textStyle.letterSpacing = `${design.font_letter_spacing}px`;
                                        if (design.font_transform) textStyle.textTransform = design.font_transform as 'none' | 'uppercase' | 'lowercase' | 'capitalize';
                                        if (design.font_family) textStyle.fontFamily = design.font_family;
                                    }

                                    // Apply global font family from form settings
                                    const globalFontFamily = formSettings.general.fontFamily;
                                    if (globalFontFamily) {
                                        textStyle.fontFamily = globalFontFamily;
                                    }

                                    return (
                                        <div
                                            key={item.id || index}
                                            className={`cursor-pointer transition-all duration-200 relative ${isSelected
                                                ? 'border border-primary p-2'
                                                : 'hover:bg-white/10 p-2'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContentClick(item.id);
                                            }}
                                        >
                                            {isSelected && (
                                                <>
                                                    {/* Top-left corner square */}
                                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Top-right corner square */}
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-left corner square */}
                                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-right corner square */}
                                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>
                                                </>
                                            )}
                                            <div
                                                className="mb-2 max-w-3xl mx-auto"
                                                style={textStyle}
                                                dangerouslySetInnerHTML={{ __html: item.text_design?.text || '' }}
                                            >

                                            </div>
                                        </div>
                                    );
                                }
                                if (item.type === 'button') {
                                    const isSelected = selectedSlideContent === item.id;
                                    
                                    // Apply button design styles
                                    const buttonStyle: React.CSSProperties = {};
                                    if (item.button_design) {
                                        const design = item.button_design;
                                        if (design.button_color) buttonStyle.color = design.button_color;
                                        if (design.button_background_color) buttonStyle.backgroundColor = design.button_background_color;
                                        if (design.button_border_color) buttonStyle.borderColor = design.button_border_color;
                                        if (design.button_border_radius) buttonStyle.borderRadius = design.button_border_radius;
                                        if (design.button_font_size) buttonStyle.fontSize = design.button_font_size;
                                        if (design.button_font_weight) buttonStyle.fontWeight = design.button_font_weight;
                                        if (design.button_width) buttonStyle.width = design.button_width;
                                        if (design.button_shadow) buttonStyle.boxShadow = design.button_shadow;
                                        
                                        // Add border if border color is specified
                                        if (design.button_border_color) {
                                            buttonStyle.border = `1px solid ${design.button_border_color}`;
                                        }
                                    }
                                    
                                    return (
                                        <div
                                            key={item.id || index}
                                            className={`mb-6 cursor-pointer transition-all duration-200 relative ${isSelected
                                                ? 'border border-primary p-2'
                                                : 'hover:bg-white/10 p-2'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContentClick(item.id);
                                            }}
                                        >
                                            {isSelected && (
                                                <>
                                                    {/* Top-left corner square */}
                                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Top-right corner square */}
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-left corner square */}
                                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-right corner square */}
                                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>
                                                </>
                                            )}
                                            <button 
                                                className='px-4 py-2 rounded-md transition-all'
                                                style={buttonStyle}
                                            >
                                                {item.button_design?.button_text || 'Button'}
                                            </button>
                                        </div>
                                    )
                                }
                                return null;
                            })
                        }
                        <div className="w-full flex items-center justify-center">
                            {formSettings.navigation.navigationLayout === 'floating' && currentSlide.type != 'welcome' && <NavigationMenu />}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    className="flex-1 flex items-center justify-center"
                    onClick={handleSlideBackgroundClick}
                >
                    <div className="w-full max-w-4xl text-center flex flex-col items-center justify-center">
                        {/* Render welcome slide content */}
                        {
                            currentSlide.content.map((item, index) => {
                                if (item.type === 'media') {
                                    const isSelected = selectedSlideContent === item.id;
                                    return (
                                        <div
                                            key={item.id || index}
                                            className={`mb-2 cursor-pointer transition-all duration-200 relative ${isSelected
                                                ? 'border border-primary p-2'
                                                : 'hover:bg-white/10 p-2'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContentClick(item.id);
                                            }}
                                        >
                                            {isSelected && (
                                                <>
                                                    {/* Top-left corner square */}
                                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Top-right corner square */}
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-left corner square */}
                                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-right corner square */}
                                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>
                                                </>
                                            )}
                                            {item.media_design?.mediaType === 'video' ? (
                                                <video
                                                    src={item.media_design?.media}
                                                    className="w-80 h-55 rounded-lg shadow-lg object-cover"
                                                    controls
                                                    preload="metadata"
                                                    style={{    
                                                        objectPosition: item.media_design.mediaPosition || 'center',
                                                        opacity: item.media_design.mediaOverlayOpacity || 1
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={item.media_design?.media}
                                                    alt={item.media_design?.mediaAlt || 'Media content'}
                                                    className="w-80 h-55 rounded-lg shadow-lg object-cover"
                                                    style={{
                                                        objectPosition: item.media_design?.mediaPosition || 'center',
                                                        opacity: item.media_design?.mediaOverlayOpacity || 1
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )
                                }
                                if (item.type === 'text') {
                                    const isSelected = selectedSlideContent === item.id;

                                    // Apply text design styles
                                    const textStyle: React.CSSProperties = {};
                                    if (item.text_design) {
                                        const design = item.text_design;
                                        if (design.font_size) textStyle.fontSize = design.font_size;
                                        if (design.font_color) textStyle.color = design.font_color;
                                        if (design.font_alignment) textStyle.textAlign = design.font_alignment as 'left' | 'center' | 'right';
                                        if (design.font_weight) textStyle.fontWeight = design.font_weight;
                                        if (design.font_style) textStyle.fontStyle = design.font_style;
                                        if (design.font_decoration) textStyle.textDecoration = design.font_decoration;
                                        if (design.font_spacing) textStyle.wordSpacing = `${design.font_spacing}px`;
                                        if (design.font_line_height) textStyle.lineHeight = design.font_line_height;
                                        if (design.font_letter_spacing) textStyle.letterSpacing = `${design.font_letter_spacing}px`;
                                        if (design.font_transform) textStyle.textTransform = design.font_transform as 'none' | 'uppercase' | 'lowercase' | 'capitalize';
                                        if (design.font_family) textStyle.fontFamily = design.font_family;
                                    }

                                    // Apply global font family from form settings
                                    const globalFontFamily = formSettings.general.fontFamily;
                                    if (globalFontFamily) {
                                        textStyle.fontFamily = globalFontFamily;
                                    }

                                    return (
                                        <div
                                            key={item.id || index}
                                            className={`cursor-pointer transition-all duration-200 relative ${isSelected
                                                ? 'border border-primary p-2'
                                                : 'hover:bg-white/10 p-2'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContentClick(item.id);
                                            }}
                                        >
                                            {isSelected && (
                                                <>
                                                    {/* Top-left corner square */}
                                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Top-right corner square */}
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-left corner square */}
                                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-right corner square */}
                                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>
                                                </>
                                            )}
                                            <div
                                                className="mb-1 max-w-3xl mx-auto"
                                                style={textStyle}
                                                dangerouslySetInnerHTML={{ __html: item.text_design?.text || 'Welcome to our form' }}
                                            >

                                            </div>
                                        </div>
                                    );
                                }
                                if (item.type === 'button') {
                                    const isSelected = selectedSlideContent === item.id;
                                    
                                    // Apply button design styles
                                    const buttonStyle: React.CSSProperties = {};
                                    if (item.button_design) {
                                        const design = item.button_design;
                                        if (design.button_color) buttonStyle.color = design.button_color;
                                        if (design.button_background_color) buttonStyle.backgroundColor = design.button_background_color;
                                        if (design.button_border_color) buttonStyle.borderColor = design.button_border_color;
                                        if (design.button_border_radius) buttonStyle.borderRadius = design.button_border_radius;
                                        if (design.button_font_size) buttonStyle.fontSize = design.button_font_size;
                                        if (design.button_font_weight) buttonStyle.fontWeight = design.button_font_weight;
                                        if (design.button_width) buttonStyle.width = design.button_width;
                                        if (design.button_shadow) buttonStyle.boxShadow = design.button_shadow;
                                        
                                        // Add border if border color is specified
                                        if (design.button_border_color) {
                                            buttonStyle.border = `1px solid ${design.button_border_color}`;
                                        }
                                    }
                                    
                                    return (
                                        <div
                                            key={item.id || index}
                                            className={`mb-2 cursor-pointer transition-all duration-200 relative ${isSelected
                                                ? 'border border-primary p-2'
                                                : 'hover:bg-white/10 p-2'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContentClick(item.id);
                                            }}
                                        >
                                            {isSelected && (
                                                <>
                                                    {/* Top-left corner square */}
                                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Top-right corner square */}
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-left corner square */}
                                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
                                                    {/* Bottom-right corner square */}
                                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>
                                                </>
                                            )}
                                            <button 
                                                className='px-4 py-2 rounded-md transition-all'
                                                style={buttonStyle}
                                            >
                                                {item.button_design?.button_text || 'Button'}
                                            </button>
                                        </div>
                                    )
                                }
                                return null;
                            })
                        }
                        <div className="w-full flex items-center justify-center">
                            {formSettings.navigation.navigationLayout === 'floating' && currentSlide.type != 'welcome' && <NavigationMenu />}
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <Fragment>

            <div className="min-h-[570px] w-full relative overflow-hidden flex flex-col">
                {/* Background Layer with Opacity */}
                <div
                    className="absolute inset-0"
                    style={getBackgroundStyle()}
                ></div>

                {/* Content Layer - Full Opacity */}
                <div className="relative z-10 flex-1 flex flex-col">
                    {/* Header Section */}
                    <Header slideId={currentSlide.id} />

                    {renderLayout()}

                    {/* Footer Section */}
                    <Footer slideId={currentSlide.id} />
                </div>
            </div>

        </Fragment>
    );
};
