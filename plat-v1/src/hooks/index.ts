import { useState, useEffect } from 'react';

export function useCountDown(interval = 1000): [number, (t: number) => void] {
  const [time, setTime] = useState(0);
  const active = (t: number) => {
    setTime(t);
  };
  useEffect(() => {
    if (time <= 0) {
      return;
    }
    const t = setTimeout(() => {
      setTime(time - 1);
    }, interval);
    return () => clearTimeout(t);
  }, [time]);
  return [time, active];
}

import { postCode } from '@/services/core';
export function usePostCode(get: () => string, type: string = 'sms') {
  const [cd, active] = useCountDown();
  const send = async () => {
    const to = get();
    if (!to) {
      return;
    }
    const { code } = await postCode({ type, to });
    if (code === 0) {
      active(60);
    }
  };
  return [cd, send];
}
