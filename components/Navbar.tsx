import hideStyles from './hideOnMobile.module.css';

import { User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import styles from './Navbar.module.css';


export default function Navbar({ user, onLogout }) {
  let navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/characters', label: 'Characters' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/auctions', label: 'Auctions' },
  ];
  if (user?.isAdmin) {
    navLinks.push({ href: '/admin-events', label: 'Admin Events' });
    navLinks.push({ href: '/consignment', label: 'Consignment' });
  }

  // If not logged in, only show Dashboard link
  if (!user) {
    navLinks = navLinks.filter(link => link.href === '/');
  }

  return (
    <header className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        {/* Logo/Brand */}
        <a href="/" className={styles.logo}>
          <span>DKP Tracker</span>
        </a>
        {/* Nav Links */}
        <div className={styles.navLinks}>
          {navLinks.map(({ href, label }) => {
            const isActive = typeof window !== 'undefined' && window.location.pathname === href;
            return (
              <a
                key={href}
                href={href}
                className={isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              >
                {label}
              </a>
            );
          })}
        </div>
        {/* User Profile/Actions */}
        <div className={styles.userSection}>
          {user ? (
            <>
              <div className={styles.userProfile}>
                {user.image ? (
                  <img src={user.image} alt="avatar" className={styles.avatar} />
                ) : (
                  <User size={18} />
                )}
                <span>{user.name || 'Profile'}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    style={{
                      padding: 0,
                      minWidth: 0,
                      background: 'none',
                      boxShadow: 'none',
                      border: 'none',
                    }}
                    className="!shadow-none !bg-transparent hover:!bg-[#23272f] focus:!bg-[#23272f] focus:!ring-0 focus:!outline-none"
                  >
                    <ChevronDown size={16} style={{ marginLeft: 4 }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onLogout} variant="destructive" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LogOut size={16} />Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default" size="lg" style={{ minWidth: 120, maxWidth: 160, width: 'auto' }}>
              <a href="/api/auth/signin/discord" aria-label="Login with Discord" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-3.6938-.5538-7.3896-.5538-11.0594 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.0371A19.7363 19.7363 0 0 0 3.67 4.3698a.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276c-.598.3428-1.2205.6447-1.8733.8923a.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6601a.061.061 0 0 0-.0312-.0286ZM8.02 15.3312c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189Zm7.9748 0c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" fill="currentColor"/></svg>
                <span className={hideStyles.hideOnMobile} style={{ marginLeft: 8 }}>Login with Discord</span>
              </a>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
