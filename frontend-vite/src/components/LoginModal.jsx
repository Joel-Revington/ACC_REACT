// import { useState } from 'react';

// function LoginModal({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     try {
//       const response = await fetch('/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         onLogin(data.user);
//       } else {
//         setError(data.message || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('An error occurred during login. Please try again.');
//     }
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>Authenticate</h2>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginModal;

import { useState } from 'react';

function LoginModal({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    // <div className="modal">
    //   <div className="modal-content">
    //     <h2>Login</h2>
    //     {error && <p style={{ color: 'red' }}>{error}</p>}
    //     <form onSubmit={handleSubmit}>
    //       <input
    //         type="text"
    //         name='email'
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         placeholder="Email"
    //         required
    //       />
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         placeholder="Password"
    //         required
    //       />
    //       <button type="submit">Login</button>
    //     </form>
    //   </div>
    // </div>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
