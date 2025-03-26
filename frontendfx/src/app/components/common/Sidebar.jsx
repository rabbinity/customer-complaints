import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userStates } from '../../../atoms';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userStates);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isStaff = user?.role === 'staff' || user?.role === 'admin';
  
  // Code-inspired logo component
  const CodeLogo = () => (
    <div className="flex items-center mb-2">
      <div className="mr-2 text-xl font-bold text-blue-600 font-mono">
        &lt;/&gt;
      </div>
      <span className="text-xl font-medium text-gray-900">WebIzze</span>
    </div>
  );
  
  // Mobile menu burger button
  const MobileMenuButton = () => (
    <button 
      onClick={toggleMobileMenu}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      aria-label="Toggle menu"
    >
      <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
      <div className={`w-6 h-0.5 bg-gray-900 my-1.5 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
      <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
    </button>
  );
  
  return (
    <>
      {/* Mobile Menu Button */}
      <MobileMenuButton />
      
      {/* Sidebar Container - adjusts based on screen size and menu state */}
      <div 
        className={`
          ${isMobileView ? 'fixed z-40 top-0 left-0 h-full shadow-lg' : 'h-full'} 
          ${isMobileView && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'} 
          w-64 flex flex-col ${isStaff ? 'bg-gray-50' : 'bg-white'} border-r border-gray-200
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6">
          <CodeLogo />
          <h1 className="text-lg font-medium text-gray-900">
            {isStaff ? 'Complaint Manager' : 'Complaint Portal'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isStaff ? 'Staff Portal' : 'Customer Dashboard'}
          </p>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {isStaff ? (
              <>
                <SidebarLink to="/staff" label="Dashboard" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
                <SidebarLink to="/staff/complaints" label="Complaints" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
                <SidebarLink to="/staff/users" label="Users" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
                <SidebarLink to="/staff/settings" label="Settings" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
                <SidebarLink to="/staff/profile" label="Profile" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
              </>
            ) : (
              <>
                <SidebarLink to="/" end label="Dashboard" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
                <SidebarLink to="/my-complaints" label="My Complaints" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
                <SidebarLink to="/new-complaint" label="New Complaint" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
                <SidebarLink to="/profile" label="Profile" onClick={() => isMobileView && setIsMobileMenuOpen(false)} />
              </>
            )}
          </ul>
        </div>
        
        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Backdrop overlay for mobile */}
      {isMobileView && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

// Reusable Sidebar Link Component
// eslint-disable-next-line react/prop-types
const SidebarLink = ({ to, label, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive 
            ? 'bg-gray-100 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      {label}
    </NavLink>
  </li>
);

export default Sidebar;