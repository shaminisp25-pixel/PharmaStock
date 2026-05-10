'use client';

import { useState } from 'react';
import RoleSelector from './RoleSelector';

export default function AuthForm() {
  const [role, setRole] = useState('Admin');

  return (
    <form className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm opacity-70">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm opacity-70">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter password"
          className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 outline-none"
        />
      </div>

      <RoleSelector
        value={role}
        onChange={setRole}
      />

      <button className="w-full rounded-2xl bg-primary py-3 text-white transition-all hover:opacity-90">
        Login as {role}
      </button>
    </form>
  );
}