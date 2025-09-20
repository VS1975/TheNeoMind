import { signInWithPopup } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { useState } from 'react';

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add additional scopes if needed
      googleProvider.setCustomParameters({
        prompt: 'select_account', // Forces account selection even when one account is available
      });
      
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      
      // Optional: Get the Google Access Token for backend auth if needed
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      
      // Navigate only if sign in was successful
      if (result.user) {
        navigate('/');
      }
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // This error occurs when multiple sign-in attempts are made in quick succession
        // We can ignore it as the user likely clicked the button multiple times
        console.log('Sign in was cancelled by another request');
      } else {
        console.error('Error signing in with Google:', error);
        setError('Failed to sign in. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg border border-border"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to NeoMind
          </h1>
          <p className="text-muted-foreground">
            Your personal productivity companion
          </p>
        </div>
        
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            className={`group relative w-full flex justify-center items-center gap-3 py-3 px-4 border border-border rounded-lg bg-background hover:bg-accent transition-colors duration-200 text-foreground font-medium ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            <FcGoogle className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </motion.button>
          
          {error && (
            <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
        
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              The future of productivity
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
