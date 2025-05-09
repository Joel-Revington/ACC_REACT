// import { useState, useEffect } from 'react';
// import './App.css';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import Viewer from './components/Viewer';
// import LoginModal from './components/LoginModal';
// import Spinner from './components/Spinner';
// import { getProfile, logout } from './services/auth';
// import { loadModel, initViewer } from './services/viewer';

// function App() {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [viewer, setViewer] = useState(null);
//   const [showSpinner, setShowSpinner] = useState(false);

//   useEffect(() => {
//     const checkUserSession = async () => {
//       try {
//         const userData = await getProfile();
//         setUser(userData);
//         setShowLoginModal(false);
//       } catch (error) {
//         console.error("No active session:", error);
//         setShowLoginModal(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkUserSession();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       const initializeViewer = async () => {
//         try {
//           const viewerInstance = await initViewer(document.getElementById('preview'));
//           setViewer(viewerInstance);
//         } catch (error) {
//           console.error("Failed to initialize viewer:", error);
//         }
//       };

//       initializeViewer();
//     }
//   }, [user]);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setShowLoginModal(false);
//   };

//   // const handleLogout = async () => {
//   //   await logout();
//   //   setUser(null);
//   //   setShowLoginModal(true);
//   // };
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
  
//   const handleLoadModel = (id) => {
//     if (viewer) {
//       loadModel(viewer, window.btoa(id).replace(/=/g, ''));
//     }
//   };

//   return (
//     <div className="app-container">
//       {showLoginModal && <LoginModal onLogin={handleLogin} />}
      
//       <Sidebar 
//         user={user} 
//         onModelSelect={handleLoadModel}
//       />
      
//       <div className="preview" id="preview"></div>
      
//       <Header 
//         user={user} 
//         onLogout={handleLogout} 
//         setShowSpinner={setShowSpinner}
//       />
      
//       {showSpinner && <Spinner />}
//     </div>
//   );
// }

// export default App;

// import { useState, useEffect } from 'react';
// import './App.css';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import Viewer from './components/Viewer'; // Assuming you have a Viewer component, though the original was just a div
// import LoginModal from './components/LoginModal';
// import Spinner from './components/Spinner';
// import { getProfile, logout } from './services/auth'; // Make sure logout is imported
// import { loadModel, initViewer } from './services/viewer';

// function App() {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); // Added isLoading state
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [viewer, setViewer] = useState(null);
//   const [showSpinner, setShowSpinner] = useState(false);

//   useEffect(() => {
//     const checkUserSession = async () => {
//       try {
//         const userData = await getProfile();
//         setUser(userData);
//         setShowLoginModal(false);
//       } catch (error) {
//         console.error("No active session:", error);
//         // If profile fetch fails, assume not logged in
//         setUser(null); // Ensure user is null if profile fetch fails
//         setShowLoginModal(true);
//       } finally {
//         setIsLoading(false); // Stop loading after check
//       }
//     };

//     checkUserSession();
//   }, []);

//   useEffect(() => {
//     if (user && !viewer) { // Initialize viewer only if user exists and viewer is not already initialized
//       const initializeViewer = async () => {
//         try {
//           const viewerInstance = await initViewer(document.getElementById('preview'));
//           setViewer(viewerInstance);
//         } catch (error) {
//           console.error("Failed to initialize viewer:", error);
//           // Handle viewer initialization error if needed
//         }
//       };
//       initializeViewer();

//       // Optional: Clean up viewer on component unmount or user logout
//       // This would require returning a cleanup function from the useEffect
//       // return () => {
//       //   if (viewer) {
//       //      viewer.tearDown();
//       //      setViewer(null);
//       //   }
//       // };
//     }
//      if (!user && viewer) { // If user logs out and viewer exists, clean it up
//          viewer.tearDown();
//          setViewer(null);
//      }
//   }, [user, viewer]); // Add viewer to dependency array to avoid recreating it

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setShowLoginModal(false);
//   };

//   // This function performs the application-specific logout actions
//   const performAppLogout = async () => {
//     try {
//       // Call your backend logout endpoint if necessary
//       await logout(); // Assuming your auth service logout calls the backend /api/auth/logout
//       setUser(null);
//       setShowLoginModal(true);
//       // Clean up viewer if needed
//       if (viewer) {
//           viewer.tearDown();
//           setViewer(null);
//       }
//     } catch (error) {
//       console.error("Error during application logout:", error);
//       // Even if backend logout fails, clear local state
//       setUser(null);
//       setShowLoginModal(true);
//     }
//   };

//   // This function initiates the Autodesk browser-level logout via iframe
//   const initiateAutodeskLogout = () => {
//     const iframe = document.createElement('iframe');
//     iframe.style.visibility = 'hidden';
//     iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
//     document.body.appendChild(iframe);
//     iframe.onload = () => {
//       // Once the Autodesk logout page loads in the iframe,
//       // perform the application's logout actions.
//       performAppLogout(); // Call the function defined above
//       document.body.removeChild(iframe);
//     };
//   };


