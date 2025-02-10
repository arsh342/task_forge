import { useState } from 'react';
import { AuthForm } from './AuthForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{mode === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm mode={mode} />
          <div className="mt-4 text-center text-sm">
            {mode === 'signin' ? (
              <div>
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setMode('signup')}
                >
                  Sign up
                </Button>
              </div>
            ) : (
              <div>
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}