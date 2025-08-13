import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import type { RootState } from '../../../../store/store';
import { updateSlide } from '../../../../store/slices/formBuilderSlice';

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

// Custom Dropdown Component
const CustomDropdown: React.FC<{
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}> = ({ options, value, onChange, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-left flex items-center justify-between ${
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
        }`}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon && <Icon icon={selectedOption.icon} className="w-4 h-4" />}
          {selectedOption?.label || placeholder}
        </span>
        <Icon 
          icon="mdi:chevron-down" 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 flex items-center gap-2 ${
                value === option.value ? 'bg-primary text-white hover:bg-primary-600' : 'text-gray-700'
              }`}
            >
              {option.icon && <Icon icon={option.icon} className="w-4 h-4" />}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const BackgroundImage: React.FC = () => {
  const dispatch = useDispatch();
  const { formData, selectedSlide } = useSelector((state: RootState) => state.formBuilder);

  // Get the currently selected slide
  const currentSlide = formData.find(slide => slide.id === selectedSlide);

  const [activeTab, setActiveTab] = useState<'unsplash' | 'url' | 'upload' | 'settings'>('unsplash');
  const [selectedImage, setSelectedImage] = useState<string>(currentSlide?.backgroundImage || '');
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('nature');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Background settings state
  const [backgroundPosition, setBackgroundPosition] = useState<string>(currentSlide?.backgroundImagePosition || 'center');
  const [backgroundSize, setBackgroundSize] = useState<string>(currentSlide?.backgroundImageSize || 'cover');
  const [backgroundRepeat, setBackgroundRepeat] = useState<string>(currentSlide?.backgroundImageRepeat || 'no-repeat');
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>((currentSlide?.backgroundOpacity || 1) * 100);

  // Update local state when selected slide changes
  useEffect(() => {
    if (currentSlide) {
      setSelectedImage(currentSlide.backgroundImage || '');
      setBackgroundPosition(currentSlide.backgroundImagePosition || 'center');
      setBackgroundSize(currentSlide.backgroundImageSize || 'cover');
      setBackgroundRepeat(currentSlide.backgroundImageRepeat || 'no-repeat');
      setBackgroundOpacity((currentSlide.backgroundOpacity || 1) * 100);
      setHasChanges(false);
    }
  }, [currentSlide]);

  // Check for changes
  const checkForChanges = () => {
    if (!currentSlide) return false;
    
    return (
      selectedImage !== (currentSlide.backgroundImage || '') ||
      backgroundPosition !== (currentSlide.backgroundImagePosition || 'center') ||
      backgroundSize !== (currentSlide.backgroundImageSize || 'cover') ||
      backgroundRepeat !== (currentSlide.backgroundImageRepeat || 'no-repeat') ||
      backgroundOpacity !== ((currentSlide.backgroundOpacity || 1) * 100)
    );
  };

  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [selectedImage, backgroundPosition, backgroundSize, backgroundRepeat, backgroundOpacity, currentSlide]);

  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_PUBLIC_UNSPLASH_ACCESS_KEY;

  // Background position options
  const positionOptions: DropdownOption[] = [
    { value: 'center', label: 'Center', icon: 'mdi:center-focus-strong' },
    { value: 'top', label: 'Top', icon: 'mdi:arrow-up' },
    { value: 'bottom', label: 'Bottom', icon: 'mdi:arrow-down' },
    { value: 'left', label: 'Left', icon: 'mdi:arrow-left' },
    { value: 'right', label: 'Right', icon: 'mdi:arrow-right' },
    { value: 'top-left', label: 'Top Left', icon: 'mdi:arrow-up-left' },
    { value: 'top-right', label: 'Top Right', icon: 'mdi:arrow-up-right' },
    { value: 'bottom-left', label: 'Bottom Left', icon: 'mdi:arrow-down-left' },
    { value: 'bottom-right', label: 'Bottom Right', icon: 'mdi:arrow-down-right' },
  ];

  // Background size options
  const sizeOptions: DropdownOption[] = [
    { value: 'cover', label: 'Cover', icon: 'mdi:fit-to-page' },
    { value: 'contain', label: 'Contain', icon: 'mdi:fit-to-page-outline' },
    { value: 'auto', label: 'Auto', icon: 'mdi:resize' },
    { value: '100%', label: '100%', icon: 'mdi:resize-full' },
    { value: '50%', label: '50%', icon: 'mdi:resize-half' },
  ];

  // Background repeat options
  const repeatOptions: DropdownOption[] = [
    { value: 'no-repeat', label: 'No Repeat', icon: 'mdi:close' },
    { value: 'repeat', label: 'Repeat', icon: 'mdi:repeat' },
    { value: 'repeat-x', label: 'Repeat X', icon: 'mdi:repeat-horizontal' },
    { value: 'repeat-y', label: 'Repeat Y', icon: 'mdi:repeat-vertical' },
  ];

  // Fetch Unsplash images
  const fetchUnsplashImages = async (query: string = 'nature', pageNum: number = 1, append: boolean = false) => {
    if (!UNSPLASH_ACCESS_KEY) {
      console.error('Unsplash access key not found');
      return;
    }

    if (pageNum === 1) {
      setUnsplashLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=20&page=${pageNum}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      
      if (append) {
        setUnsplashImages(prev => [...prev, ...(data.results || [])]);
      } else {
        setUnsplashImages(data.results || []);
      }
      
      setHasMore((data.results || []).length === 20);
    } catch (error) {
      console.error('Error fetching Unsplash images:', error);
    } finally {
      setUnsplashLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load initial Unsplash images
  useEffect(() => {
    fetchUnsplashImages();
  }, []);

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoadingMore && hasMore && activeTab === 'unsplash') {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUnsplashImages(searchQuery, nextPage, true);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setSelectedImage(urlInput.trim());
      setUrlInput('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(1);
      setHasMore(true);
      fetchUnsplashImages(searchQuery, 1, false);
    }
  };

  const handleApplyBackground = () => {
    if (!currentSlide) return;

    dispatch(updateSlide({
      id: currentSlide.id,
      data: {
        backgroundImage: selectedImage,
        backgroundImagePosition: backgroundPosition,
        backgroundImageSize: backgroundSize,
        backgroundImageRepeat: backgroundRepeat,
        backgroundOpacity: backgroundOpacity / 100,
        backgroundType: selectedImage ? 'image' : 'color'
      }
    }));

    console.log('Applied background to slide:', currentSlide.id, {
      backgroundImage: selectedImage,
      backgroundImagePosition: backgroundPosition,
      backgroundImageSize: backgroundSize,
      backgroundImageRepeat: backgroundRepeat,
      backgroundOpacity: backgroundOpacity / 100
    });
  };

  // Show message if no slide is selected
  if (!currentSlide) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Background Image</h3>
          <p className="text-xs text-gray-500 mt-1">Choose a background image for your slide</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-sm">No slide selected</p>
            <p className="text-xs">Select a slide to customize its background</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('unsplash')}
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'unsplash'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unsplash
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'url'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              From URL
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Selected Image Preview */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">Selected Image</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm bg-gray-100 flex items-center justify-center"
                  style={selectedImage ? { backgroundImage: `url(${selectedImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!selectedImage && (
                    <Icon icon="mdi:close" className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {selectedImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600"
                  >
                    <Icon icon="mdi:close" className="w-2 h-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {activeTab === 'unsplash' && (
            <div className="px-4 py-3">
              {/* Search - Sticky */}
              <div className="sticky top-0 bg-white z-10 py-2">
                <form onSubmit={handleSearchSubmit} className="mb-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search images..."
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-primary text-white text-xs rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Images Grid */}
              {unsplashLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="columns-2 gap-2 space-y-2">
                    {unsplashImages.map((image) => (
                      <div
                        key={image.id}
                        onClick={() => handleImageSelect(image.urls.regular)}
                        className="group cursor-pointer break-inside-avoid mb-2"
                      >
                        <div className="relative overflow-hidden rounded-lg">
                          <img 
                            src={image.urls.small}
                            alt={image.alt_description}
                            className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Loading more indicator */}
                  {isLoadingMore && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-xs text-gray-500 ml-2">Loading more...</span>
                    </div>
                  )}
                  
                  {/* End of results indicator */}
                  {!hasMore && unsplashImages.length > 0 && (
                    <div className="text-center py-4">
                      <span className="text-xs text-gray-500">No more images to load</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="px-4 py-3">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Image URL</label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="w-full bg-primary text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Image
                </button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="px-4 py-3">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="px-4 py-3 space-y-4">
              {/* Background Position */}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">Position</label>
                <CustomDropdown
                  options={positionOptions}
                  value={backgroundPosition}
                  onChange={setBackgroundPosition}
                  placeholder="Select position"
                  disabled={!selectedImage}
                />
              </div>

              {/* Background Size */}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">Size</label>
                <CustomDropdown
                  options={sizeOptions}
                  value={backgroundSize}
                  onChange={setBackgroundSize}
                  placeholder="Select size"
                  disabled={!selectedImage}
                />
              </div>

              {/* Background Repeat */}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">Repeat</label>
                <CustomDropdown
                  options={repeatOptions}
                  value={backgroundRepeat}
                  onChange={setBackgroundRepeat}
                  placeholder="Select repeat"
                  disabled={!selectedImage}
                />
              </div>

              {/* Background Opacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700">Opacity</label>
                  <span className="text-xs text-gray-500">{backgroundOpacity}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={backgroundOpacity}
                    onChange={(e) => setBackgroundOpacity(parseInt(e.target.value))}
                    disabled={!selectedImage}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div 
                      className="h-2 rounded-lg"
                      style={{ 
                        width: `${backgroundOpacity}%`,
                        background: `linear-gradient(to right, #e5e7eb 0%, #3B82F6 100%)`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {selectedImage && (
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-700 block mb-2">Preview</label>
                  <div 
                    className="w-full h-20 rounded-lg border border-gray-300 overflow-hidden"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      backgroundPosition,
                      backgroundSize,
                      backgroundRepeat,
                      opacity: backgroundOpacity / 100
                    }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="px-4 py-3 mt-auto">
          <button
            onClick={handleApplyBackground}
            disabled={!hasChanges}
            className={`w-full py-2 px-3 rounded-lg transition-colors font-medium text-sm ${
              hasChanges 
                ? 'bg-primary text-white hover:bg-primary-600 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Apply Background
          </button>
        </div>
      </div>
    </Fragment>
  );
};
