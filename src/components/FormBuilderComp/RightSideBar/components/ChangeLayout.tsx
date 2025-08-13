import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSlide } from '../../../../store/slices/formBuilderSlice';
import type { RootState } from '../../../../store/store';

export const ChangeLayout: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('full-width');
  const [localLayout, setLocalLayout] = useState<string>('');
  const [localVariant, setLocalVariant] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  const dispatch = useDispatch();
  const selectedSlideId = useSelector((state: RootState) => state.formBuilder.selectedSlide);
  const selectedSlide = useSelector((state: RootState) => 
    state.formBuilder.formData.find(slide => slide.id === selectedSlideId)
  );

  const layoutTabs = [
    { id: 'full-width', label: 'Full Width' },
    // { id: 'divided-lr', label: 'Divided L & R' },
    // { id: 'boxed-full', label: 'Boxed Fill Width' },
    // { id: 'boxed-lr', label: 'Boxed L & R' },
    // { id: 'boxed-ud', label: 'Boxed Up and Down' }
  ];

  const layoutVariants = {
    'full-width': [
      { id: 'fw-1', name: 'Right Aligned', image: '/images/layouts/fw/fw-3.png' },
      { id: 'fw-2', name: 'Split Content', image: '/images/layouts/fw/fw-4.png' }
    ],
    'divided-lr': [
      { id: 'dlr-1', name: '70/30 Split', image: '/images/layouts/dlr/dlr-3.png' },
      { id: 'dlr-2', name: 'Custom Split', image: '/images/layouts/dlr/dlr-4.png' }
    ],
    'boxed-full': [
      { id: 'bf-1', name: 'Padded Box', image: '/images/layouts/bf/bf-3.png' },
      { id: 'bf-2', name: 'Bordered Box', image: '/images/layouts/bf/bf-4.png' }
    ],
    'boxed-lr': [
      { id: 'bdlr-1', name: 'Stacked Right', image: '/images/layouts/bdlr/bdlr-3.png' },
      { id: 'bdlr-2', name: 'Grid Layout', image: '/images/layouts/bdlr/bdlr-4.png' }
    ],
    'boxed-ud': [
      { id: 'bdud-1', name: 'Stacked Bottom', image: '/images/layouts/bdud/bdud-3.png' },
      { id: 'bdud-2', name: 'Mixed Layout', image: '/images/layouts/bdud/bdud-4.png' }
    ]
  };

  const currentVariants = layoutVariants[selectedTab as keyof typeof layoutVariants] || [];

  // Initialize local state when selected slide changes
  useEffect(() => {
    if (selectedSlide) {
      setSelectedTab(selectedSlide.layout);
      setLocalLayout(selectedSlide.layout);
      setLocalVariant(selectedSlide.variant);
      setHasChanges(false);
    }
  }, [selectedSlide]);

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    // Reset local variant when changing tabs
    setLocalVariant('');
    setHasChanges(true);
  };

  const handleLayoutSelect = (layoutType: string, variantId: string) => {
    setLocalLayout(layoutType);
    setLocalVariant(variantId);
    setHasChanges(true);
  };

  const handleApplyChanges = () => {
    if (selectedSlideId && localLayout && localVariant) {
      dispatch(updateSlide({
        id: selectedSlideId,
        data: {
          layout: localLayout as 'full-width' | 'divided-lr' | 'boxed-full' | 'boxed-lr' | 'boxed-ud',
          variant: localVariant
        }
      }));
      setHasChanges(false);
    }
  };

  const isVariantSelected = (variantId: string) => {
    return localLayout === selectedTab && localVariant === variantId;
  };

  return (
    <Fragment>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Change Layout</h3>
          <p className="text-xs text-gray-500 mt-1">Choose a layout for your slide</p>
        </div>

        {/* Tabs */}
        <div className="px-4 py-3">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-6 min-w-max">
              {layoutTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`text-xs font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${selectedTab === tab.id
                      ? 'text-primary border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout Cards */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            {currentVariants.map((variant) => (
              <div
                key={variant.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-md"
                onClick={() => handleLayoutSelect(selectedTab, variant.id)}
              >
                {/* Layout Preview */}
                <div className={`relative bg-white rounded-lg overflow-hidden transition-all duration-200 ${
                  isVariantSelected(variant.id)
                    ? 'border-2 border-primary shadow-md'
                    : 'border border-gray-200'
                }`}>
                  {/* Thumbnail */}
                  <div className="h-25 bg-gray-50 flex items-center justify-center text-xl">
                    <img src={variant.image} alt={variant.name} className="w-full h-full object-center" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Variants Message */}
          {currentVariants.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm text-gray-500">No layout variants available</p>
            </div>
          )}
        </div>

        {/* Apply Changes Button */}
        {hasChanges && (
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={handleApplyChanges}
              disabled={!localLayout || !localVariant}
              className="w-full bg-primary text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Apply Changes
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};
