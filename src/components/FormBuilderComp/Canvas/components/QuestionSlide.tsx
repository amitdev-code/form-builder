import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { setSelectedSlideContent, openLeftSidebar, closeRightSidebar, openRightSidebar, closeLeftSidebar, setActiveSection } from '../../../../store/slices/formBuilderSlice';
import { Header, Footer, NavigationMenu } from './common';
import { Q_TextInput } from './QuestionsUI/Q_TextInput/Q_TextInput';

export const QuestionSlide: React.FC = () => {
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

  // Check if the selected slide is actually a question type slide
  if (!currentSlide || currentSlide.type !== 'question') {
    return (
      <div className="min-h-[525px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No question slide selected</p>
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

  // Render question content based on type
  const renderQuestionContent = (item: any, index: number) => {
    const isSelected = selectedSlideContent === item.id;

    // Apply question design styles
    const questionStyle: React.CSSProperties = {};
    const globalFontFamily = formSettings.general.fontFamily;
    if (globalFontFamily) {
      questionStyle.fontFamily = globalFontFamily;
    }

    // Apply question styling properties
    if (item.question_design) {
      const design = item.question_design;
      if (design.question_font_size) questionStyle.fontSize = design.question_font_size;
      if (design.question_font_color) questionStyle.color = design.question_font_color;
      if (design.question_font_weight) questionStyle.fontWeight = design.question_font_weight;
      if (design.question_alignment) questionStyle.textAlign = design.question_alignment;
      if (design.question_margin) questionStyle.margin = design.question_margin;
      if (design.question_padding) questionStyle.padding = design.question_padding;
    }

    const questionContainer = (
      <div
        key={item.id || index}
        className={`cursor-pointer transition-all duration-200 relative w-full ${isSelected
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

        {/* Question Text */}
        <div
          className="mb-4 w-full"
          style={questionStyle}
          dangerouslySetInnerHTML={{ __html: item.question_design?.question_text || 'What is your question?' }}
        />

        {/* Render input based on question type */}
        {renderQuestionInput(item)}

        {/* Question Description */}
        {item.question_design?.question_description_enabled !== false && item.question_design?.question_description && (
          <div
            className="mb-4 w-full text-gray-600"
            style={{
              fontFamily: globalFontFamily,
              fontSize: item.question_design?.question_description_font_size || '18px',
              textAlign: item.question_design?.question_description_alignment || 'center'
            }}
          >
            {item.question_design.question_description}
          </div>
        )}
      </div>
    );

    return questionContainer;
  };

  // Render question input based on type
  const renderQuestionInput = (item: any) => {
    const questionType = item.question_design?.question_type || 'text';

    switch (questionType) {
      case 'text':
        return (
          <div className="w-full">
            <Q_TextInput
              label=""
              placeholder={item.question_design?.question_placeholder || 'Enter your answer'}
              type={item.question_design?.input_type || 'text'}
              variant={item.question_design?.input_variant || 'floating'}
              size={item.question_design?.input_size || 'md'}
              width={item.question_design?.input_width || '100%'}
              height={item.question_design?.input_height}
              borderRadius={item.question_design?.input_border_radius || '8px'}
              borderColor={item.question_design?.input_border_color || '#e2e8f0'}
              borderWidth={item.question_design?.input_border_width || '1px'}
              backgroundColor={item.question_design?.input_background_color || '#ffffff'}
              textColor={item.question_design?.input_text_color || '#1a202c'}
              placeholderColor={item.question_design?.input_placeholder_color || '#a0aec0'}
              focusColor={item.question_design?.input_focus_color || '#3182ce'}
              errorColor={item.question_design?.input_error_color || '#e53e3e'}
              fontSize={item.question_design?.input_font_size}
              fontWeight={item.question_design?.input_font_weight || '400'}
              fontFamily={item.question_design?.input_font_family}
              padding={item.question_design?.input_padding}
              margin={item.question_design?.input_margin}
              validation={item.question_design?.validation}
              customValidation={item.question_design?.custom_validation}
              validateOnChange={item.question_design?.validate_on_change !== false}
              validateOnBlur={item.question_design?.validate_on_blur !== false}
              showValidationMessage={item.question_design?.show_validation_message !== false}
              required={item.question_design?.question_required || false}
              errorMessage={item.question_design?.question_error_message}
              errorMessageAlignment={item.question_design?.question_error_message_alignment || 'left'}
              errorMessageFontSize={item.question_design?.question_error_message_font_size || '12px'}
              disabled={false}
              readonly={false}
            />
          </div>
        );

      case 'single_select':
        return (
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-600">Single select input will be implemented soon.</p>
          </div>
        );

      case 'multi_select':
        return (
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-600">Multi select input will be implemented soon.</p>
          </div>
        );

      case 'rating':
        return (
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-600">Rating input will be implemented soon.</p>
          </div>
        );

      case 'slider':
        return (
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-600">Slider input will be implemented soon.</p>
          </div>
        );

      default:
        return (
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-600">Unknown question type: {questionType}</p>
          </div>
        );
    }
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
          className="flex-1 flex items-center justify-center w-full"
          onClick={handleSlideBackgroundClick}
        >
          <div className="w-full max-w-3xl text-center flex flex-col items-center justify-center">
            {/* Render question slide content */}
            {
              currentSlide.content.map((item, index) => {
                if (item.type === 'question') {
                  return renderQuestionContent(item, index);
                }
                return null;
              })
            }
            <div className="w-full flex items-center justify-center">
              {formSettings.navigation.navigationLayout === 'floating' && currentSlide.type != 'question' && <NavigationMenu />}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div
          className="flex-1 flex items-center justify-center w-full"
          onClick={handleSlideBackgroundClick}
        >
          <div className="w-full max-w-3xl text-center flex flex-col items-center justify-center">
            {/* Render question slide content */}
            {
              currentSlide.content.map((item, index) => {
                if (item.type === 'media') {
                  const isSelected = selectedSlideContent === item.id;
                  return (
                    <div
                      key={item.id || index}
                      className={`mb-2 cursor-pointer transition-all duration-200 relative w-full ${isSelected
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
                          className="w-full h-auto rounded-lg shadow-lg object-cover"
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
                          className="w-full h-auto rounded-lg shadow-lg object-cover"
                          style={{
                            objectPosition: item.media_design?.mediaPosition || 'center',
                            opacity: item.media_design?.mediaOverlayOpacity || 1
                          }}
                        />
                      )}
                    </div>
                  )
                }
                if (item.type === 'question') {
                  return renderQuestionContent(item, index);
                }
                return null;
              })
            }
            <div className="w-full flex items-center justify-center">
              {formSettings.navigation.navigationLayout === 'floating' && currentSlide.type != 'question' && <NavigationMenu />}
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
