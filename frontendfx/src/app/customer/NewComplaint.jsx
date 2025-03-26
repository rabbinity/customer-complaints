import  { useState } from 'react';
import { useRouter } from 'expo-router';

const NewComplaint = () => {
  const [userId, setUserId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const body = { userId: Number(userId), subject, description, productName, image };
    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert('Complaint created successfully');
        router.push('/all-complaints');
      } else {
        alert('Error creating complaint');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating complaint');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Complaint</h2>
      <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} /><br />
      <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} /><br />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
      <input placeholder="Product Name (optional)" value={productName} onChange={(e) => setProductName(e.target.value)} /><br />
      <input placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} /><br />
      <button onClick={handleSubmit}>Submit Complaint</button>
    </div>
  );
};

export default NewComplaint;
