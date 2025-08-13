import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { onboardingCompleted } = useAuth();

  useEffect(() => {
    if (onboardingCompleted === false) {
      navigate('/onboarding');
    }
  }, [onboardingCompleted]);

  const handleFormBuilderClick = () => {
    navigate('/dashboard/form-builder');
  };

  const handleAutomationBuilderClick = () => {
    navigate('/dashboard/automation-builder');
  };

  return (
    <Fragment>
      <div className='flex flex-col max-w-7xl mx-auto my-5'>
        {/* GREETINGS */}
        <div className='flex flex-col'>
          <p className='text-2xl font-bold'>Welcome back, <span className='text-primary'>Amit Kumar</span></p>
          <p className='text-sm text-gray-500'>Here's what's happening with your forms today</p>
        </div>
        
        {/* Quick Actions */}
        <div className='mt-8 max-w-4xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Create Survey Form Card */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer'>
              <div className='flex items-start space-x-4'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Create a new survey form</h3>
                  <p className='text-sm text-gray-600 mb-4'>Build custom forms with our responsive form builder</p>
                  <button 
                    onClick={handleFormBuilderClick}
                    className='w-full border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary-600 hover:text-white transition-colors cursor-pointer'
                  >
                    Create Form
                  </button>
                </div>
              </div>
            </div>

            {/* Create Automation Card */}
            <div className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer'>
              <div className='flex items-start space-x-4'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>Create a new Automation</h3>
                  <p className='text-sm text-gray-600 mb-4'>Set up automated workflows to streamline your processes</p>
                  <button 
                    onClick={handleAutomationBuilderClick}
                    className='w-full border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary-600 hover:text-white transition-colors cursor-pointer'
                  >
                    Create Automation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}; 