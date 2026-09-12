import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { getSessionUser, isAuthConfigured } from '../../lib/admin/auth';

export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'no-store');
  if (getSessionUser(req)) {
    const next = typeof query.next === 'string' && query.next.startsWith('/admin') ? query.next : '/admin';
    return { redirect: { destination: next, permanent: false } };
  }
  return { props: { configured: isAuthConfigured() } };
}

export default function AdminLogin({ configured }) {
  const router = useRouter();
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Login failed');
      const next = typeof router.query.next === 'string' && router.query.next.startsWith('/admin')
        ? router.query.next
        : '/admin';
      router.replace(next);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 text-text">
      <Head>
        <title>Sign in · Lucid Internal</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src={isDark ? '/images/lucid-logo-white.png' : '/images/lucid-logo.png'}
            alt="Lucid Code Labs"
            width={130}
            height={72}
            priority
          />
          <div>
            <h1 className="font-display text-xl font-bold">Lucid Internal</h1>
            <p className="text-sm text-text-muted">Team documents and planning</p>
          </div>
        </div>

        {configured ? (
          <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-border bg-bg-elevated p-6">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Name
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Password
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="mt-2 w-full">
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-6 text-sm leading-relaxed text-text-muted">
            <p className="mb-2 font-semibold text-text">Admin login is not configured.</p>
            <p>
              Set <code className="text-text">ADMIN_USERS</code> (e.g.{' '}
              <code className="text-text">george:secret,anna:secret2</code>) or{' '}
              <code className="text-text">ADMIN_PASSWORD</code> in the environment, then reload.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
