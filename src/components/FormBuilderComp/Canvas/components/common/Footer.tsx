import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationMenu } from './NavigationMenu';
import type { RootState } from '../../../../../store/store';

interface FooterProps {
    slideId: string;
}

export const Footer: React.FC<FooterProps> = ({ slideId }) => {
    const navigationLayout = useSelector((state: RootState) => state.formBuilder.formSettings.navigation.navigationLayout);
    const formSettings = useSelector((state: RootState) => state.formBuilder.formSettings);
    const formData = useSelector((state: RootState) => state.formBuilder.formData);
    
    // Check if current slide is a welcome type
    const currentSlide = formData.find(slide => slide.id === slideId);
    const isWelcomeSlide = currentSlide?.type === 'welcome';
    const isThankYouSlide = currentSlide?.type === 'thankyou';

    return (
        <div className={`${navigationLayout === 'bottom' && !isWelcomeSlide && !isThankYouSlide ? 'bg-[#f5f5f5]' : ''}`}>
            {/* Navigation Menu - centered */}

            <div className="flex justify-between items-center py-2 px-6">
                {/* First div - Empty */}
                <div className="min-w-[33%]">
                    {
                        formSettings.general.footerNavMenu && (
                            <div className="flex items-center space-x-3">
                                {formSettings.general.footerNavMenuItems.map((item) => (
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

                {/* Second div - Navigation Buttons */}
                <div className="min-w-[33%] flex justify-center">
                    {
                        navigationLayout === 'bottom' && !isWelcomeSlide && !isThankYouSlide && <NavigationMenu />
                    }
                </div>

                {/* Third div - Build With Webeze */}
                <div className="min-w-[33%] flex justify-end">
                    {
                        formSettings.general.showWebezeBranding && (
                            <div className="bg-white px-2 py-0.5 rounded-sm shadow-xl cursor-pointer">
                                <span className="text-[10px] text-gray-600 font-bold uppercase flex items-center gap-1">
                                    Build With Webeze
                                </span>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    );
}; 