'use client';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect } from 'react';
import { connectTaskWebSocket, disconnectTaskWebSocket } from '../services/websocket';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    connectTaskWebSocket();
    return () => {
      disconnectTaskWebSocket();
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
} 