import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSettings, FormSlide } from '../../types';


interface FormBuilderState {
  // Sidebar states
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;

  // Form data
  formName: string;
  formSettings: FormSettings;
  formData: FormSlide[];
  selectedSlide: string | null;
  selectedSlideContent: string | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;

  // Active sections
  activeSection: 'build' | 'configurations' | 'analytics' | 'performance-report';

  // Form builder specific states
  selectedRightSidebarElement: string;

  // UI states
  isPreviewMode: boolean;
  isLiveMode: boolean;
}

const initialState: FormBuilderState = {
  // Sidebar states - Right sidebar open by default
  isLeftSidebarOpen: false,
  isRightSidebarOpen: true,

  // Form data
  formName: 'Untitled Form',
  formSettings: {
    navigation: {
      navigationLayout: 'bottom',
    },
    general: {
      brandLogo: '',
      showWebezeBranding: true,
      fontFamily: 'Nunito',
      headerNavMenu: false,
      headerNavMenuItems: [],
      footerNavMenu: false,
      footerNavMenuItems: [],
      addedHeaderItems: [],
      addedFooterItems: [],
    }
  },
  formData: [
    {
      id: 'welcome',
      name: 'Welcome',
      description: 'Welcome Page',
      type: 'welcome',
      layout: 'full-width',
      variant: 'fw-1',
      visible: true,
      backgroundType: 'image',
      backgroundColor: '#ffffff',
      backgroundOpacity: 1,
      backgroundImage: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: [
        {
          id: 'media_1',
          type: 'media',
          media_design: {
            media: 'https://placehold.co/600x400',
            mediaType: 'image',
          },
        },
        {
          id: 'text_1',
          type: 'text',
          text_design: {
            type: 'header',
            text: 'Welcome to webeze form builder',
            font_size: '45px',
            font_color: '#000000',
            font_alignment: 'center',
            font_weight: 'bold',
            font_style: 'normal',
            font_decoration: 'none',
            font_spacing: '0',
            font_line_height: '1.5',
            font_letter_spacing: '0',
            font_tracking: '0',
            font_transform: 'none',
          },
        },
        {
          id: 'text_2',
          type: 'text',
          text_design: {
            type: 'subheader',
            text: 'Create Intracative Forms in minutes',
            font_size: '30px',
            font_color: '#3e3e3e',
            font_alignment: 'center',
            font_weight: 'bold',
            font_style: 'normal',
            font_decoration: 'none',
            font_spacing: '0',
            font_line_height: '1.5',
            font_letter_spacing: '0',
            font_tracking: '0',
            font_transform: 'none',
          },
        },
        {
          id: 'button_1',
          type: 'button',
          button_design: {
            button_text: 'Get Started',
            button_color: '#ffffff',
            button_background_color: '#7257fe',
            button_border_color: '#7257fe',
            button_border_radius: '6px',
            button_font_size: '14px',
            button_font_weight: '500',
            button_width: 'auto',
          },
        }
      ]
    },
    {
      id: 'question_1',
      name: 'Question_1',
      description: 'Question Page',
      type: 'question',
      layout: 'full-width',
      variant: 'fw-1',
      visible: true,
      backgroundType: 'image',
      backgroundColor: '#E2E2BF',
      backgroundOpacity: 1,
      backgroundImage: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: [
        {
          id: 'question_1',
          type: 'question',
          question_design: {
            question_type: 'text',
            question_text: 'What is your name?',
            question_required: true,
            question_description: 'Please enter your name',
            question_placeholder: 'Enter your name',
            question_error_message: 'Please enter your name',
            question_font_size: '24px',
            question_description_font_size: '18px',
            question_error_message_font_size: '12px',
            question_error_message_alignment: 'left',
          },
        }
      ]
    },
    {
      id: 'result',
      name: 'Result',
      description: 'Result Page',
      type: 'result',
      layout: 'full-width',
      variant: 'fw-1',
      visible: false,
      backgroundType: 'image',
      backgroundColor: '#E2E2BF',
      backgroundOpacity: 1,
      backgroundImage: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: [
        {
          id: 'text_2',
          type: 'text',
          text_design: {
            text: 'Thank you for your response',
          },
        }
      ]
    },
    {
      id: 'thankyou',
      name: 'Thankyou',
      description: 'Thankyou Page',
      type: 'thankyou',
      layout: 'full-width',
      variant: 'fw-2',
      visible: true,
      backgroundType: 'image',
      backgroundColor: '#E2E2BF',
      backgroundOpacity: 1,
      backgroundImage: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: [
        {
          id: 'media_1',
          type: 'media',
          media_design: {
            media: 'https://placehold.co/600x400',
            mediaType: 'image',
          },
        },
        {
          id: 'text_1',
          type: 'text',
          text_design: {
            type: 'header',
            text: 'Thank you for your response',
            font_size: '45px',
            font_color: '#000000',
            font_alignment: 'center',
            font_weight: 'bold',
            font_style: 'normal',
            font_decoration: 'none',
            font_spacing: '0',
            font_line_height: '1.5',
            font_letter_spacing: '0',
            font_tracking: '0',
            font_transform: 'none',
          },
        },
      ]
    }
  ],
  selectedSlide: 'welcome',
  selectedSlideContent: null,
  isSaving: false,
  hasUnsavedChanges: false,

  // Active sections
  activeSection: 'build',

  // Form builder specific states
  selectedRightSidebarElement: 'add_slide',

  // UI states
  isPreviewMode: false,
  isLiveMode: false,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    // Sidebar management
    toggleLeftSidebar: (state) => {
      state.isLeftSidebarOpen = !state.isLeftSidebarOpen;
      // Close right sidebar when left opens
      if (state.isLeftSidebarOpen) {
        state.isRightSidebarOpen = false;
      }
    },
    toggleRightSidebar: (state) => {
      state.isRightSidebarOpen = !state.isRightSidebarOpen;
      // Close left sidebar when right opens
      if (state.isRightSidebarOpen) {
        state.isLeftSidebarOpen = false;
      }
    },
    closeLeftSidebar: (state) => {
      state.isLeftSidebarOpen = false;
    },
    closeRightSidebar: (state) => {
      state.isRightSidebarOpen = false;
    },
    openLeftSidebar: (state) => {
      state.isLeftSidebarOpen = true;
      state.isRightSidebarOpen = false;
    },
    openRightSidebar: (state) => {
      state.isRightSidebarOpen = true;
      state.isLeftSidebarOpen = false;
    },

    // Form data management
    setFormName: (state, action: PayloadAction<string>) => {
      state.formName = action.payload;
      state.hasUnsavedChanges = true;
    },
    setFormData: (state, action: PayloadAction<FormSlide[]>) => {
      state.formData = action.payload;
      state.hasUnsavedChanges = true;
    },

    // Form settings management
    updateFormSettings: (state, action: PayloadAction<Partial<FormSettings>>) => {
      state.formSettings = { ...state.formSettings, ...action.payload };
      state.hasUnsavedChanges = true;
    },
    setNavigationLayout: (state, action: PayloadAction<'bottom' | 'floating'>) => {
      state.formSettings.navigation.navigationLayout = action.payload;
      state.hasUnsavedChanges = true;
    },
    setBrandLogo: (state, action: PayloadAction<string>) => {
      state.formSettings.general.brandLogo = action.payload;
      state.hasUnsavedChanges = true;
    },
    setShowWebezeBranding: (state, action: PayloadAction<boolean>) => {
      state.formSettings.general.showWebezeBranding = action.payload;
      state.hasUnsavedChanges = true;
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.formSettings.general.fontFamily = action.payload;
      state.hasUnsavedChanges = true;
    },
    setHeaderNavMenu: (state, action: PayloadAction<boolean>) => {
      state.formSettings.general.headerNavMenu = action.payload;
      state.hasUnsavedChanges = true;
    },
    setFooterNavMenu: (state, action: PayloadAction<boolean>) => {
      state.formSettings.general.footerNavMenu = action.payload;
      state.hasUnsavedChanges = true;
    },
    addHeaderNavItem: (state, action: PayloadAction<{ id: string; name: string; url: string }>) => {
      state.formSettings.general.headerNavMenuItems.push(action.payload);
      state.hasUnsavedChanges = true;
    },
    addFooterNavItem: (state, action: PayloadAction<{ id: string; name: string; url: string }>) => {
      state.formSettings.general.footerNavMenuItems.push(action.payload);
      state.hasUnsavedChanges = true;
    },
    removeHeaderNavItem: (state, action: PayloadAction<string>) => {
      state.formSettings.general.headerNavMenuItems = state.formSettings.general.headerNavMenuItems.filter(
        item => item.id !== action.payload
      );
      state.hasUnsavedChanges = true;
    },
    removeFooterNavItem: (state, action: PayloadAction<string>) => {
      state.formSettings.general.footerNavMenuItems = state.formSettings.general.footerNavMenuItems.filter(
        item => item.id !== action.payload
      );
      state.hasUnsavedChanges = true;
    },
    updateHeaderNavItem: (state, action: PayloadAction<{ id: string; name?: string; url?: string }>) => {
      const { id, name, url } = action.payload;
      const itemIndex = state.formSettings.general.headerNavMenuItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        if (name !== undefined) state.formSettings.general.headerNavMenuItems[itemIndex].name = name;
        if (url !== undefined) state.formSettings.general.headerNavMenuItems[itemIndex].url = url;
        state.hasUnsavedChanges = true;
      }
    },
    updateFooterNavItem: (state, action: PayloadAction<{ id: string; name?: string; url?: string }>) => {
      const { id, name, url } = action.payload;
      const itemIndex = state.formSettings.general.footerNavMenuItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        if (name !== undefined) state.formSettings.general.footerNavMenuItems[itemIndex].name = name;
        if (url !== undefined) state.formSettings.general.footerNavMenuItems[itemIndex].url = url;
        state.hasUnsavedChanges = true;
      }
    },
    setAddedHeaderItems: (state, action: PayloadAction<{ id: string; name: string; url: string }[]>) => {
      state.formSettings.general.addedHeaderItems = action.payload;
      state.hasUnsavedChanges = true;
    },
    setAddedFooterItems: (state, action: PayloadAction<{ id: string; name: string; url: string }[]>) => {
      state.formSettings.general.addedFooterItems = action.payload;
      state.hasUnsavedChanges = true;
    },
    removeAddedHeaderItem: (state, action: PayloadAction<string>) => {
      state.formSettings.general.addedHeaderItems = state.formSettings.general.addedHeaderItems.filter(
        item => item.id !== action.payload
      );
      state.hasUnsavedChanges = true;
    },
    removeAddedFooterItem: (state, action: PayloadAction<string>) => {
      state.formSettings.general.addedFooterItems = state.formSettings.general.addedFooterItems.filter(
        item => item.id !== action.payload
      );
      state.hasUnsavedChanges = true;
    },
    updateHeaderNavItems: (state, action: PayloadAction<{ id: string; name: string; url: string }[]>) => {
      state.formSettings.general.headerNavMenuItems = action.payload;
      state.hasUnsavedChanges = true;
    },
    updateFooterNavItems: (state, action: PayloadAction<{ id: string; name: string; url: string }[]>) => {
      state.formSettings.general.footerNavMenuItems = action.payload;
      state.hasUnsavedChanges = true;
    },

    // Slide management
    addSlide: (state, action: PayloadAction<{ slide: FormSlide; insertAfterId?: string }>) => {
      const { slide, insertAfterId } = action.payload;

      if (insertAfterId) {
        // Insert after specific slide (for duplication)
        const insertIndex = state.formData.findIndex(s => s.id === insertAfterId);
        if (insertIndex !== -1) {
          state.formData.splice(insertIndex + 1, 0, slide);
        } else {
          state.formData.push(slide);
        }
      } else {
        // Insert after last question slide (for new questions)
        let lastQuestionIndex = -1;
        for (let i = state.formData.length - 1; i >= 0; i--) {
          if (state.formData[i].type === 'question') {
            lastQuestionIndex = i;
            break;
          }
        }

        if (lastQuestionIndex !== -1) {
          state.formData.splice(lastQuestionIndex + 1, 0, slide);
        } else {
          state.formData.push(slide);
        }
      }

      state.hasUnsavedChanges = true;
    },
    updateSlide: (state, action: PayloadAction<{ id: string; data: Partial<FormSlide> }>) => {
      const index = state.formData.findIndex(slide => slide.id === action.payload.id);
      if (index !== -1) {
        state.formData[index] = { ...state.formData[index], ...action.payload.data };
        state.hasUnsavedChanges = true;
      }
    },
    updateSlideOrder: (state, action: PayloadAction<FormSlide[]>) => {
      state.formData = action.payload;
      state.hasUnsavedChanges = true;
    },
    deleteSlide: (state, action: PayloadAction<string>) => {
      state.formData = state.formData.filter(slide => slide.id !== action.payload);
      state.hasUnsavedChanges = true;
    },
    toggleSlideVisibility: (state, action: PayloadAction<string>) => {
      const slide = state.formData.find(slide => slide.id === action.payload);
      if (slide) {
        slide.visible = !slide.visible;
        state.hasUnsavedChanges = true;
      }
    },
    setSelectedSlide: (state, action: PayloadAction<string | null>) => {
      state.selectedSlide = action.payload;
    },
    setSelectedSlideContent: (state, action: PayloadAction<string | null>) => {
      state.selectedSlideContent = action.payload;
    },

    // Selection management
    setSelectedRightSidebarElement: (state, action: PayloadAction<string>) => {
      state.selectedRightSidebarElement = action.payload;
    },

    // Save states
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },

    // Active section management
    setActiveSection: (state, action: PayloadAction<'build' | 'configurations' | 'analytics' | 'performance-report'>) => {
      state.activeSection = action.payload;
    },
    // UI states
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload;
    },
    setLiveMode: (state, action: PayloadAction<boolean>) => {
      state.isLiveMode = action.payload;
    },

    // Reset form builder
    resetFormBuilder: (state) => {
      return { ...initialState };
    },

    // Text content management
    updateTextContent: (state, action: PayloadAction<{ slideId: string; contentId: string; text: string }>) => {
      const { slideId, contentId, text } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          state.formData[slideIndex].content[contentIndex].text_design!.text = text;
          state.hasUnsavedChanges = true;
        }
      }
    },

    updateTextDesign: (state, action: PayloadAction<{
      slideId: string;
      contentId: string;
      designProperty: string;
      value: string | number
    }>) => {
      const { slideId, contentId, designProperty, value } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          const content = state.formData[slideIndex].content[contentIndex];
          if (content.type === 'text' && content.text_design) {
            (content.text_design as any)[designProperty] = value;
            state.hasUnsavedChanges = true;
          }
        }
      }
    },

    // Media content management
    updateMediaContent: (state, action: PayloadAction<{ slideId: string; contentId: string; media: string; mediaType: 'image' | 'video' }>) => {
      const { slideId, contentId, media, mediaType } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          const content = state.formData[slideIndex].content[contentIndex];
          if (content.type === 'media' && content.media_design) {
            content.media_design.media = media;
            content.media_design.mediaType = mediaType;
            state.hasUnsavedChanges = true;
          }
        }
      }
    },

    updateMediaDesign: (state, action: PayloadAction<{
      slideId: string;
      contentId: string;
      designProperty: string;
      value: string | number | boolean
    }>) => {
      const { slideId, contentId, designProperty, value } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          const content = state.formData[slideIndex].content[contentIndex];
          if (content.type === 'media' && content.media_design) {
            (content.media_design as any)[designProperty] = value;
            state.hasUnsavedChanges = true;
          }
        }
      }
    },

    // Button content management
    updateButtonContent: (state, action: PayloadAction<{ slideId: string; contentId: string; buttonText: string }>) => {
      const { slideId, contentId, buttonText } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          const content = state.formData[slideIndex].content[contentIndex];
          if (content.type === 'button' && content.button_design) {
            content.button_design.button_text = buttonText;
            state.hasUnsavedChanges = true;
          }
        }
      }
    },

    updateButtonDesign: (state, action: PayloadAction<{
      slideId: string;
      contentId: string;
      designProperty: string;
      value: string | number
    }>) => {
      const { slideId, contentId, designProperty, value } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          const content = state.formData[slideIndex].content[contentIndex];
          if (content.type === 'button' && content.button_design) {
            (content.button_design as any)[designProperty] = value;
            state.hasUnsavedChanges = true;
          }
        }
      }
    },

    // Question content management
    updateQuestionContent: (state, action: PayloadAction<{ slideId: string; contentId: string; questionText: string }>) => {
      const { slideId, contentId, questionText } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          const content = state.formData[slideIndex].content[contentIndex];
          if (content.type === 'question' && content.question_design) {
            content.question_design.question_text = questionText;
            state.hasUnsavedChanges = true;
          }
        }
      }
    },

    updateQuestionDesign: (state, action: PayloadAction<{
      slideId: string;
      contentId: string;
      designProperty: string;
      value: string | number | boolean | string[]
    }>) => {
      const { slideId, contentId, designProperty, value } = action.payload;
      const slideIndex = state.formData.findIndex(slide => slide.id === slideId);
      if (slideIndex !== -1) {
        const contentIndex = state.formData[slideIndex].content.findIndex(content => content.id === contentId);
        if (contentIndex !== -1) {
          const content = state.formData[slideIndex].content[contentIndex];
          if (content.type === 'question' && content.question_design) {
            (content.question_design as any)[designProperty] = value;
            state.hasUnsavedChanges = true;
          }
        }
      }
    },
  },
});

