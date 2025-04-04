import  { useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userStates } from '../../atoms';
import { API_URL } from '../../config';

const CreateComplaint = () => {
  const { userId,} = useRecoilValue(userStates);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/A/createcomplaint`, {
        userId,
        subject,
        description,
        productName,
        image,
      });
      setSuccess(true);
      setSubject('');
      setDescription('');
      setProductName('');
      setImage('');
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Submit a New Complaint</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Complaint submitted successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="product" className="block text-gray-700 font-bold mb-2">
            Product Name (Optional)
          </label>
          <input
            type="text"
            id="product"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
            Image URL (Optional)
          </label>
          <input
            type="text"
            id="image"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default CreateComplaint;
