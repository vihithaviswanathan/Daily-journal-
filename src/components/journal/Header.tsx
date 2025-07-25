import React from 'react';
import { Button } from '../ui/Button';
import { LogOut, Plus, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onCreateEntry: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateEntry,
  searchQuery,
  onSearchChange,
}) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Daily Journal
            </h1>
            <span className="ml-2 text-sm text-gray-500">
              Welcome, {user?.email}
            </span>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              icon={Plus}
              onClick={onCreateEntry}
              size="sm"
            >
              New Entry
            </Button>
            <Button
              variant="ghost"
              icon={LogOut}
              onClick={handleSignOut}
              size="sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};