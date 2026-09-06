import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthPageProps {
  onSignedIn: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSignedIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onSignedIn();
    } catch (err: any) {
      console.error('[auth] Sign-in error:', err);
      setError(err.message ?? 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14110E] flex flex-col items-center justify-center p-6">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#E9BA6B 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo / Wordmark */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-mono text-[#D8CAB7]/50 uppercase tracking-[0.35em] mb-3">
            SANCTUARY
          </p>
          <h1 className="text-4xl font-serif text-[#F9F6F0] tracking-tight mb-2">
            Life OS
          </h1>
          <p className="text-[13px] font-mono text-[#D8CAB7]/60">
            Your personal memory archive
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1F1A17] border border-[#3A3026] rounded-2xl p-8 shadow-2xl">
          <p className="text-center text-[12px] font-mono text-[#D8CAB7]/50 mb-6 uppercase tracking-widest">
            Sign in to continue
          </p>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 px-4 py-2.5 rounded-lg bg-rose-900/40 border border-rose-700/50 text-rose-300 text-xs font-mono text-center"
            >
              {error}
            </div>
          )}

          <button
            id="google-sign-in-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
            aria-label="Sign in with Google"
            aria-busy={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl
                       bg-white hover:bg-[#F1F3F4] active:scale-[0.98]
                       text-[#1F1A17] font-medium text-sm
                       transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-md"
          >
            {/* Google icon */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="mt-6 text-center text-[10px] font-mono text-[#D8CAB7]/30 leading-relaxed">
            Your memories are encrypted and stored<br />securely in your personal archive.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] font-mono text-[#D8CAB7]/20 mt-8">
          SANCTUARY LIFE OS · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
