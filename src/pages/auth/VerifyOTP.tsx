import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const purpose = location.state?.purpose;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call for OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock OTP validation - only "666666" is valid
      if (otpString === '666666') {
        if (purpose === 'password-reset') {
          navigate('/reset-password', { 
            state: { 
              email: email,
              otp: otpString
            } 
          });
        } else {
          // For other purposes like email verification
          navigate('/dashboard');
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setTimeLeft(30);
    setError('');
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Reset OTP fields
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <Fragment>
      <div className="min-h-screen flex">
        {/* Left Column - Image/Testimonial */}
        <div className="hidden lg:flex lg:w-1/3 relative bg-cover bg-center" style={{ backgroundImage: "url('./images/backgroundImages/authBackground.jpg')" }}>
          {/* Logo */}
          <div className="absolute top-8 left-8">
            <img src="./images/brandLogo/brandLogo.png" alt="" className='h-10 w-12' />
          </div>
        </div>

        {/* Right Column - Verify OTP Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className='text-center'>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Verify OTP
              </h1>
              <p className="text-gray-600">
                We've sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* OTP Input Fields */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter 6-digit code
                </label>
                <div className="flex justify-between space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder=""
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  {timeLeft > 0 ? (
                    <span className="text-gray-500">
                      Resend in {timeLeft}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>

              {/* Back to Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Back to login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
