import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export const NotFound: React.FC = () => {
  return (
    <Fragment>
      <div className="min-h-screen flex">
        {/* Left Column - Image/Testimonial */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('./images/errorImages/404Error.webp')" }}>
          {/* Logo */}
          <div className="absolute top-8 left-8">
            <img src="./images/brandLogo/brandLogo.png" alt="" className='h-10 w-12' />
          </div>
        </div>

        {/* Right Column - 404 Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            {/* Error Content */}
            <div className='space-y-4'>
              <h1 className="text-6xl font-bold text-gray-900">
                4<span className='text-primary'>0</span>4
              </h1>
              <h2 className="text-2xl font-bold text-gray-900">
                Page Not Found
              </h2>
              <p className="text-gray-600">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Go Home Button */}
              <Link
                to="/dashboard"
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <Icon icon="material-symbols:home" className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>

              {/* OR Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Go Back Button */}
              <button
                onClick={() => window.history.back()}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need help?{' '}
                <Link
                  to="/contact"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}; 