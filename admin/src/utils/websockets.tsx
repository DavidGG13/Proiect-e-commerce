import io from 'socket.io-client';
import { useEffect } from 'react';

const Socket = (setSocket: any, apiURL: string) => {
  useEffect(() => {
    // Inițializăm conexiunea socket.io
    const socketRef = io(apiURL, {
      transports: ['websocket'], // Folosește WebSocket
      reconnection: true, // Activează reconectarea automată
      reconnectionAttempts: 10, // Încearcă reconectarea de 10 ori
      reconnectionDelay: 2000, // 2 secunde între încercări
      timeout: 20000, // Timeout pentru conexiune
    });

    // Setăm socket-ul în state-ul aplicației
    setSocket(socketRef);

    // Debugging pentru conexiune
    socketRef.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketRef.on('disconnect', (reason) => {
      console.warn('Disconnected:', reason);
    });

    socketRef.on('connect_error', (err) => {
      console.error('Connection Error:', err.message);
    });

    socketRef.on('reconnect_attempt', (attemptNumber) => {
      console.warn(`Reconnect attempt #${attemptNumber}`);
    });

    // Curățăm conexiunea la demontare
    return () => {
      socketRef.removeAllListeners();
      socketRef.disconnect();
    };
  }, [apiURL]); // Dependință pentru API-ul serverului
};

export const newSocket = (setSocket: any, apiURL: string) => Socket(setSocket, apiURL);