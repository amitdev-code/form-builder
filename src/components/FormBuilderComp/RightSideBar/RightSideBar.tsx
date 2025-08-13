import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import type { RootState } from '../../../store/store';
import { AddSlides } from './components/AddSlides';
import { SlideColor } from './components/SlideColor';
import { ChangeLayout } from './components/ChangeLayout';
import { BackgroundImage } from './components/BackgroundImage';
import { FormSettings } from './components/FormSettings';

export const RightSideBar: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedRightSidebarElement } = useSelector((state: RootState) => state.formBuilder);

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col py-3">
        {selectedRightSidebarElement === 'add_slide' && <AddSlides />}
        {selectedRightSidebarElement === 'slide_color' && <SlideColor />}
        {selectedRightSidebarElement === 'background_image' && <BackgroundImage />}
        {selectedRightSidebarElement === 'change_layout' && <ChangeLayout />}
        {selectedRightSidebarElement === 'form_settings' && <FormSettings />}
    </div>
  );
};
