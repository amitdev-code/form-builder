import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../store/store';

interface HeaderProps {
    slideId: string;
}

export const Header: React.FC<HeaderProps> = ({ slideId }) => {
    const formData = useSelector((state: RootState) => state.formBuilder.formData);
    const brandLogo = useSelector((state: RootState) => state.formBuilder.formSettings.general.brandLogo);
    const formSettings = useSelector((state: RootState) => state.formBuilder.formSettings);

    // Find the slide by ID
    const currentSlide = formData.find(slide => slide.id === slideId);

    if (!currentSlide) {
        return null;
    }

    return (
        <div className="px-6 py-2 flex-shrink-0">
            <div className="flex items-center justify-between">
                {/* Left Side - Brand Logo */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        {brandLogo != '' ? (
                            <img
                                src={brandLogo}
                                alt="Brand Logo"
                                className="h-8 w-auto"
                            />
                        ) : (
                            <img
                                src="/images/brandLogo/brandLogo.png"
                                alt="Brand Logo"
                                className="h-8 w-auto"
                                onError={(e) => {
                                    // Fallback to text if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'block';
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Right Side - Slide Info */}
                <div className="flex items-center space-x-3">
                    {
                        formSettings.general.headerNavMenu && (
                            <div className="flex items-center space-x-3">
                                {formSettings.general.headerNavMenuItems.map((item) => (
                                    <a href={item.url} className="text-sm text-gray-500">
                                        <div key={item.id} className="text-sm text-gray-500 cursor-pointer">
                                            {item.name}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}; 