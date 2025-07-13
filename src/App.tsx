import React, { useState } from 'react'; // Removed useEffect since we don't need it
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setToken] = useState<string | null>(null);

  const handleLogin = (authToken: string) => {
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', authToken);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;






// import { useState, useEffect } from 'react';
// import { LoginPage } from './components/LoginPage';
// import { Dashboard } from './components/Dashboard';
// import { initializeFirebase } from './components/firebase/firebase';

// export function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchWithCors = async (url: string, options: RequestInit) => {
//     try {
//       const response = await fetch(url, {
//         ...options,
//         mode: 'cors',
//         credentials: 'include',
//         headers: {
//           ...options.headers,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (err) {
//       console.error('Fetch error:', err);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     const verifyTokenAndInitFirebase = async () => {
//       const savedToken = localStorage.getItem('authToken');
      
//       if (!savedToken) {
//         setIsCheckingAuth(false);
//         return;
//       }

//       try {
//         const data = await fetchWithCors('http://localhost:8080/devices/config', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${savedToken}`
//           }
//         });

//         if (data?.status) {
//           initializeFirebase(data.data);
//           setIsAuthenticated(true);
//         } else {
//           localStorage.removeItem('authToken');
//         }
//       } catch (err) {
//         setError('Failed to connect to server. Please try again later.');
//         console.error('Token verification failed:', err);
//         localStorage.removeItem('authToken');
//       } finally {
//         setIsCheckingAuth(false);
//       }
//     };

//     verifyTokenAndInitFirebase();
//   }, []);

//   const handleLogin = async (authToken: string) => {
//     try {
//       const data = await fetchWithCors('http://localhost:8080/devices/config', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${authToken}`
//         }
//       });

//       if (data?.status) {
//         initializeFirebase(data.data);
//         setIsAuthenticated(true);
//         localStorage.setItem('authToken', authToken);
//       }
//     } catch (err) {
//       setError('Login failed. Please check your credentials and try again.');
//       console.error('Login error:', err);
//     }
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('authToken');
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center p-6 bg-white rounded-lg shadow-md">
//           <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
//           <p className="text-gray-700 mb-4">{error}</p>
//           <button 
//             onClick={() => setError(null)}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {!isAuthenticated ? (
//         <LoginPage onLogin={handleLogin} />
//       ) : (
//         <Dashboard onLogout={handleLogout} />
//       )}
//     </div>
//   );
// }

// export default App;