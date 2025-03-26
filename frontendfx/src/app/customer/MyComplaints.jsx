
import { useRecoilValue } from 'recoil';
import { userStates } from '../../atoms';

const MyComplaints = () => {
  const user = useRecoilValue(userStates);
  const [activeFilter, setActiveFilter] = userStatesW('all');
  const [searchQuery, setSearchQuery] = userStates('');
  
  // Mock data for demonstration
  const complaints = [
    { 
      id: 'C-2025-042', 
      title: 'Website Login Issue', 
      description: 'Unable to login to the dashboard after password reset',
      status: 'In Progress', 
      date: '03/15/2025',
      assignedTo: 'Sarah Johnson',
      priority: 'High'
    },
    { 
      id: 'C-2025-041', 
      title: 'Payment Processing Error', 
      description: 'Payment was deducted but order not confirmed',
      status: 'Pending', 
      date: '03/10/2025',
      assignedTo: 'Unassigned',
      priority: 'Medium'
    },
    { 
      id: 'C-2025-039', 
      title: 'Account Activation Problem', 
      description: 'Verification email not received after signup',
      status: 'Resolved', 
      date: '03/05/2025',
      assignedTo: 'Michael Chen',
      priority: 'Low'
    },
    { 
      id: 'C-2025-037', 
      title: 'Mobile App Crash on Checkout', 
      description: 'App crashes when attempting to complete purchase',
      status: 'Resolved', 
      date: '02/28/2025',
      assignedTo: 'David Wilson',
      priority: 'High'
    },
    { 
      id: 'C-2025-035', 
      title: 'Incorrect Billing Information', 
      description: 'Invoice shows wrong address and tax calculation',
      status: 'Closed', 
      date: '02/20/2025',
      assignedTo: 'Lisa Martinez',
      priority: 'Medium'
    }
  ];
  
  // Filter complaints based on active filter and search query
  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = 
      activeFilter === 'all' || 
      complaint.status.toLowerCase() === activeFilter.toLowerCase();
    
    const matchesSearch = 
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">My Complaints</h1>
          <p className="text-gray-600 mt-1">View and manage all your submitted complaints</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => window.location.href = '/new-complaint'}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            New Complaint
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <FilterButton 
              label="All" 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')} 
            />
            <FilterButton 
              label="Pending" 
              active={activeFilter === 'pending'} 
              onClick={() => setActiveFilter('pending')} 
            />
            <FilterButton 
              label="In Progress" 
              active={activeFilter === 'in progress'} 
              onClick={() => setActiveFilter('in progress')} 
            />
            <FilterButton 
              label="Resolved" 
              active={activeFilter === 'resolved'} 
              onClick={() => setActiveFilter('resolved')} 
            />
            <FilterButton 
              label="Closed" 
              active={activeFilter === 'closed'} 
              onClick={() => setActiveFilter('closed')} 
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              🔍
            </span>
          </div>
        </div>
      </div>
      
      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{complaint.title}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{complaint.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{complaint.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={complaint.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      {(complaint.status !== 'Closed' && complaint.status !== 'Resolved') && (
                        <button className="text-gray-600 hover:text-gray-800">Update</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No complaints match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Button Component
const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm font-medium rounded-md ${
      active 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusClasses = {
    'Pending': 'bg-amber-100 text-amber-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const priorityClasses = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-amber-100 text-amber-800',
    'Low': 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityClasses[priority] || 'bg-gray-100 text-gray-800'}`}>
      {priority}
    </span>
  );
};

export default MyComplaints;