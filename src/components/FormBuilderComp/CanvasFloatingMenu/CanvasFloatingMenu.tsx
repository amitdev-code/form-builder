import { Icon } from '@iconify/react';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRightSidebarElement, closeLeftSidebar, openRightSidebar } from '../../../store/slices/formBuilderSlice';
import type { RootState } from '../../../store/store';

export const CanvasFloatingMenu: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedRightSidebarElement } = useSelector((state: RootState) => state.formBuilder);

    const handleButtonClick = (elementType: string) => {
        dispatch(setSelectedRightSidebarElement(elementType));
        dispatch(closeLeftSidebar());
        dispatch(openRightSidebar());
    };

    return (
        <Fragment>
            {/* Floating Bottom Menu - Centered in Canvas */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-1 flex items-center space-x-2">
                    {/* Add Slide */}
                    <button 
                        className={`group flex items-center gap-1 cursor-pointer transition-colors ${
                            selectedRightSidebarElement === 'add_slide' 
                                ? 'text-primary' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                        onClick={() => handleButtonClick('add_slide')}
                    >
                        <Icon 
                            icon="fluent:slide-text-title-add-20-regular" 
                            className={`w-3 h-3 ${
                                selectedRightSidebarElement === 'add_slide' 
                                    ? 'text-primary' 
                                    : 'text-gray-600 group-hover:text-primary'
                            }`} 
                        />
                        <p className={`text-xs ${
                            selectedRightSidebarElement === 'add_slide' 
                                ? 'text-primary' 
                                : 'group-hover:text-primary'
                        }`}>Slides</p>
                    </button>
                    {/* Slide Color */}
                    <button 
                        className={`group flex items-center gap-1 cursor-pointer transition-colors ${
                            selectedRightSidebarElement === 'slide_color' 
                                ? 'text-primary' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                        onClick={() => handleButtonClick('slide_color')}
                    >
                        <Icon 
                            icon="iconoir:fill-color" 
                            className={`w-3 h-3 ${
                                selectedRightSidebarElement === 'slide_color' 
                                    ? 'text-primary' 
                                    : 'text-gray-600 group-hover:text-primary'
                            }`} 
                        />
                        <p className={`text-xs ${
                            selectedRightSidebarElement === 'slide_color' 
                                ? 'text-primary' 
                                : 'group-hover:text-primary'
                        }`}>Slide Color</p>
                    </button>

                    {/* Background Image */}
                    <button 
                        className={`group flex items-center gap-1 cursor-pointer transition-colors ${
                            selectedRightSidebarElement === 'background_image' 
                                ? 'text-primary' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                        onClick={() => handleButtonClick('background_image')}
                    >
                        <Icon 
                            icon="mynaui:image" 
                            className={`w-3 h-3 ${
                                selectedRightSidebarElement === 'background_image' 
                                    ? 'text-primary' 
                                    : 'text-gray-600 group-hover:text-primary'
                            }`} 
                        />
                        <p className={`text-xs ${
                            selectedRightSidebarElement === 'background_image' 
                                ? 'text-primary' 
                                : 'group-hover:text-primary'
                        }`}>Background Image</p>
                    </button>

                    {/* Change Layout */}
                    <button 
                        className={`group flex items-center gap-1 cursor-pointer transition-colors ${
                            selectedRightSidebarElement === 'change_layout' 
                                ? 'text-primary' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                        onClick={() => handleButtonClick('change_layout')}
                    >
                        <Icon 
                            icon="mynaui:layout" 
                            className={`w-3 h-3 ${
                                selectedRightSidebarElement === 'change_layout' 
                                    ? 'text-primary' 
                                    : 'text-gray-600 group-hover:text-primary'
                            }`} 
                        />
                        <p className={`text-xs ${
                            selectedRightSidebarElement === 'change_layout' 
                                ? 'text-primary' 
                                : 'group-hover:text-primary'
                        }`}>Change Layout</p>
                    </button>

                    {/* Form Settings */}
                    <button 
                        className={`group flex items-center gap-1 cursor-pointer transition-colors ${
                            selectedRightSidebarElement === 'form_settings' 
                                ? 'text-primary' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                        onClick={() => handleButtonClick('form_settings')}
                    >
                        <Icon 
                            icon="mdi:cog" 
                            className={`w-3 h-3 ${
                                selectedRightSidebarElement === 'form_settings' 
                                    ? 'text-primary' 
                                    : 'text-gray-600 group-hover:text-primary'
                            }`} 
                        />
                        <p className={`text-xs ${
                            selectedRightSidebarElement === 'form_settings' 
                                ? 'text-primary' 
                                : 'group-hover:text-primary'
                        }`}>Form Settings</p>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Three Dot Menu */}
                    <button className="group p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <Icon icon="material-symbols:more-vert" className="w-3 h-3 text-gray-600 group-hover:text-primary" />
                    </button>
                </div>
            </div>
        </Fragment>
    );
};