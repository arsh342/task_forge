import { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Successfully signed in",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      if (error.code === 'auth/popup-blocked') {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign in failed",
          description: "An error occurred while signing in. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signIn, signOut };
}