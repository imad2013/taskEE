import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to the Task Manager</h2>
      <p>
        <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
      </p>
      <p>
        <Link href="/dashboard">Go to Dashboard</Link>
      </p>
    </div>
  );
} 