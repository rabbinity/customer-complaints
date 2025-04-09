import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { userStates } from '../../atoms';

const ComplaintDetailModal = ({ complaint, onClose, onOpenChat }) => {
  const { userId, username, email } = useRecoilValue(userStates);

  const getStatusColor = (complaint) => {
    const createdDate = new Date(complaint.createdAt);
    const daysSinceCreation = differenceInDays(new Date(), createdDate);
    
    if (complaint.status === 'RESOLVED') return 'bg-green-500';
    if (daysSinceCreation > 30) return 'bg-red-500';
    return 'bg-orange-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg w-full max-w-2xl max-h-full overflow-y-auto text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Complaint Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">ID</p>
              <p className="font-medium">{complaint.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(complaint)}`}
              >
                {complaint.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Created</p>
              <p className="font-medium">
                {format(new Date(complaint.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Updated</p>
              <p className="font-medium">
                {format(new Date(complaint.updatedAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Subject</p>
            <p className="font-medium">{complaint.subject}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Description</p>
            <div className="bg-gray-700 p-4 rounded-lg text-gray-100">
              {complaint.description}
            </div>
          </div>

          {complaint.image && (
            <div>
              <p className="text-sm text-gray-400">Attachment</p>
              <img
                src={complaint.image}
                alt="Complaint attachment"
                className="mt-2 rounded-lg max-h-60 w-auto"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Customer</p>
              <p className="font-medium">
                {complaint.user?.username || `ID: ${complaint.userId}`}
              </p>
              {complaint.user?.email && (
                <p className="text-sm text-gray-400">{complaint.user.email}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Assigned To</p>
              <p className="font-medium">
                {complaint.assignedTo?.username || 'Unassigned'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Follow-ups</p>
            <p className="font-medium">{complaint.followUps?.length || 0} messages</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">You</p>
            <p className="font-medium">{username} (ID: {userId})</p>
            <p className="text-sm text-gray-400">{email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-700 space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={onOpenChat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Open Chat
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintDetailModal;
