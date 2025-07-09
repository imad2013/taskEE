'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call register API
    alert('Register not implemented');
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
      <h2>Register</h2>
      <div>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Register</button>
    </form>
  );
} 