import { useState } from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { useLanguage } from '@/i18n/LanguageContext';
import { PaymentDialog } from './PaymentDialog';

export function TrialBanner() {
  const { isTrialActive, isPaid, daysRemaining, loading } = useTrialStatus();
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);

  if (loading || isPaid) return null;

  return (
    <>
      <Alert className="border-primary/50 bg-primary/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {isTrialActive ? `${t.trial.trialPeriod}: ${daysRemaining} ${t.trial.daysRemaining}` : t.trial.trialExpired}
        </AlertTitle>
        <AlertDescription className="mt-2 flex items-center justify-between">
          <span className="text-sm">{isTrialActive ? t.trial.upgradePrompt : t.trial.expiredPrompt}</span>
          <Button size="sm" className="ml-4" onClick={() => setShowPayment(true)}>
            <CreditCard className="mr-2 h-4 w-4" />{t.trial.upgradeNow}
          </Button>
        </AlertDescription>
      </Alert>
      <PaymentDialog open={showPayment} onOpenChange={setShowPayment} />
    </>
  );
}
