import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Viewer from './components/Viewer';
import LoginModal from './components/LoginModal';
import Spinner from './components/Spinner';
import { getProfile, logout } from './services/auth';
import { loadModel, initViewer } from './services/viewer';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
        setShowLoginModal(false);
      } catch (error) {
        console.error("No active session:", error);
        setShowLoginModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    if (user) {
      const initializeViewer = async () => {
        try {
          const viewerInstance = await initViewer(document.getElementById('preview'));
          setViewer(viewerInstance);
        } catch (error) {
          console.error("Failed to initialize viewer:", error);
        }
      };

      initializeViewer();
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setShowLoginModal(true);
  };
  
  const handleLoadModel = (id) => {
    if (viewer) {
      loadModel(viewer, window.btoa(id).replace(/=/g, ''));
    }
  };

  return (
    <div className="app-container">
      {showLoginModal && <LoginModal onLogin={handleLogin} />}
      
      <Sidebar 
        user={user} 
        onModelSelect={handleLoadModel}
      />
      
      <div className="preview" id="preview"></div>
      
      <Header 
        user={user} 
        onLogout={handleLogout} 
        setShowSpinner={setShowSpinner}
      />
      
      {showSpinner && <Spinner />}
    </div>
  );
}

export default App;