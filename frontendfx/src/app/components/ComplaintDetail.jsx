import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import { useRecoilValue } from 'recoil';
import { userStates } from '../../atoms';
import { API_URL } from '../../config';
const ComplaintDetail = () => {
  const { id } = useParams();
  const { userId,  role } = useRecoilValue(userStates);
  const isAdmin = role === 'admin';
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`${API_URL}/complaints`);
        const foundComplaint = response.data.find(c => c.id === parseInt(id));

        if (foundComplaint) {
          setComplaint(foundComplaint);
        } else {
          setError('Complaint not found');
        }
      } catch (err) {
        setError('Failed to fetch complaint details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleAssignComplaint = async () => {
    if (!reviewerName.trim()) {
      alert('Please enter a reviewer name');
      return;
    }

    try {
      await axios.put(`${API_URL}/complaints/${id}/assign`, {
        reviewerName,
        reviewerUserId: userId,
      });

      // Refresh complaint data
      const response = await axios.get(`${API_URL}/complaints`);
      const updatedComplaint = response.data.find(c => c.id === parseInt(id));
      setComplaint(updatedComplaint);
    } catch (err) {
      alert('Failed to assign complaint');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.put(`${API_URL}/complaints/${id}/status`, {
        status: newStatus,
        reviewerUserId: userId,
      });

      // Refresh complaint data
      const response = await axios.get(`${API_URL}/complaints`);
      const updatedComplaint = response.data.find(c => c.id === parseInt(id));
      setComplaint(updatedComplaint);
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-6">{error}</div>;

  const isOwner = complaint.userId === userId;
  const isAssigned = complaint.assignedToId === userId;
  const canChat = isOwner || isAssigned || isAdmin;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Complaint #{complaint.id}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 mb-1">Subject:</p>
            <p className="font-semibold mb-3">{complaint.subject}</p>

            <p className="text-gray-600 mb-1">Status:</p>
            <p className="mb-3">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  complaint.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : complaint.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800'
                    : complaint.status === 'RESOLVED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {complaint.status}
              </span>
            </p>
          </div>

          <div>
            <p className="text-gray-600 mb-1">Created On:</p>
            <p className="font-semibold mb-3">
              {new Date(complaint.createdAt).toLocaleString()}
            </p>

            <p className="text-gray-600 mb-1">Assigned To:</p>
            <p className="font-semibold">
              {complaint.assignedToId ? 'Assigned to reviewer' : 'Not assigned'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-1">Description:</p>
          <p className="bg-gray-50 p-3 rounded">{complaint.description}</p>
        </div>

        {complaint.image && (
          <div className="mb-6">
            <p className="text-gray-600 mb-1">Image:</p>
            <img 
              src={complaint.image} 
              alt="Complaint" 
              className="max-w-full h-auto max-h-64 rounded"
            />
          </div>
        )}

        {isAdmin && complaint.status === 'PENDING' && (
          <div className="mb-6 border-t pt-4">
            <h3 className="font-bold mb-2">Assign Complaint</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
              />
              <button
                onClick={handleAssignComplaint}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Assign to Me
              </button>
            </div>
          </div>
        )}

        {isAssigned && (
          <div className="mb-6 border-t pt-4">
            <h3 className="font-bold mb-2">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleUpdateStatus('IN_PROGRESS')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                disabled={complaint.status === 'IN_PROGRESS'}
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleUpdateStatus('RESOLVED')}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                disabled={complaint.status === 'RESOLVED' || complaint.status === 'CLOSED'}
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleUpdateStatus('CLOSED')}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                disabled={complaint.status === 'CLOSED'}
              >
                Close Complaint
              </button>
            </div>
          </div>
        )}
      </div>

      {canChat && complaint.status !== 'CLOSED' && (
        <ChatInterface complaintId={complaint.id} />
      )}
    </div>
  );
};

export default ComplaintDetail;
