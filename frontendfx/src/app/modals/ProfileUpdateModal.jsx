import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userStates } from '../../atoms';
import { X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';

const ProfileUpdateModal = ({ isOpen, onClose }) => {
  const [userState, setUserState] = useRecoilState(userStates);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    bloodGroup: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Blood group options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Gender options
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  useEffect(() => {
    if (isOpen && userState) {
      // Format date for input field if it exists
      const formattedDate = userState.dateOfBirth 
        ? new Date(userState.dateOfBirth).toISOString().split('T')[0]
        : '';
        
      setFormData({
        username: userState.username || '',
        email: userState.email || '',
        phoneNumber: userState.phoneNumber || '',
        bloodGroup: userState.bloodGroup || '',
        address: userState.address || '',
        dateOfBirth: formattedDate,
        gender: userState.gender || '',
        emergencyContact: userState.emergencyContact || ''
      });
    }
  }, [isOpen, userState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Pass userId using userState.id as expected by the backend
      const payload = {
        ...formData,
        userId: userState.id
      };

      console.log('Sending payload:', payload); // Debug log

      const response = await axios({
        method: 'PATCH',
        url: `${API_URL}/api/user/profile/update`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userState.token}` // Token is preserved as required
        }
      });
      
      // Merge the updated user data from the backend into the state
      setUserState(prev => ({
        ...prev,
        ...response.data.user
      }));

      setSuccessMessage(response.data.message);
      
      // Close modal after a short delay to display success message
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Update Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {formData.email !== userState.email && (
              <p className="text-yellow-400 text-xs mt-1">
                You will need to verify your new email address after updating
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Blood Group */}
          <div>
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-300">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup" 
              value={formData.bloodGroup}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-300">
              Emergency Contact
            </label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm py-2">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="text-green-500 text-sm py-2">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
