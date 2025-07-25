import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  onSubmit,
  loading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        required
      />
      
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        required
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        {isLogin ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
};