import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate, Link } from 'react-router-dom';
import { userStates, authState } from '../atoms';
import { motion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = useRecoilValue(userStates);
  const setUser = useSetRecoilState(userStates);
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  
  const isAdmin = user && (user.role === 'admin' || user.role === 'SUPERUSER');

  const handleMenu = () => {
    setOpen(!open); 
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setAuth(false);
    navigate('/login');
  };

  // Determine which links to show
  const commonLinks = (
    <ul className="flex flex-row gap-4">
      <li>
        <a
          className="hover:border-b-[1px] ease-in-out border-black transition-all duration-300"
          href="/view-programs"
        >
          View Programs
        </a>
      </li>
      {/* Add any other links you want to be visible to everyone */}
    </ul>
  );

  const userLinks = user && !isAdmin ? (
    <ul className="flex flex-row gap-4">
      <li>
        <a
          className="hover:border-b-[1px] ease-in-out border-black transition-all duration-300"
          href="/profile"
        >
          Profile
        </a>
      </li>
    </ul>
  ) : null;

  const adminLinks = isAdmin ? (
    <ul className="flex flex-row gap-4">
      <li>
        <a
          className="hover:border-b-[1px] ease-in-out border-black transition-all duration-300"
          href="all-applicants"
        >
          .
        </a>
      </li>
      <li>
        <a
          className="hover:border-b-[1px] ease-in-out border-black transition-all duration-300"
          href="/admin/all-applicants"
        >
          All Applicants
        </a>
      </li>
      <li>
        <a
          className="hover:border-b-[1px] ease-in-out border-black transition-all duration-300"
          href="/admin/all-users"
        >
          All Users
        </a>
      </li>
      <li>
        <a
          className="hover:border-b-[1px] ease-in-out border-black transition-all duration-300"
          href="/admin/manage-posts"
        >
          Manage Posts
        </a>
      </li>
      <li>
        <a
          className="hover:border-b-[1px] ease-in-out border-black transition-all duration-300"
          href="/admin/create-programs"
        >
          Create Programs
        </a>
      </li>
    </ul>
  ) : null;

  // Mobile links
  const mobileCommonLinks = (
    <>
      <li className="flex w-full">
        <a className="w-full hover:bg-gray-200 p-2" href="/view-programs">
          View Programs
        </a>
      </li>
      {/* Add any other links you want to be visible to everyone on mobile */}
    </>
  );

  const mobileUserLinks = user && !isAdmin ? (
    <li className="flex w-full">
      <a className="w-full hover:bg-gray-200 p-2" href="/profile">
        Profile
      </a>
    </li>
  ) : null;

  const mobileAdminLinks = isAdmin ? (
    <>
      <li className="flex w-full">
        <a className="w-full hover:bg-gray-200 p-2" href="all-applicants">
         
        </a>
      </li>
      <li className="flex w-full">
        <a className="w-full hover:bg-gray-200 p-2" href="/admin/all-applicants">
          All Applicants
        </a>
      </li>
      <li className="flex w-full">
        <a className="w-full hover:bg-gray-200 p-2" href="/admin/all-users">
          All Users
        </a>
      </li>
      <li className="flex w-full">
        <a className="w-full hover:bg-gray-200 p-2" href="/admin/manage-posts">
          Manage Posts
        </a>
      </li>
      <li className="flex w-full">
        <a className="w-full hover:bg-gray-200 p-2" href="/admin/create-programs">
          Create Programs
        </a>
      </li>
    </>
  ) : null;

  return (
    <div
      id="nav"
      className="px-4 shadow-xl sticky flex top-0 z-50 md:px-8 bg-[#F9F6EE] flex-row w-full items-center justify-center"
    >
      <nav className="flex w-full font-bold text-sm md:text-[14px] items-center py-1 md:py-1 justify-between">
        {/* Logo */}
        <Link
          className="group hover:scale-105 items-center transition flex"
          to="/"
        >
          <img
            src="https://grobertadmin.com/wp-content/uploads/2022/12/cropped-epic.png"
            alt="logo"
            loading="lazy"
            className="h-16 w-24"
          />
          <p className="text-[#3e4edf] md:text-3xl text-xl font-extrabold m-2"> Epic</p>
          <p className="text-gray-800 md:text-3xl text-xl font-extrabold">INSTUTE</p>
        </Link>

        {/* Links - Desktop */}
        <div className="md:flex hidden flex-row gap-4 items-center">
          <div className="flex flex-row">
            {commonLinks}
            {userLinks}
            {adminLinks}
          </div>

          <a
            className="flex items-center gap-2 bg-[#463991] text-white py-2 px-3 rounded-2xl"
          >
           
            
      
            <span>Home page </span>
          </a>
            
          {/* User Profile Button - Only show if logged in */}
          {user && (
            <>
              <a href='https://grobertadmin.com/e-book/'
                className="flex items-center gap-2 bg-[#907ff1] text-white py-2 px-3 rounded-2xl"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                
                </div>
                <span>library</span>
              </a>
              <div className="transition-all hover:scale-105 duration-300 relative">
                <button
                  onClick={handleMenu}
                  className="flex items-center gap-2 bg-[#010101] text-white py-2 px-3 rounded-2xl"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900">{user.username}</span>
                      <span className="block text-sm text-gray-500 truncate">{user.email}</span>
                      <span className="block text-sm font-medium text-blue-600">{user.role}</span>
                    </div>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Login/Register Buttons - Only show if not logged in */}
          {!user && (
            <div className="flex gap-2">
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm rounded-md bg-[#3e4edf] text-white hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div
          onClick={handleMenu}
          className="block md:hidden items-center justify-center"
        >
          {open ? (
            <div>
              {/* Cancel Button */}
              <button>
                <svg
                  viewBox="0 0 470 1000"
                  fill="currentColor"
                  height="1.5em"
                  width="1.5em"
                >
                  <path d="M452 656c12 12 18 26.333 18 43s-6 31-18 43c-12 10.667-26.333 16-43 16s-31-5.333-43-16L234 590 102 742c-12 10.667-26.333 16-43 16s-31-5.333-43-16C5.333 730 0 715.667 0 699s5.333-31 16-43l138-156L16 342C5.333 330 0 315.667 0 299s5.333-31 16-43c12-10.667 26.333-16 43-16s31 5.333 43 16l132 152 132-152c12-10.667 26.333-16 43-16s31 5.333 43 16c12 12 18 26.333 18 43s-6 31-18 43L314 500l138 156" />
                </svg>
              </button>

              {/* Mobile Menu Links */}
              <motion.div
                initial={{ opacity: 0, translateX: 30 }}
                whileInView={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute right-0 h-screen w-1/2 bg-[#F9F6EE] shadow-2xl top-[100%]"
              >
                {/* User Info - Only show if logged in */}
                {user && (
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <span className="block text-sm text-gray-500 truncate">{user.email}</span>
                    <span className="block text-sm font-medium text-blue-600">{user.role}</span>
                  </div>
                )}

                {/* Menu Links */}
                <ul className="flex flex-col gap-2">
                  {/* Common links accessible to everyone */}
                  {mobileCommonLinks}
                  
                  {/* Regular user links */}
                  {mobileUserLinks}
                  
                  {/* Admin links */}
                  {mobileAdminLinks}
                  
                  {/* Login/Register links - Only show if not logged in */}
                  {!user ? (
                    <>
                      <li className="flex w-full">
                        <a className="w-full hover:bg-gray-200 p-2" href="/login">
                          Login
                        </a>
                      </li>
                      <li className="flex w-full">
                        <a className="w-full hover:bg-gray-200 p-2" href="/register">
                          Register
                        </a>
                      </li>
                    </>
                  ) : (
                    <li className="flex w-full pl-2 mt-2">
                      <button
                        onClick={handleLogout}
                        className="bg-[#010101] text-white p-2 rounded-md w-11/12"
                      >
                        Sign Out
                      </button>
                    </li>
                  )}
                </ul>
              </motion.div>
            </div>
          ) : (
            <div>
              {/* Menu Button */}
              <button>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1.5em"
                  width="1.5em"
                >
                  <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;