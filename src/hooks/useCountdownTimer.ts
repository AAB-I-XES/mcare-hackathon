import { useState, useEffect, useRef } from 'react';
import { formatCountdown } from '../utils/formatters';

export const useCountdownTimer = (expiresAtIso?: string, onExpire?: () => void) => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!expiresAtIso) {
      setTimeLeftMs(0);
      return;
    }

    const expiresAt = new Date(expiresAtIso).getTime();

    const checkTime = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeftMs(0);
        if (onExpireRef.current) {
          onExpireRef.current();
        }
      } else {
        setTimeLeftMs(remaining);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, [expiresAtIso]);

  return {
    timeLeftMs,
    formatted: formatCountdown(timeLeftMs),
    isExpired: timeLeftMs <= 0,
  };
};