export const {
  toggleLeftSidebar,
  toggleRightSidebar,
  closeLeftSidebar,
  closeRightSidebar,
  openLeftSidebar,
  openRightSidebar,
  setFormName,
  setFormData,
  updateFormSettings,
  setNavigationLayout,
  setBrandLogo,
  setShowWebezeBranding,
  setFontFamily,
  setHeaderNavMenu,
  setFooterNavMenu,
  addHeaderNavItem,
  addFooterNavItem,
  removeHeaderNavItem,
  removeFooterNavItem,
  updateHeaderNavItem,
  updateFooterNavItem,
  setAddedHeaderItems,
  setAddedFooterItems,
  removeAddedHeaderItem,
  removeAddedFooterItem,
  updateHeaderNavItems,
  updateFooterNavItems,
  addSlide,
  updateSlide,
  updateSlideOrder,
  deleteSlide,
  toggleSlideVisibility,
  setSelectedSlide,
  setSelectedSlideContent,
  setSelectedRightSidebarElement,
  setSaving,
  setHasUnsavedChanges,
  setActiveSection,
  setPreviewMode,
  setLiveMode,
  resetFormBuilder,
  updateTextContent,
  updateTextDesign,
  updateMediaContent,
  updateMediaDesign,
  updateButtonContent,
  updateButtonDesign,
  updateQuestionContent,
  updateQuestionDesign,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer; 