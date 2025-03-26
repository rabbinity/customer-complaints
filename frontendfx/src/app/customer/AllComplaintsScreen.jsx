import { useRouter } from 'expo-router';

const AllComplaintsScreen = () => {

  const [complaints, setComplaints] = useState([]);
  const router = useRouter();

  const fetchComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      } else {
        alert('Error fetching complaints');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching complaints');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>All Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <ul>
          {complaints.map((c) => (
            <li key={c.id}>
              <p>ID: {c.id}</p>
              <p>Subject: {c.subject}</p>
              <p>Description: {c.description}</p>
              {c.image && <p>Image: {c.image}</p>}
              <p>Status: {c.status}</p>
              {c.followUps && c.followUps.length > 0 && (
                <div>
                  <p>Follow-Ups:</p>
                  <ul>
                    {c.followUps.map((f) => (
                      <li key={f.id}>{f.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => router.push('/create-complaint')}>Create Complaint</button>
    </div>
  );
};

export default AllComplaintsScreen;
