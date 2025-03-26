import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Register from './auth/Register.jsx';
import { ForgotPassword } from './auth/Forgot_password.jsx';
import { Login } from './auth/Login.jsx';
import { ProfileUpdate } from './auth/Profilemanagement.jsx';
import UpdatePassword from './auth/Update_password.jsx';
import EmailVerification from './auth/EmailVerification.jsx';

import Sidebar from "./app/components/common/Sidebar.jsx";
import MobileWarningPopup from './app/components/common/mboileView.jsx';
import { Outlet } from 'react-router-dom';
import Dashboard from './app/customer/Dashboard.jsx';
import MyComplaints from './app/customer/MyComplaints.jsx';
import NewComplaint from './app/customer/NewComplaint.jsx';

// Staff/Admin Layout
function StaffLayout() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      
      {/* Sidebar */}
      <MobileWarningPopup />
      <Sidebar />
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}

// Customer Layout
function CustomerLayout() {
  return (
    <div className="flex h-screen bg-blue-900 text-gray-100 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      
      {/* Sidebar */}
      <MobileWarningPopup />
      <Sidebar />
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update/password" element={<UpdatePassword />} />
          <Route path="/verify/email/:token" element={<EmailVerification />} />
          
          {/* Staff/Admin Routes - Company Workers */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<div>Staff Dashboard</div>} />
            <Route path="complaints" element={<div>All Complaints</div>} />
            <Route path="complaints/:id" element={<div>Complaint Details</div>} />
            <Route path="users" element={<div>Users Management</div>} />
            <Route path="settings" element={<div>Settings</div>} />
            <Route path="profile" element={<ProfileUpdate />} />
          </Route>
          
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Dashboard/>} />
            <Route path="my-complaints" element={<MyComplaints />}/>
            <Route path="my-complaints/:id" element={<MyComplaints />} />
            <Route path="new-complaint" element={<NewComplaint/>} />
            <Route path="profile" element={<ProfileUpdate />} />
          </Route>
          
          {/* Redirect unknown paths to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;