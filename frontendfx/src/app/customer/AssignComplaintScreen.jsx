import { useState } from 'react';
import { useRouter } from 'expo-router';

const AssignComplaintScreen = () => {
  const [complaintId, setComplaintId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerUserId, setReviewerUserId] = useState('');
  const router = useRouter();

  const handleAssign = async () => {
    const body = { reviewerName, reviewerUserId: Number(reviewerUserId) };
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert('Complaint assigned successfully');
        router.push('/all-complaints');
      } else {
        alert('Error assigning complaint');
      }
    } catch (error) {
      console.error(error);
      alert('Error assigning complaint');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Assign Complaint</h2>
      <input placeholder="Complaint ID" value={complaintId} onChange={(e) => setComplaintId(e.target.value)} /><br />
      <input placeholder="Reviewer Name" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} /><br />
      <input placeholder="Reviewer User ID" value={reviewerUserId} onChange={(e) => setReviewerUserId(e.target.value)} /><br />
      <button onClick={handleAssign}>Assign Complaint</button>
    </div>
  );
};

export default AssignComplaintScreen;
