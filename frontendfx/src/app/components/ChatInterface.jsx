import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userStates } from "../../atoms";
import { API_URL } from "../../config";
import { motion } from "framer-motion";

const ChatInterface = ({ complaintId, onClose }) => {
	const { userId, username } = useRecoilValue(userStates);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [partnerId, setPartnerId] = useState(null);
	const messagesEndRef = useRef(null);

	const fetchComplaintDetails = async () => {
		try {
			const res = await axios.get(`${API_URL}/api/a/list`);
			const complaint = res.data.find((c) => c.id === parseInt(complaintId));
			if (complaint) {
				const partner = complaint.userId === userId ? complaint.assignedToId : complaint.userId;
				setPartnerId(partner);
			}
		} catch {
			alert("Failed to fetch complaint details.");
		}
	};

	const fetchMessages = async () => {
		try {
			if (!partnerId) return;
			const res = await axios.get(`${API_URL}/chat/conversation`, {
				params: { user1: userId, user2: partnerId },
			});
			setMessages(res.data);
		} catch {
			alert("Failed to fetch messages.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchComplaintDetails();
	}, [complaintId, userId]);

	useEffect(() => {
		if (partnerId) {
			fetchMessages();
			const interval = setInterval(fetchMessages, 5000);
			return () => clearInterval(interval);
		}
	}, [partnerId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		if (!partnerId) {
			const confirmAssign = window.confirm("This complaint is unassigned. Assign yourself?");
			if (confirmAssign) {
				try {
					const assignRes = await axios.put(`${API_URL}/api/A/${complaintId}/assign`, {
						reviewerName: username,
						reviewerUserId: userId,
					});
					if (assignRes.status === 200) await fetchComplaintDetails();
				} catch {
					alert("Assignment failed. Try again.");
					return;
				}
			} else return;
		}

		try {
			await axios.post(`${API_URL}/chat/send`, {
				senderId: userId,
				receiverId: partnerId,
				message: newMessage,
			});
			setMessages((prev) => [
				...prev,
				{
					id: Date.now(),
					senderId: userId,
					receiverId: partnerId,
					message: newMessage,
					createdAt: new Date().toISOString(),
				},
			]);
			setNewMessage("");
		} catch {
			alert("Failed to send message.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700 w-full max-w-3xl rounded-xl shadow-lg overflow-hidden flex flex-col"
			>
				<div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
					<h2 className="text-lg font-semibold text-gray-100">Complaint Chat</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
				</div>

				<div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-900 space-y-4">
					{loading ? (
						<div className="text-center text-gray-400">Loading messages...</div>
					) : messages.length === 0 ? (
						<div className="text-center text-gray-500">No messages yet</div>
					) : (
						messages.map((msg) => (
							<div
								key={msg.id}
								className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`rounded-lg px-4 py-2 max-w-xs sm:max-w-sm text-sm ${
										msg.senderId === userId
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-900"
									}`}
								>
									{msg.message}
									<div className="text-xs mt-1 text-gray-400 text-right">
										{new Date(msg.createdAt).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								</div>
							</div>
						))
					)}
					<div ref={messagesEndRef} />
				</div>

				<form onSubmit={handleSendMessage} className="flex gap-2 px-6 py-4 border-t border-gray-700 bg-gray-800">
					<input
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type your message..."
						className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white"
					>
						Send
					</button>
				</form>
			</motion.div>
		</div>
	);
};

export default ChatInterface;
