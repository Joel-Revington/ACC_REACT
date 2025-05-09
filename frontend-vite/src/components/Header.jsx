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
    <div className="header">
      <div className="side-header">
        <img
          className="logo"
          src="https://d1nw187rmwcpt3.cloudfront.net/usam_logo-removebg-preview.webp"
          alt="Autodesk Platform Services"
        />
        <button
          className="login-button"
          // Use the local handleLogoutButtonClick function
          onClick={user ? handleLogoutButtonClick : handleLogin}
        >
          {user ? `Logout (${user.name})` : 'Login'}
        </button>
      </div>

      {/* BackupPanel shown only if user is logged in */}
      {user && <BackupPanel setShowSpinner={setShowSpinner} />}
    </div>
  );
}

export default Header;