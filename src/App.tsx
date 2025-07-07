import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { GeneratorDashboard } from './components/GeneratorDashboard';

function AppContent() {
  // Initialize theme system
  useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <GeneratorDashboard />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;