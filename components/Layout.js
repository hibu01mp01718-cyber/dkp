import Navbar from './Navbar';
import { useSession, signOut } from 'next-auth/react';

export default function Layout({ children }) {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white font-sans flex">
      <Navbar user={session?.user} onLogout={signOut} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 sm:p-8 w-full mt-4 md:mt-8 transition-all max-w-7xl mx-auto pl-12">{children}</main>
      </div>
    </div>
  );
}
