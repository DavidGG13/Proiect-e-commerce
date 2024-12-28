import io from 'socket.io-client';
import { useEffect } from 'react';

const Socket = (setSocket: any, apiURL: string) => {
  useEffect(() => {
    const socketRef = io(apiURL, {
      transports: ['websocket'],
    });
    setSocket(socketRef);
    return () => {
      socketRef.removeAllListeners();
      socketRef.disconnect();
    };
  }, []);
};

export const newSocket = (setSocket: any, apiURL: string) => Socket(setSocket, apiURL);
