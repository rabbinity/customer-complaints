import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Register from './auth/Register.jsx';
import { ForgotPassword } from './auth/Forgot_password.jsx';
import { Login } from './auth/Login.jsx';
import { ProfileUpdate } from './auth/Profilemanagement.jsx';
import UpdatePassword from './auth/Update_password.jsx';
import EmailVerification from './auth/EmailVerification.jsx';
import NotFound from "./auth/NotFound.jsx";

import Sidebar from "./app/components/common/Sidebar.jsx";
import OverviewPage from "./app/pages/OverviewPage.jsx";
import UsersPage from "./app/pages/UsersPage";
import SettingsPage from "./app/pages/SettingsPage";
import { Outlet } from 'react-router-dom';
import MobileWarningPopup from './app/components/common/mboileView.jsx';
import ComplaintsPage from './app/pages/ComplaintsPage.jsx';
import FollowUpsPage from './app/pages/FollowUpsPage.jsx';
import ComplaintDetailsPage from './app/pages/ComplaintDetailsPage.jsx';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-50">
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

          {/* Dashboard Layout with Sidebar */}
          <Route path="/" element={<Layout />}>
            <Route index element={<OverviewPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="follow-ups" element={<FollowUpsPage />} />
            <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfileUpdate />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
