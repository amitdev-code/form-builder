import React, { Fragment, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { 
    addSlide, 
    deleteSlide, 
    toggleSlideVisibility, 
    setSelectedSlide,
    updateSlideOrder
} from '../../../../store/slices/formBuilderSlice';
import Tooltip from '../../../ui/general/tooltip/Tooltip';
import type { FormSlide } from '../../../../types';

export const AddSlides: React.FC = () => {
    const dispatch = useDispatch();
    const { formData, selectedSlide } = useSelector((state: RootState) => state.formBuilder);
    const [draggedSlide, setDraggedSlide] = useState<string | null>(null);
    const [dragOverSlide, setDragOverSlide] = useState<string | null>(null);

    const handleAddPage = () => {
        const questionCount = formData.filter(page => page.type === 'question').length;
        const newQuestion: FormSlide = {
            id: `question_${questionCount + 1}`,
            name: `Question_${questionCount + 1}`,
            description: 'Question Page',
            type: 'question',
            visible: true,
            backgroundType: 'color',
            backgroundColor: '#ffffff',
            backgroundImage: '',
            layout: 'full-width',
            variant: 'fw-1',
            content: [
              {
                id: 'question_1',
                type: 'question',
                question_type: 'single_choice',
                question_text: 'What is your name?',
                question_options: ['Option 1', 'Option 2', 'Option 3'],
                question_required: true,
                question_description: 'Please select an option',
                question_placeholder: 'Select an option',
                question_error_message: 'Please select an option',
              }
            ]
        };
        
        dispatch(addSlide({ slide: newQuestion }));
    };

    const handleDuplicateSlide = (pageId: string) => {
        const slideToDuplicate = formData.find(slide => slide.id === pageId);
        if (!slideToDuplicate) return;

        // Get the base name and copy number
        let baseName = slideToDuplicate.name;
        let copyNumber = 1;

        // Check if the slide name already contains COPY_
        if (baseName.includes('COPY_')) {
            // Split by _ and get the last part as number
            const parts = baseName.split('_');
            const lastPart = parts[parts.length - 1];
            const lastNumber = parseInt(lastPart);
            
            if (!isNaN(lastNumber)) {
                // Remove the last part (COPY_X) and get the base name
                parts.pop(); // Remove the number
                parts.pop(); // Remove 'COPY'
                baseName = parts.join('_');
                copyNumber = lastNumber + 1;
            }
        }

        const questionCount = formData.filter(page => page.type === 'question').length;
        
        // Check if description already contains "copy" (case insensitive)
        const descriptionAlreadyHasCopy = slideToDuplicate.description.toLowerCase().includes('copy');
        const newDescription = descriptionAlreadyHasCopy 
            ? slideToDuplicate.description 
            : `${slideToDuplicate.description} (Copy)`;
        
        const duplicatedSlide: FormSlide = {
            ...slideToDuplicate,
            id: `question_${questionCount + 1}`,
            name: `${baseName}_COPY_${copyNumber}`,
            description: newDescription,
            visible: true
        };

        dispatch(addSlide({ slide: duplicatedSlide, insertAfterId: pageId }));
    };

    const handleDeletePage = (pageId: string) => {
        dispatch(deleteSlide(pageId));
    };

    const handleToggleVisibility = (pageId: string) => {
        const currentSlide = formData.find(slide => slide.id === pageId);
        const isCurrentlySelected = selectedSlide === pageId;
        const isCurrentlyVisible = currentSlide?.visible;
        
        dispatch(toggleSlideVisibility(pageId));
        
        // If we're hiding the currently selected slide, select the next available slide
        if (isCurrentlySelected && isCurrentlyVisible) {
            const currentIndex = formData.findIndex(slide => slide.id === pageId);
            const visibleSlides = formData.filter(slide => slide.visible || slide.id !== pageId);
            
            // Find the next available slide
            let nextSlideId = null;
            
            // First try to find a slide after the current one
            for (let i = currentIndex + 1; i < formData.length; i++) {
                if (formData[i].visible) {
                    nextSlideId = formData[i].id;
                    break;
                }
            }
            
            // If no slide found after, try to find one before
            if (!nextSlideId) {
                for (let i = currentIndex - 1; i >= 0; i--) {
                    if (formData[i].visible) {
                        nextSlideId = formData[i].id;
                        break;
                    }
                }
            }
            
            // If still no slide found, select the first visible slide
            if (!nextSlideId && visibleSlides.length > 0) {
                nextSlideId = visibleSlides[0].id;
            }
            
            if (nextSlideId) {
                dispatch(setSelectedSlide(nextSlideId));
            }
        }
    };

    const handleSelectSlide = (pageId: string) => {
        dispatch(setSelectedSlide(pageId));
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, slideId: string) => {
        setDraggedSlide(slideId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, slideId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverSlide(slideId);
    };

    const handleDragLeave = () => {
        setDragOverSlide(null);
    };

    const handleDrop = (e: React.DragEvent, targetSlideId: string) => {
        e.preventDefault();
        if (draggedSlide && draggedSlide !== targetSlideId) {
            const draggedSlideData = formData.find(slide => slide.id === draggedSlide);
            const targetSlideData = formData.find(slide => slide.id === targetSlideId);
            
            if (draggedSlideData && targetSlideData && draggedSlideData.type === 'question' && targetSlideData.type === 'question') {
                // Only allow reordering of question slides
                const newOrder = [...formData];
                const draggedIndex = newOrder.findIndex(slide => slide.id === draggedSlide);
                const targetIndex = newOrder.findIndex(slide => slide.id === targetSlideId);
                
                if (draggedIndex !== -1 && targetIndex !== -1) {
                    const [draggedItem] = newOrder.splice(draggedIndex, 1);
                    newOrder.splice(targetIndex, 0, draggedItem);
                    dispatch(updateSlideOrder(newOrder));
                }
            }
        }
        setDraggedSlide(null);
        setDragOverSlide(null);
    };

    const renderPage = (page: FormSlide) => {
        const showSeparatorAfter = page.type === 'welcome';
        const showSeparatorBefore = page.type === 'result';
        const isFixedPage = page.type === 'welcome' || page.type === 'result' || page.type === 'thankyou';
        const isSelected = selectedSlide === page.id;
        const isDragging = draggedSlide === page.id;
        const isDragOver = dragOverSlide === page.id;
        const isQuestionSlide = page.type === 'question';

        return (
            <Fragment key={page.id}>
                {showSeparatorBefore && (
                    <div className="border-t border-gray-200 py-2"></div>
                )}
                <div 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isFixedPage
                        ? 'bg-gray-100 border-gray-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        } ${isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''} ${page.visible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                        } ${isDragging ? 'opacity-50 scale-95' : ''} ${isDragOver ? 'border-primary border-2' : ''} ${
                        isQuestionSlide ? 'cursor-move' : ''
                    }`}
                    onClick={() => {
                        if (page.visible) {
                            handleSelectSlide(page.id);
                        }
                    }}
                    draggable={isQuestionSlide}
                    onDragStart={(e) => isQuestionSlide && handleDragStart(e, page.id)}
                    onDragOver={(e) => isQuestionSlide && handleDragOver(e, page.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => isQuestionSlide && handleDrop(e, page.id)}
                >
                    <div className="flex items-center gap-3">
                        {isQuestionSlide && (
                            <div className="flex-shrink-0">
                                <Icon icon="material-symbols:drag-handle" className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                        <div>
                            <p className={`text-xs font-semibold uppercase ${isFixedPage ? 'text-gray-500' : 'text-gray-900'
                                } ${!page.visible ? 'line-through opacity-50' : ''}`}>{page.name}</p>
                            <p className={`text-xs ${isFixedPage ? 'text-gray-400' : 'text-gray-500'
                                } ${!page.visible ? 'opacity-50' : ''}`}>{page.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Tooltip content={page.visible ? 'Hide slide' : 'Show slide'} placement='left'>
                            <button
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleVisibility(page.id);
                                }}
                            >
                                <Icon 
                                    icon={page.visible ? "solar:eye-broken" : "mingcute:eye-close-fill"} 
                                    className={`w-3 h-3 ${page.visible ? 'text-gray-600' : 'text-gray-400'}`} 
                                />
                            </button>
                        </Tooltip>
                        {!isFixedPage && (
                            <div className='flex items-center gap-3'>
                                <Tooltip content='Duplicate slide' placement='left'>
                                    <button
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDuplicateSlide(page.id);
                                        }}
                                    >
                                        <Icon icon="si:copy-line" className="w-3 h-3 text-gray-600" />
                                    </button>
                                </Tooltip>
                                <Tooltip content='Delete slide' placement='left'>
                                    <button
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePage(page.id);
                                        }}
                                    >
                                        <Icon icon="weui:delete-on-outlined" className="w-3 h-3 text-red-700" />
                                    </button>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </div>
                {showSeparatorAfter && (
                    <div className="border-t border-gray-200 py-2"></div>
                )}
            </Fragment>
        );
    };

    return (
        <Fragment>
            <div className="flex flex-col h-full">
                {/* Add Form Page Button */}
                <div className="px-4 py-3">
                    <button
                        className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary py-2 px-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                        onClick={handleAddPage}
                    >
                        <Icon icon="material-symbols:add" className="w-4 h-4 transition-all duration-300" />
                        <span className="text-sm font-medium">Add Form Page</span>
                    </button>
                </div>

                {/* Pages List */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                    <div className="space-y-2">
                        {formData.map(renderPage)}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
