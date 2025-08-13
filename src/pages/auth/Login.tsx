import { Fragment, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('alex.jordan@gmail.com');
    const [password, setPassword] = useState('••••••••');
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call for initial login (email/password verification)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show OTP modal for dual authentication
            setShowOtpModal(true);
            setTimeLeft(30);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOtpError('');
        setOtpLoading(true);

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setOtpError('Please enter the complete 6-digit code.');
            setOtpLoading(false);
            return;
        }

        try {
            // Simulate API call for OTP verification
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock OTP validation - only "666666" is valid
            if (otpString === '666666') {
                // Complete login process
                await login(email, password);
                navigate(from, { replace: true });
            } else {
                setOtpError('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setOtpError('Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setTimeLeft(30);
        setOtpError('');
        try {
            // Simulate resend API call
            await new Promise(resolve => setTimeout(resolve, 500));
            // Reset OTP fields
            setOtp(['', '', '', '', '', '']);
        } catch (error) {
            setOtpError('Failed to resend OTP. Please try again.');
        }
    };

    const closeModal = () => {
        setShowOtpModal(false);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
    };

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

                {/* Right Column - Login Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                        <div className='text-center'>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back to <span className='text-primary'>Webeze</span>
                            </h1>
                            <p className="text-gray-600">
                                Build your responsive forms effortlessly with our powerful <span className='text-primary'>form builder</span>.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className="absolute left-3 top-2 text-xs text-gray-500 font-medium"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-3 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label
                                    htmlFor="password"
                                    className="absolute left-3 top-2 text-xs text-gray-500 font-medium"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-3 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Remember Me Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out relative overflow-hidden ${rememberMe ? 'bg-primary' : 'bg-gray-300'}`}>
                                            {/* Liquid fill effect */}
                                            <div className={`absolute inset-0 transition-all duration-300 ease-in-out ${rememberMe ? 'bg-primary scale-x-100' : 'bg-primary scale-x-0'} origin-left`}></div>
                                            
                                            {/* Toggle circle with liquid effect */}
                                            <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out transform ${rememberMe ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5 relative z-10 shadow-sm`}>
                                                {/* Liquid drop effect on circle */}
                                                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${rememberMe ? 'bg-primary/20 scale-100' : 'bg-transparent scale-0'}`}></div>
                                            </div>
                                        </div>
                                        <span className="ml-3 text-sm text-gray-700">Remember me</span>
                                    </label>
                                </div>
                                                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Log in'}
                            </button>

                            {/* OR Separator */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            {/* Google Sign In Button */}
                            <button
                                type="button"
                                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
                            >
                                <div className="w-5 h-5">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </div>
                                <span>Continue with Google</span>
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="text-primary hover:text-primary/80 font-medium"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6 space-y-4 sm:space-y-6 relative mx-4">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center pt-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                Two-Factor Authentication
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                We've sent a 6-digit code to <span className="font-medium">{email}</span>
                            </p>
                        </div>

                        {otpError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                                {otpError}
                            </div>
                        )}

                        <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-6">
                            {/* OTP Input Fields */}
                            <div className="space-y-3 sm:space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Enter 6-digit code
                                </label>
                                <div className="flex justify-between space-x-1 sm:space-x-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                            placeholder=""
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Verify Button */}
                            <button
                                type="submit"
                                disabled={otpLoading}
                                className="w-full bg-primary text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
                            >
                                {otpLoading ? 'Verifying...' : 'Verify & Login'}
                            </button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-600">
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

                            {/* Cancel Button */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Fragment>
    );
}; 