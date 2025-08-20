import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { HiHome, HiUserGroup, HiClipboardList, HiUser, HiCog, HiCollection, HiGift } from 'react-icons/hi'

export default function Layout({ children }) {
  const { data: session } = useSession()
  const router = useRouter()
  const navLinks = [
    { href: '/', label: 'Dashboard', icon: <HiHome size={20} /> },
    { href: '/characters', label: 'Characters', icon: <HiUserGroup size={20} /> },
    { href: '/items', label: 'Items', icon: <HiGift size={20} /> },
    { href: '/events', label: 'Events', icon: <HiClipboardList size={20} /> },
    { href: '/bids', label: 'Bids', icon: <HiCollection size={20} /> },
  ]
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white font-sans">
      {/* Sidebar - responsive */}
      <aside className="fixed top-0 left-0 h-full w-64 md:w-72 bg-gray-800/90 backdrop-blur-lg shadow-xl flex flex-col z-40 transition-transform duration-300 md:translate-x-0 -translate-x-full md:relative md:translate-x-0 border-r border-border" id="sidebar">
        <div>
          <div className="flex items-center justify-between px-2 py-6 border-b border-gray-700">
            <span className="text-2xl font-bold tracking-tight text-accent">DKP Tracker</span>
            {/* Mobile menu close button */}
            <button className="md:hidden text-gray-400 hover:text-white focus:outline-none" onClick={() => document.getElementById('sidebar').classList.add('-translate-x-full')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mb-6 mt-6">
            <div className="uppercase text-xs text-muted font-semibold mb-2 tracking-widest">Guild Navigation</div>
            <nav className="flex flex-col gap-2 text-base">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${router.pathname === link.href ? 'bg-accent/20 text-accent shadow' : 'hover:bg-glass hover:text-accent text-white/90'}`}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mb-6">
            <div className="uppercase text-xs text-muted font-semibold mb-2 tracking-widest">Profile</div>
            <nav className="flex flex-col gap-2 text-base">
              <a href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium hover:bg-glass hover:text-accent text-white/90"><HiUser size={20} />Summary</a>
              <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium hover:bg-glass hover:text-accent text-white/90"><HiCog size={20} />Settings</a>
            </nav>
          </div>
          {/* Guild section removed as requested */}
        </div>
        {session && session.user && (
          <div className="flex flex-col items-center gap-2 bg-glass px-3 py-4 rounded-xl shadow border border-border mt-10 w-full">
            <img src={session.user.image} alt="avatar" className="w-14 h-14 rounded-full mb-1" />
            <span className="font-semibold text-highlight text-center break-all">{session.user.name}</span>
            <span className="text-xs text-muted break-all">User ID:<br />{session.user.id}</span>
            {/* Optionally show guild ID if available in session */}
            {session.guildId && (
              <span className="text-xs text-muted break-all">Guild ID:<br />{session.guildId}</span>
            )}
            <button
              className="mt-2 text-sm text-muted hover:text-accent transition"
              onClick={() => signOut()}
            >Sign out</button>
          </div>
        )}
      </aside>
      {/* Mobile sidebar toggle */}
      <button className="fixed top-4 left-4 z-50 md:hidden bg-gray-800/80 p-2 rounded-lg shadow-lg hover:bg-gray-700/80 transition-colors" onClick={() => document.getElementById('sidebar').classList.remove('-translate-x-full')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full mt-4 md:mt-8 md:ml-72 transition-all">{children}</main>
    </div>
  )
}
