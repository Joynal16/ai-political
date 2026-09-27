'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { logout, user } from '../lib/api';

export function Nav() {
  const [me, setMe] = useState<any>(null);
  useEffect(() => setMe(user()), []);
  return <header className="nav"><div className="container nav-inner">
    <Link href="/" className="brand">PosterForge <span>AI</span></Link>
    <nav className="nav-links"><Link href="/templates">Templates</Link><Link href="/create">Create</Link><Link href="/history">History</Link>{me?.role === 'admin' && <Link href="/admin">Admin</Link>}</nav>
    <div className="nav-actions">{me ? <button className="btn" onClick={logout}>Logout</button> : <><Link className="btn" href="/login">Login</Link><Link className="btn btn-primary" href="/register">Get Started</Link></>}</div>
  </div></header>;
}
