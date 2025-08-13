import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { WelcomeSlide } from './components/WelcomeSlide';
import { QuestionSlide } from './components/QuestionSlide';
import { ResultSlide } from './components/ResultSlide';
import { ThankYouSlide } from './components/ThanyouSlide';

// Google Fonts mapping
const googleFontsMap: { [key: string]: string } = {
  'Inter': 'Inter',
  'Roboto': 'Roboto',
  'Open Sans': 'Open+Sans',
  'Lato': 'Lato',
  'Poppins': 'Poppins',
  'Montserrat': 'Montserrat',
  'Source Sans Pro': 'Source+Sans+Pro',
  'Nunito': 'Nunito',
  'Ubuntu': 'Ubuntu',
  'Raleway': 'Raleway',
  'PT Sans': 'PT+Sans',
  'Noto Sans': 'Noto+Sans',
  'Work Sans': 'Work+Sans',
  'Merriweather': 'Merriweather',
  'Playfair Display': 'Playfair+Display'
};

// Function to load Google Font
const loadGoogleFont = (fontFamily: string) => {
  const googleFontName = googleFontsMap[fontFamily];
  if (!googleFontName) return; // Not a Google Font

  // Check if font is already loaded
  const existingLink = document.querySelector(`link[href*="${googleFontName}"]`);
  if (existingLink) return;

  // Create and append link element
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@300;400;500;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export const FormBuilderCanvas: React.FC = () => {
  const { formData, selectedSlide, formSettings } = useSelector((state: RootState) => state.formBuilder);

  // Get the currently selected slide
  const currentSlide = formData.find(slide => slide.id === selectedSlide);
  
  // Get the selected font family
  const fontFamily = formSettings.general.fontFamily;

  // Load Google Font when font family changes
  useEffect(() => {
    if (fontFamily) {
      loadGoogleFont(fontFamily);
    }
  }, [fontFamily]);

  // If no slide is selected, show a placeholder
  if (!currentSlide) {
    return (
      <div className="min-h-[525px] max-w-6xl bg-white border border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Slide Selected</h3>
          <p className="text-sm text-gray-500">Select a slide from the sidebar to start building your form</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div 
        className="min-h-[525px] max-w-6xl bg-white border border-gray-300"
        style={{ fontFamily: fontFamily }}
      >
        {currentSlide.type === 'welcome' && <WelcomeSlide />}
        {currentSlide.type === 'question' && <QuestionSlide />}
        {currentSlide.type === 'result' && <ResultSlide />}
        {currentSlide.type === 'thankyou' && <ThankYouSlide />}
      </div>
    </Fragment>
  );
}; 