import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
  import { API_URL } from '../../config';
import { useRecoilValue } from 'recoil';
import { userStates } from '../../atoms';

const ChatInterface = ({ complaintId }) => {
  const { userId, role } = useRecoilValue(userStates);
  const isAdmin = role === 'admin';
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/complaints`);
        const complaint = response.data.find(c => c.id === parseInt(complaintId));

        if (complaint && complaint.followUps) {
          setMessages(
            complaint.followUps.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
          );
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [complaintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${API_URL}/complaints/${complaintId}/followup`, {
        reviewerUserId: userId,
        note: newMessage,
      });

      const newMsg = {
        id: Date.now(), // Temporary ID
        complaintId: parseInt(complaintId),
        userId,
        message: newMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');

      const response = await axios.get(`${API_URL}/complaints`);
      const complaint = response.data.find(c => c.id === parseInt(complaintId));
      if (complaint && complaint.followUps) {
        setMessages(
          complaint.followUps.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
      }
    } catch (err) {
      alert('Failed to send message');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Complaint Communication</h3>

      <div className="bg-gray-50 p-4 rounded mb-4 h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 ${msg.userId === userId ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                  msg.userId === userId
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.message}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
