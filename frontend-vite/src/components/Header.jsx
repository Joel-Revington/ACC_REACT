// import { useState } from 'react';
// import BackupPanel from './BackupPanel';

// function Header({ user, onLogout, setShowSpinner }) {
//   const handleLogin = () => {
//     window.location.replace('/api/auth/login');
//   };

//   const handleLogout = () => {
//     const iframe = document.createElement('iframe');
//     iframe.style.visibility = 'hidden';
//     iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
//     document.body.appendChild(iframe);
//     iframe.onload = () => {
//       onLogout();
//       document.body.removeChild(iframe);
//     };
//   };

//   return (
//     <div className="header">
//       <div className="side-header">
//         <img 
//           className="logo" 
//           src="https://d1nw187rmwcpt3.cloudfront.net/usam_logo-removebg-preview.webp" 
//           alt="Autodesk Platform Services" 
//         />
//         <button 
//           className="login-button" 
//           onClick={user ? handleLogout : handleLogin}
//         >
//           {user ? `Logout (${user.name})` : 'Login'}
//         </button>
//       </div>
      
//       {user && <BackupPanel setShowSpinner={setShowSpinner} />}
//     </div>
//   );
// }

// export default Header;


import { useState } from 'react';
import BackupPanel from './BackupPanel';

function Header({ user, onLogout, setShowSpinner }) { // Receives initiateAutodeskLogout as onLogout
  const handleLogin = () => {
    window.location.replace('/api/auth/login');
  };

  // This function is called when the logout button is clicked
  // It simply calls the onLogout prop received from the parent (App)
  const handleLogoutButtonClick = () => {
    if (onLogout) { // Optional: Check if onLogout prop exists
       onLogout(); // Call the initiateAutodeskLogout function from App
    }
  };

  return (
    // <div className="header">
    //   <div className="side-header">
    //     <img
    //       className="logo"
    //       src="https://d1nw187rmwcpt3.cloudfront.net/usam_logo-removebg-preview.webp"
    //       alt="Autodesk Platform Services"
    //     />
    //     <button
    //       className="login-button"
    //       // Use the local handleLogoutButtonClick function
    //       onClick={user ? handleLogoutButtonClick : handleLogin}
    //     >
    //       {user ? `Logout (${user.name})` : 'Login'}
    //     </button>
    //   </div>

    //   {/* BackupPanel shown only if user is logged in */}
    //   {user && <BackupPanel setShowSpinner={setShowSpinner} />}
    // </div>
    <header className="bg-gray-50 shadow-sm w-[25%]">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <img
            className="h-12 object-contain"
            src="https://d3e25fyg0500ti.cloudfront.net/usam_logo.webp"
            alt="Autodesk Platform Services"
          />
        </div>
        <button
          onClick={user ? handleLogoutButtonClick : handleLogin}
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          {user ? `Logout (${user.name})` : 'Login'}
        </button>
      </div>

      {/* Show backup panel when logged in */}
      {user && <BackupPanel setShowSpinner={setShowSpinner} />}
    </header>
  );
}

export default Header;