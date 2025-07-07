import React from 'react';
import {  User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">IntelliGen500 G2</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">SN: 25110083</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            
            <ThemeToggle />
            
          </div>
        </div>
      </div>
    </header>
  );
};