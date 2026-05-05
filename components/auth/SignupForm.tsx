'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl">🚀</span>
          <h1 className="text-2xl font-bold text-white mt-2">Create account</h1>
          <p className="text-slate-400 text-sm mt-1">Start managing your tasks today</p>
        </div>
        {error && <p className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls} />
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm mt-5 text-slate-400">
          Have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
