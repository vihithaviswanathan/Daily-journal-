import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthForm } from './AuthForm';
import { Button } from '../ui/Button';
import { BookOpen } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Daily Journal
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back!' : 'Start your journaling journey'}
          </p>
        </div>

        <AuthForm
          isLogin={isLogin}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="mt-1"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Button>
        </div>
      </div>
    </div>
  );
};