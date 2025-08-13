import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../store/store';
import { Icon } from '@iconify/react';

export const NavigationMenu: React.FC = () => {
  const navigationLayout = useSelector((state: RootState) => state.formBuilder.formSettings.navigation.navigationLayout);

  // If no navigation layout is selected, don't render anything
  if (!navigationLayout) {
    return null;
  }

  const handlePrevious = () => {
    // TODO: Implement previous slide navigation
    console.log('Previous button clicked');
  };

  const handleNext = () => {
    // TODO: Implement next slide navigation
    console.log('Next button clicked');
  };

  // Bottom Navigation Layout
  if (navigationLayout === 'bottom') {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrevious}
          className="flex items-center px-4 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-1 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          Next
          <Icon icon="mdi:arrow-right" className="w-4 h-4 ml-2" />
        </button>
      </div>
    );
  }

  // Floating Navigation Layout
  if (navigationLayout === 'floating') {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrevious}
          className="flex items-center px-4 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-1 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          Next
          <Icon icon="mdi:arrow-right" className="w-4 h-4 ml-2" />
        </button>
      </div>
    );
  }

  return null;
}; 