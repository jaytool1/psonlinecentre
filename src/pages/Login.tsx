import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAdmin = async (uid: string) => {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists() && adminDoc.data().role === 'admin') {
      return true;
    }
    // Check if it's the default admin email
    const user = auth.currentUser;
    if (user?.email === 'jayydv107@gmail.com') {
      return true;
    }
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = await checkAdmin(userCredential.user.uid);
      if (!isAdmin) {
        await auth.signOut();
        toast.error('Access denied. Admin only.');
      } else {
        toast.success('Welcome back, Admin!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isAdmin = await checkAdmin(result.user.uid);
      if (!isAdmin) {
        await auth.signOut();
        toast.error('Access denied. Admin only.');
      } else {
        toast.success('Welcome back, Admin!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)] dot-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nothing-card max-w-md w-full"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[var(--fg)] text-[var(--bg)] rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-tighter">ADMIN LOGIN</h1>
          <p className="text-sm opacity-50">Pankaj Online Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input
              type="email"
              placeholder="Admin Email"
              className="nothing-input pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="nothing-input pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="nothing-button w-full mt-2"
          >
            {loading ? 'Logging in...' : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--bg)] px-2 text-[var(--fg)] opacity-50">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="nothing-button-outline w-full"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Google Admin Login
        </button>

        <p className="mt-8 text-center text-xs opacity-30">
          Secure access for authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
}
