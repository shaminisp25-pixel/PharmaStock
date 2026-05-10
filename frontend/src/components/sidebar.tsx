'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 border-r bg-white p-6">
      <div className="space-y-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/inventory">Inventory</Link>
        <Link href="/dashboard/reports">Reports</Link>
        <Link href="/dashboard/alerts">Alerts</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </div>
    </aside>
  );
}