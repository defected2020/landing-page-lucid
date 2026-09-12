import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Sun,
  Moon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/docs', label: 'Documents', icon: FileText },
  { href: '/admin/files', label: 'Files', icon: FolderOpen },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <ul className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-fast',
                active
                  ? 'bg-accent-muted text-accent'
                  : 'text-text-muted hover:bg-hover-overlay hover:text-text'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Brand({ isDark, compact = false }) {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <Image
        src={isDark ? '/images/lucid-logo-white.png' : '/images/lucid-logo.png'}
        alt="Lucid Code Labs"
        width={compact ? 72 : 90}
        height={compact ? 40 : 50}
        priority
      />
      <span className="rounded-pill border border-border px-2 py-0.5 font-display text-[0.6875rem] font-semibold uppercase tracking-wider text-text-subtle">
        Internal
      </span>
    </Link>
  );
}

export default function AdminLayout({
  user,
  storageMode,
  title,
  pageTitle,
  actions,
  children,
  wide = false,
}) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const sidebarFooter = (
    <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
      {storageMode === 'local' && (
        <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs leading-snug text-text-muted">
          <Database className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-warning" />
          <span>
            Local storage. Files live in <code className="text-text">.admin-data/</code> on this machine.
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text">{user?.name}</p>
          <p className="text-xs text-text-subtle">Signed in</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-fast hover:border-border-hover hover:text-text"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-fast hover:border-border-hover hover:text-text"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 px-1 text-xs text-text-subtle transition-colors hover:text-text"
      >
        <ExternalLink className="h-3 w-3" /> View public site
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Head>
        <title>{pageTitle || title ? `${pageTitle || title} · Lucid Internal` : 'Lucid Internal'}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col border-r border-border bg-bg-elevated px-4 py-5 lg:flex">
        <div className="mb-8 px-1">
          <Brand isDark={isDark} />
        </div>
        <NavLinks pathname={router.pathname.replace(/\/\[.*$/, '')} />
        {sidebarFooter}
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg-elevated px-4 py-3 lg:hidden">
          <Brand isDark={isDark} compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </header>
        {open && (
          <div className="flex flex-col gap-4 border-b border-border bg-bg-elevated px-4 py-4 lg:hidden">
            <NavLinks pathname={router.pathname} onNavigate={() => setOpen(false)} />
            {sidebarFooter}
          </div>
        )}

        <main className={cn('mx-auto w-full flex-1 px-4 py-6 sm:px-8 sm:py-8', wide ? 'max-w-[1400px]' : 'max-w-[1100px]')}>
          {(title || actions) && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              {title && <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>}
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
