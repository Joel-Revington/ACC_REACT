import { useState } from 'react';
import BackupPanel from './BackupPanel';

function Header({ user, onLogout, setShowSpinner }) {
  const handleLogin = () => {
    window.location.replace('/api/auth/login');
  };

  const handleLogout = () => {
    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
    document.body.appendChild(iframe);
    iframe.onload = () => {
      onLogout();
      document.body.removeChild(iframe);
    };
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
          onClick={user ? handleLogout : handleLogin}
        >
          {user ? `Logout (${user.name})` : 'Login'}
        </button>
      </div>
      
      {user && <BackupPanel setShowSpinner={setShowSpinner} />}
    </div>
  );
}

export default Header;