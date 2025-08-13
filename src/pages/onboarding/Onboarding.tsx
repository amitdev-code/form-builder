import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountType: '',
    industry: '',
    leadManagement: '',
    source: ''
  });

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save onboarding completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      completeOnboarding();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelection = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.accountType !== '';
      case 2: return formData.industry !== '';
      case 3: return formData.leadManagement !== '';
      case 4: return formData.source !== '';
      default: return false;
    }
  };

  const steps = [
    {
      id: 1,
      title: 'For what use are you creating an account?',
      description: 'Help us personalize your experience.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                formData.accountType === 'personal' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelection('accountType', 'personal')}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center justify-center mx-auto">
                  <span className="text-primary-600">
                    <Icon icon="icon-park-outline:personal-privacy" className='h-15 w-15' />
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">Personal Use</h3>
              </div>
              {formData.accountType === 'personal' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            
            <div 
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                formData.accountType === 'corporate' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelection('accountType', 'corporate')}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center justify-center mx-auto">
                  <span className="text-primary-600">
                    <Icon icon="cuida:building-outline" className='h-15 w-15' />
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">Corporate Use</h3>
              </div>
              {formData.accountType === 'corporate' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'What type of industry do you work with?',
      description: 'This helps us provide relevant templates and features.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'medical', label: 'Medical', icon: 'fa6-regular:hospital', color: 'bg-red-100 text-red-600' },
              { value: 'real-estate', label: 'Real Estate', icon: 'ic:twotone-real-estate-agent', color: 'bg-blue-100 text-blue-600' },
              { value: 'technology', label: 'Technology', icon: 'pixel:technology', color: 'bg-purple-100 text-purple-600' },
              { value: 'education', label: 'Education', icon: 'carbon:education', color: 'bg-green-100 text-green-600' },
              { value: 'finance', label: 'Finance', icon: 'healthicons:money-bag', color: 'bg-yellow-100 text-yellow-600' },
              { value: 'retail', label: 'Retail', icon: 'fluent:building-retail-toolbox-20-filled', color: 'bg-pink-100 text-pink-600' },
              { value: 'consulting', label: 'Consulting', icon: 'carbon:ibm-consulting-advantage-application', color: 'bg-indigo-100 text-indigo-600' },
              { value: 'other', label: 'Other', icon: 'streamline-block:other-ui-award', color: 'bg-gray-100 text-gray-600' }
            ].map((item) => (
              <div 
                key={item.value}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.industry === item.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelection('industry', item.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center`}>
                    <Icon icon={item.icon} className='h-10 w-10' />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                {formData.industry === item.value && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'How do you manage your leads?',
      description: 'We\'ll help you integrate with your existing workflow.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'google-sheets', label: 'Google Sheets', icon: 'hugeicons:google-sheet', color: 'bg-green-100 text-green-600' },
              { value: 'crm', label: 'CRM System', icon: 'cib:civicrm', color: 'bg-blue-100 text-blue-600' },
              { value: 'excel', label: 'Excel', icon: 'file-icons:microsoft-excel', color: 'bg-green-100 text-green-600' },
              { value: 'email', label: 'Email', icon: 'mdi:email-outline', color: 'bg-red-100 text-red-600' },
              { value: 'salesforce', label: 'Salesforce', icon: 'devicon-plain:salesforce', color: 'bg-gray-100 text-gray-600' },
              { value: 'hubspot', label: 'Hubspot', icon: 'cib:hubspot', color: 'bg-orange-100 text-orange-600' },
              { value: 'zoho', label: 'Zoho', icon: 'logos:zoho', color: 'bg-white-100 text-white-600' },
              { value: 'other', label: 'Other', icon: 'tabler:users', color: 'bg-purple-100 text-purple-600' }
            ].map((item) => (
              <div 
                key={item.value}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.leadManagement === item.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelection('leadManagement', item.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center`}>
                    <Icon icon={item.icon} className='h-10 w-10' />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                {formData.leadManagement === item.value && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'How did you learn about us?',
      description: 'This helps us improve our marketing efforts.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'linkedin', label: 'LinkedIn', icon: 'skill-icons:linkedin' },
              { value: 'google', label: 'Google Search', icon: 'flat-color-icons:google' },
              { value: 'facebook', label: 'Facebook', icon: 'logos:facebook' },
              { value: 'instagram', label: 'Instagram', icon: 'skill-icons:instagram' },
              { value: 'other', label: 'Other', icon: 'tabler:users' }
            ].map((item) => (
              <div 
                key={item.value}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.source === item.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelection('source', item.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                    <Icon icon={item.icon} className='h-10 w-10' />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                {formData.source === item.value && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Image/Testimonial */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-cover bg-center" style={{ backgroundImage: "url('./images/backgroundImages/authBackground.jpg')" }}>
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <img src="./images/brandLogo/brandLogo.png" alt="" className='h-10 w-12' />
        </div>
      </div>

      {/* Right Column - Onboarding Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    step <= currentStep
                      ? 'bg-primary' // Completed and current steps
                      : 'bg-gray-200' // Future steps
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStepData?.title}
            </h1>
            <p className="text-gray-600 mb-6">
              {currentStepData?.description}
            </p>
            {currentStepData?.content}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCompleteOnboarding}
                disabled={isLoading || !canProceed()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {isLoading ? 'Completing...' : 'Get Started'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
