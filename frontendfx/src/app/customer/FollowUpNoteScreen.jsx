import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const FollowUpNoteScreen = () => {
  const [complaintId, setComplaintId] = useState('');
  const [reviewerUserId, setReviewerUserId] = useState('');
  const [note, setNote] = useState('');
  const router = useRouter();

  const handleAddNote = async () => {
    const body = { reviewerUserId: Number(reviewerUserId), note };
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert('Follow-up note added');
        router.push('/all-complaints');
      } else {
        alert('Error adding follow-up note');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding follow-up note');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Follow-Up Note</h2>
      <input placeholder="Complaint ID" value={complaintId} onChange={(e) => setComplaintId(e.target.value)} /><br />
      <input placeholder="Reviewer User ID" value={reviewerUserId} onChange={(e) => setReviewerUserId(e.target.value)} /><br />
      <textarea placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} /><br />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default FollowUpNoteScreen;
