import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/Input';
import { AuthButton } from '../components/Authbuttonx';
import { API_URL } from '../config';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userStates, authState } from '../atoms'; // Import atoms from atoms.js
import axios from 'axios'; // Import axios

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const setUser = useSetRecoilState(userStates);
  const setAuthStatus = useSetRecoilState(authState);
  const isAuthenticated = useRecoilValue(authState); // Get current auth status
  const navigate = useNavigate();

  // Effect to redirect when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // Make request using axios instead of fetch
      const response = await axios.post(`${API_URL}/api/user/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Handle success response
      const userData = response.data;
  
      // Set all the user data in Recoil state
      setUser({
        userId: userData.userId || userData.id,
        username: userData.username,
        lastame: userData.lastame,
        midlename: userData.midlename,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        group: userData.group,
        token: userData.token,
        isEmailVerified: userData.isEmailVerified,
        bloodGroup: userData.bloodGroup,
        address: userData.address,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        emergencyContact: userData.emergencyContact,
        nrc_card_id: userData.nrc_card_id
      });
  
      // Set auth status to true after successful login
      // The useEffect will handle navigation once this state changes
      setAuthStatus(true);
    } catch (err) {
      // Handle error
      if (err.response) {
        // The request was made and the server responded with an error status code
        setError(err.response.data.message || JSON.stringify(err.response.data));
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error: ' + err.message);
      }
      setAuthStatus(false); // In case of error, set auth status to false
    } finally {
      setLoading(false); // Reset loading state after request is complete
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <Input
                  icon={Mail}
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Input
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <AuthButton loading={loading}>
              Sign in
            </AuthButton>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  don&apos;t have account ? register now
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};