import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof formSchema>;

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: 'Account created successfully',
          description: 'Welcome to Task Manager!',
        });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: 'Signed in successfully',
          description: 'Welcome back!',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'microsoft' | 'apple') => {
    setIsLoading(true);
    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'github':
          authProvider = new GithubAuthProvider();
          break;
        case 'microsoft':
          authProvider = new OAuthProvider('microsoft.com');
          break;
        case 'apple':
          authProvider = new OAuthProvider('apple.com');
          break;
        default:
          throw new Error('Invalid provider');
      }
      await signInWithPopup(auth, authProvider);
      toast({
        title: 'Signed in successfully',
        description: 'Welcome to Task Manager!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email to reset your password',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      {mode === 'signin' && (
        <Button
          variant="link"
          className="px-0 font-normal"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </Button>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleOAuthSignIn('google')}
          disabled={isLoading}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOAuthSignIn('github')}
          disabled={isLoading}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOAuthSignIn('microsoft')}
          disabled={isLoading}
        >
          <Icons.microsoft className="mr-2 h-4 w-4" />
          Microsoft
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOAuthSignIn('apple')}
          disabled={isLoading}
        >
          <Icons.apple className="mr-2 h-4 w-4" />
          Apple
        </Button>
      </div>
    </div>
  );
}