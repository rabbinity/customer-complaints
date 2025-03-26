import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const UpdateComplaintStatusScreen = () => {
  const [complaintId, setComplaintId] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [reviewerUserId, setReviewerUserId] = useState('');
  const router = useRouter();

  const handleUpdate = async () => {
    const body = { status, reviewerUserId: Number(reviewerUserId) };
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert('Complaint status updated');
        router.push('/all-complaints');
      } else {
        alert('Error updating status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Update Complaint Status</h2>
      <input placeholder="Complaint ID" value={complaintId} onChange={(e) => setComplaintId(e.target.value)} /><br />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="PENDING">PENDING</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
        <option value="CLOSED">CLOSED</option>
      </select><br />
      <input placeholder="Reviewer User ID" value={reviewerUserId} onChange={(e) => setReviewerUserId(e.target.value)} /><br />
      <button onClick={handleUpdate}>Update Status</button>
    </div>
  );
};

export default UpdateComplaintStatusScreen;