//   const handleLoadModel = (id) => {
//     if (viewer) {
//       // Make sure id is correctly formatted if needed by loadModel
//       loadModel(viewer, window.btoa(id).replace(/=/g, ''));
//     } else {
//         console.warn("Viewer not initialized. Cannot load model.");
//     }
//   };

//   // Prevent rendering before the initial auth check is complete
//   if (isLoading) {
//       return <Spinner />; // Or a simple loading message
//   }


//   return (
//     <div className="app-container">
//       {/* Show modal only if not logged in */}
//       {showLoginModal && <LoginModal onLogin={handleLogin} />}

//       {/* Render Sidebar and Viewer only if user is logged in */}
//       {user && (
//         <>
//           <Sidebar
//             user={user}
//             onModelSelect={handleLoadModel}
//           />
//           {/* The preview div is where the viewer is initialized */}
//           <div className="preview" id="preview"></div>
//         </>
//       )}


//       <Header
//         user={user}
//         // Pass the function that STARTS the logout process
//         onLogout={initiateAutodeskLogout}
//         setShowSpinner={setShowSpinner}
//       />

//       {/* Spinner is shown based on showSpinner state */}
//       {showSpinner && <Spinner />}
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Viewer from './components/Viewer'; // Optional: not used in this file, assuming only <div id="preview">
import LoginModal from './components/LoginModal';
import Spinner from './components/Spinner';
import { getProfile } from './services/auth';
import { loadModel, initViewer } from './services/viewer';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [viewer, setViewer] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

useEffect(() => {
  const checkUserSession = async () => {
    const isForcedLogout = localStorage.getItem('autodeskForceLogout');
    // if (isForcedLogout) {
    //   setShowLoginModal(true);
    //   setUser(null);
    //   setIsLoading(false);
    //   return;
    // }
    if (!isForcedLogout) {
      localStorage.setItem('autodeskForceLogout', 'true'); // Force login on first load
    }
    if (localStorage.getItem('autodeskForceLogout') === 'true') {
      setUser(null);
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }
    try {
      const userData = await getProfile();
      setUser(userData);
      setShowLoginModal(false);
    } catch (error) {
      setUser(null);
      setShowLoginModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  checkUserSession();
}, []);

  useEffect(() => {
    if (user && !viewer) {
      const initializeViewer = async () => {
        try {
          const viewerInstance = await initViewer(document.getElementById('preview'));
          setViewer(viewerInstance);
        } catch (error) {
          console.error('Failed to initialize viewer:', error);
        }
      };
      initializeViewer();
    }

    // Clean up viewer if user logs out
    if (!user && viewer) {
      viewer.tearDown();
      setViewer(null);
    }

    return () => {
      if (viewer) {
        viewer.tearDown();
        setViewer(null);
      }
    };
  }, [user]);

  // const handleLogin = (userData) => {
  //   setUser(userData);
  //   setShowLoginModal(false);
  // };
  const handleLogin = async () => {
    try {
      const userData = await getProfile();
      localStorage.removeItem('autodeskForceLogout'); // Allow login to persist
      setUser(userData);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  

  // const performAppLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //   } finally {
  //     setUser(null);
  //     setShowLoginModal(true);
  //     if (viewer) {
  //       viewer.tearDown();
  //       setViewer(null);
  //     }
  //   }
  // };
  // App-side logout logic
  const performAppLogout = async () => {
    try {
      await logout(); // clear session server-side
    } catch (e) {
      console.warn('App session logout failed:', e);
    }
    localStorage.setItem('autodeskForceLogout', 'true'); // Mark that user intentionally logged out
    setUser(null);
    setShowLoginModal(true);
  };

  const initiateAutodeskLogout = () => {
    try {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
      iframe.style.display = 'none';

      iframe.onload = () => {
        setTimeout(() => {
          performAppLogout();
          document.body.removeChild(iframe);
        }, 1000); // Give Autodesk logout time to complete
      };

      document.body.appendChild(iframe);
    } catch (error) {
      console.error('Logout failed:', error);
      performAppLogout();
    }
  };

  const handleLoadModel = (id) => {
    if (viewer) {
      const encodedId = window.btoa(id).replace(/=/g, '');
      loadModel(viewer, encodedId);
    } else {
      console.warn('Viewer not initialized. Cannot load model.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="app-container">
      {showLoginModal && <LoginModal onLogin={handleLogin} />}
      {user && (
        <>
          <Sidebar user={user} onModelSelect={handleLoadModel} />
          <div className="preview" id="preview"></div>
          <Header user={user} onLogout={initiateAutodeskLogout} setShowSpinner={setShowSpinner} />
        </>
      )}
      {showSpinner && <Spinner />}
    </div>
  );
}

export default App;
