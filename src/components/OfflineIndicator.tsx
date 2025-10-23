import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <Alert variant="destructive" className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 animate-pulse" />
        <AlertDescription>
          You're offline. Some features may not be available.
        </AlertDescription>
      </Alert>
    </div>
  );
}
