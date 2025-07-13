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

