import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userStates } from '../../atoms';

const ComplaintsList = () => {
  const { userId, role } = useRecoilValue(userStates);
  const isAdmin = role === 'admin';
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('/api/complaints');
        if (isAdmin) {
          setComplaints(response.data);
        } else {
          // Regular users only see their own complaints
          setComplaints(response.data.filter(complaint => complaint.userId === userId));
        }
      } catch (err) {
        setError('Failed to fetch complaints');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userId, isAdmin]);

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-6">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isAdmin ? 'All Complaints' : 'Your Complaints'}
      </h2>

      {complaints.length === 0 ? (
        <p className="text-gray-500">No complaints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Subject</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className="py-2 px-4 border-b">{complaint.id}</td>
                  <td className="py-2 px-4 border-b">{complaint.subject}</td>
                  <td className="py-2 px-4 border-b">
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
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link 
                      to={`/complaints/${complaint.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplaintsList;
