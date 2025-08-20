import Navbar from './Navbar';
import { useSession, signOut } from 'next-auth/react';

export default function Layout({ children }) {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white font-sans flex">
      {session?.user && <Navbar user={session.user} onLogout={signOut} />}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full flex justify-center">
          <main className={`p-4 sm:p-8 mt-4 md:mt-8 transition-all max-w-2xl w-full${session?.user ? ' pl-12' : ''}`}>{children}</main>
        </div>
      </div>
    </div>
  );
}
