import React, {Fragment} from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { TextEditorLeftSidebar } from './component/TextEditorLeftSidebar';
import { MediaEditorLeftSidebar } from './component/MediaEditorLeftSidebar';
import { ButtonEditorLeftSidebar } from './component/ButtonEditorLeftSidebar';
import { QuestionEditorLeftSidebar } from './component/QuestionEditorLeftSidebar';
  
export const LeftSideBar: React.FC = () => {
  const { selectedSlideContent, formData } = useSelector((state: RootState) => state.formBuilder);
  
  // Find the selected content item
  const selectedContent = formData
    .flatMap(slide => slide.content)
    .find(content => content.id === selectedSlideContent);

  const renderSidebar = () => {
    if (!selectedContent) {
      return null; // No content selected
    }

    switch (selectedContent.type) {
      case 'text':
        return <TextEditorLeftSidebar />;
      case 'media':
        return <MediaEditorLeftSidebar />;
      case 'button':
        return <ButtonEditorLeftSidebar />;
      case 'question':
        return <QuestionEditorLeftSidebar />;
      default:
        return null;
    }
  };

  return (
   <Fragment>
    {renderSidebar()}
   </Fragment>
  );
};
