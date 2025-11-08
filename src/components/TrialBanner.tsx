import { AlertCircle, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTrialStatus } from '@/hooks/useTrialStatus';

export function TrialBanner() {
  const { isTrialActive, isPaid, daysRemaining, loading } = useTrialStatus();

  if (loading || isPaid) return null;

  return (
    <Alert className="border-primary/50 bg-primary/5">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {isTrialActive 
          ? `Trial Period: ${daysRemaining} days remaining`
          : 'Trial Expired'}
      </AlertTitle>
      <AlertDescription className="mt-2 flex items-center justify-between">
        <span className="text-sm">
          {isTrialActive 
            ? 'Upgrade now to continue using the app after your trial ends.'
            : 'Your trial has expired. Please upgrade to continue using the app.'}
        </span>
        <Button size="sm" className="ml-4">
          <CreditCard className="mr-2 h-4 w-4" />
          Upgrade Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}
