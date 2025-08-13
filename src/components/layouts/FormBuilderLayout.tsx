import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../FormBuilderComp/Header/Header';
import { LeftSideBar } from '../FormBuilderComp/LeftSideBar/LeftSideBar';
import { RightSideBar } from '../FormBuilderComp/RightSideBar/RightSideBar';
import type { RootState } from '../../store/store';
import { setFormName } from '../../store/slices/formBuilderSlice';
import { CanvasStickeyHeader } from '../FormBuilderComp/CanvasStickeyHeader/CanvasStickeyHeader';
import { CanvasFloatingMenu } from '../FormBuilderComp/CanvasFloatingMenu/CanvasFloatingMenu';

interface FormBuilderLayoutProps {
  children?: React.ReactNode;
}

export const FormBuilderLayout: React.FC<FormBuilderLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const {
    isLeftSidebarOpen,
    isRightSidebarOpen,
    formName,
    isSaving,
  } = useSelector((state: RootState) => state.formBuilder);

  const handleFormNameChange = (name: string) => {
    dispatch(setFormName(name));
  };

  const handleCopyFormUrl = () => {
    // Implement copy form URL functionality
    console.log('Copy form URL');
  };

  const handlePreview = () => {
    // Implement preview functionality
    console.log('Preview form');
  };

  const handleGoLive = () => {
    // Implement go live functionality
    console.log('Go live');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        formName={formName}
        onFormNameChange={handleFormNameChange}
        isSaving={isSaving}
        onCopyFormUrl={handleCopyFormUrl}
        onPreview={handlePreview}
        onGoLive={handleGoLive}
      />

      {/* Main Content Area */}
      <main className="pt-4 flex h-screen">
        {/* Left Sidebar - Fixed */}
        <div
          className={`transition-all duration-300 ease-in-out fixed left-0 top-14 bottom-0 ${isLeftSidebarOpen
            ? 'w-[25%] opacity-100'
            : 'w-0 opacity-0'
            } overflow-hidden z-40`}
        >
          <LeftSideBar />
        </div>

        {/* Main Canvas Area - Scrollable */}
        <div
          className={`transition-all duration-300 ease-in-out ${isLeftSidebarOpen
            ? 'ml-[25%]'
            : 'ml-0'
            } ${isRightSidebarOpen
              ? 'mr-[23%]'
              : 'mr-0'
            } flex-1 overflow-y-auto relative`}
        >
          <CanvasStickeyHeader />

          {/* Canvas Content */}
          <div className="px-6 h-[calc(100vh-100px)]" style={{
            backgroundImage: `
              linear-gradient(rgba(229, 231, 235, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(229, 231, 235, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}>
            <div className='w-full h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide'>
              {children}
            </div>
          </div>

          <CanvasFloatingMenu />
        </div>

        {/* Right Sidebar - Fixed */}
        <div
          className={`transition-all duration-300 ease-in-out fixed right-0 top-14 bottom-0 ${isRightSidebarOpen
            ? 'w-[23%] opacity-100'
            : 'w-0 opacity-0'
            } overflow-hidden z-40`}
        >
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};
