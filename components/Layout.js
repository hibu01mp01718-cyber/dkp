import Navbar from './Navbar';
import { useSession, signOut } from 'next-auth/react';

export default function Layout({ children }) {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white font-sans">
      <div className="w-full max-w-7xl mx-auto mb-8">
        <Navbar user={session?.user} onLogout={signOut} />
      </div>
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full mt-4 md:mt-8 transition-all">{children}</main>
    </div>
  );
}
// ...existing code...
