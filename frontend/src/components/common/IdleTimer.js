import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const IdleTimer = ({ timeout = 900000 }) => { // 15 minutos por defecto
  const [isIdle, setIsIdle] = useState(false);
  const { idleLogout, user } = useAuth();

  useEffect(() => {
    if (!user) return; // No hacer nada si no hay usuario

    let idleTimer;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), timeout);
    };

    const events = [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove'
    ];

    events.forEach(event => {
      document.addEventListener(event, resetTimer, false);
    });

    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout, user]);

  useEffect(() => {
    if (isIdle && user) {
      idleLogout();
    }
  }, [isIdle, idleLogout, user]);

  return null;
};

export default IdleTimer;