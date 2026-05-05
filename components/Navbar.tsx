'use client';
import { useAuth } from './auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <h1 className="text-xl font-bold text-white tracking-wide">TaskFlow</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">👋 {user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
