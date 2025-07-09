import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header style={{ padding: 16, background: '#222', color: '#fff' }}>
            <h1>Task Manager Dashboard</h1>
          </header>
          <main style={{ padding: 24 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
} 