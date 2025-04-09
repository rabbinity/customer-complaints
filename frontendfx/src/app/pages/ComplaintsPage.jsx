import React, { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { motion } from "framer-motion";

import { userStates } from "../../atoms";
import { API_URL } from "../../config";
import ComplaintDetailModal from "./ComplaintDetailsPage";
import ChatInterface from "../components/ChatInterface";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { MessageSquare, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const userData = useRecoilValue(userStates);
  const isCustomer = userData?.role === "CUSTOMER";

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/a/list`);
        const filtered = isCustomer
          ? response.data.filter((c) => c.userId === userData.userId)
          : response.data;

        setComplaints(filtered);
      } catch (err) {
        setError("Failed to fetch complaints. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
    const intervalId = setInterval(fetchComplaints, 30000);
    return () => clearInterval(intervalId);
  }, [userData, isCustomer]);

  const getStatusColor = (complaint) => {
    const createdDate = new Date(complaint.createdAt);
    const daysSinceCreation = differenceInDays(new Date(), createdDate);

    if (complaint.status === "RESOLVED") return "bg-green-500";
    if (daysSinceCreation > 30) return "bg-red-500";
    return "bg-orange-500";
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const openChatWithCustomer = (complaint) => {
    setSelectedComplaint(complaint);
    setShowChatModal(true);
    setShowDetailModal(false);
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "PENDING").length,
    inProgress: complaints.filter((c) => c.status === "IN_PROGRESS").length,
    resolved: complaints.filter((c) =>
      ["RESOLVED", "CLOSED"].includes(c.status)
    ).length,
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Complaints" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Complaints"
            icon={MessageSquare}
            value={stats.total}
            color="#6366F1"
          />
          <StatCard
            name="Pending"
            icon={Clock}
            value={stats.pending}
            color="#F59E0B"
          />
          <StatCard
            name="In Progress"
            icon={AlertTriangle}
            value={stats.inProgress}
            color="#10B981"
          />
          <StatCard
            name="Resolved / Closed"
            icon={CheckCircle2}
            value={stats.resolved}
            color="#22C55E"
          />
        </motion.div>

        {/* Table section */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
              <span className="text-sm text-gray-300">New (&lt; 1 month)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <span className="text-sm text-gray-300">Old (&gt; 1 month)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span className="text-sm text-gray-300">Resolved</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Subject
                  </th>
                  {!isCustomer && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Complainant
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Assigned To
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Follow-ups
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-300">
                      Loading...
                    </td>
                  </tr>
                ) : complaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  complaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleComplaintClick(complaint)}
                    >
                      <td className="px-4 py-3 text-gray-100">{complaint.id}</td>
                      <td className="px-4 py-3 text-gray-100">{complaint.subject}</td>
                      {!isCustomer && (
                        <td className="px-4 py-3 text-gray-100">
                          {complaint.user?.username || "Unknown"}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(
                            complaint
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-100">
                        {complaint.assignedTo?.username || "Unassigned"}
                      </td>
                      <td className="px-4 py-3 text-gray-100">
                        {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-gray-100">
                        {complaint.followUps?.length || 0}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openChatWithCustomer(complaint);
                          }}
                        >
                          Chat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modals */}
        {showDetailModal && selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            onClose={() => setShowDetailModal(false)}
            onOpenChat={() => {
              setShowDetailModal(false);
              setShowChatModal(true);
            }}
          />
        )}

        {showChatModal && selectedComplaint && (
          <ChatInterface
            complaintId={selectedComplaint.id}
            onClose={() => setShowChatModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default ComplaintsPage;
