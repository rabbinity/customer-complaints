import  { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CreateComplaint from '../src/app/components/CreateComplaint';
import ComplaintsList from '../src/app/components/ComplaintsList';
import ComplaintDetail from '../src/app/components/ComplaintDetail';
import { RecoilRoot, useRecoilState } from 'recoil';
import { userStates } from './atoms';

const MainApp = () => {
  const [user, setUser] = useRecoilState(userStates);

  useEffect(() => {
    if (!user.userId) {
      setUser({
        userId: 1,
        username: 'johndoe',
        role: 'user',
        lastame: null,
        midlename: null,
        email: null,
        phoneNumber: null,
        group: null,
        token: null,
        isEmailVerified: null,
        bloodGroup: null,
        address: null,
        dateOfBirth: null,
        gender: null,
        emergencyContact: null,
        nrc_card_id: null,
      });
    }
  }, [user, setUser]);

  const toggleUserRole = () => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === 'admin' ? 'user' : 'admin',
    }));
  };

  const isAdmin = user.role === 'admin';

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-blue-600">Complaint System</span>
                </div>
                <div className="ml-10 flex items-center space-x-4">
                  <Link to="/" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link to="/complaints" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Complaints
                  </Link>
                  <Link to="/create" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    New Complaint
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4">
                  Welcome, {user.username} ({isAdmin ? 'Admin' : 'User'})
                </span>
                <button 
                  onClick={toggleUserRole}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  Switch to {isAdmin ? 'User' : 'Admin'} Role
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/complaints" />} />
            <Route path="/complaints" element={<ComplaintsList />} />
            <Route path="/create" element={<CreateComplaint />} />
            <Route path="/complaints/:id" element={<ComplaintDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App = () => (
  <RecoilRoot>
    <MainApp />
  </RecoilRoot>
);

export default App;
