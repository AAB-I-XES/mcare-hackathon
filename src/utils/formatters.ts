export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString();
    return `${time} · ${day}`;
  } catch {
    return dateString;
  }
};

export const formatCountdown = (milliseconds: number): string => {
  if (milliseconds <= 0) return '00:00';
  const mins = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const generateHealthId = (): string => {
  const randomSuffix1 = Math.floor(1000 + Math.random() * 9000);
  const randomSuffix2 = Math.floor(1000 + Math.random() * 9000);
  return `MC-${randomSuffix1}-${randomSuffix2}`;
};
