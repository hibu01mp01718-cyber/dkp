import { User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-background border-r border-border shadow-md px-4 py-6 w-64 min-h-screen flex flex-col justify-between">
      {/* Top: Logo/Title */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          {/* You can replace this with a logo if you have one */}
          <span className="font-extrabold tracking-tight select-none" style={{ fontSize: '18px', lineHeight: '1.1' }}>DKP Tracker</span>
        </div>
        {/* Nav Links */}
        <div className="flex flex-col gap-2">
          {[
            { href: '/', label: 'Dashboard' },
            { href: '/characters', label: 'Characters' },
            // { href: '/items', label: 'Items' },
            // { href: '/events', label: 'Events' },
            // { href: '/bids', label: 'Bids' },
            { href: '/leaderboard', label: 'Leaderboard' },
          ]
            .concat(user?.isAdmin ? [{ href: '/admin-events', label: 'Admin Events' }] : [])
            .map(({ href, label }) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-md font-medium text-base transition-colors duration-150
                    ${isActive ? 'bg-accent/30 text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'}
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50`
                  }
                  style={{ textDecoration: 'none' }}
                >
                  {label}
                </a>
              );
            })}
        </div>
      </div>
      {/* Bottom: User Profile */}
  <div className="flex flex-col gap-4 mt-8">
        {user ? (
          <>
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-card/70 border border-border h-12 min-h-0 shadow-sm">
              {user.image ? (
                <img src={user.image} alt="avatar" className="w-8 h-8 max-w-[32px] max-h-[32px] shrink-0 rounded-full border border-border object-cover" />
              ) : (
                <User size={20} />
              )}
              <div className="flex flex-col items-start text-left leading-tight">
                <span className="text-sm font-semibold leading-tight">{user.name || 'Profile'}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{user.id}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onLogout} className="text-red-500 flex items-center gap-2"><LogOut size={16} />Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button asChild variant="secondary" className="flex items-center gap-2 w-full">
            <a href="/api/auth/signin/discord" aria-label="Login with Discord" className="w-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-3.6938-.5538-7.3896-.5538-11.0594 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.0371A19.7363 19.7363 0 0 0 3.67 4.3698a.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276c-.598.3428-1.2205.6447-1.8733.8923a.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6601a.061.061 0 0 0-.0312-.0286ZM8.02 15.3312c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189Zm7.9748 0c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" fill="currentColor"/></svg>
              <span className="hidden md:inline">Login with Discord</span>
            </a>
          </Button>
        )}
      </div>
    </nav>
  );
}
