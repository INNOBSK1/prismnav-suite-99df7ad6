import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TrialStatus {
  isTrialActive: boolean;
  isPaid: boolean;
  isApproved: boolean;
  daysRemaining: number;
  trialEndDate: Date | null;
  loading: boolean;
}

export function useTrialStatus(): TrialStatus {
  const { user } = useAuth();
  const [status, setStatus] = useState<TrialStatus>({
    isTrialActive: false,
    isPaid: false,
    isApproved: false,
    daysRemaining: 0,
    trialEndDate: null,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setStatus({
        isTrialActive: false,
        isPaid: false,
        isApproved: false,
        daysRemaining: 0,
        trialEndDate: null,
        loading: false,
      });
      return;
    }

    const fetchTrialStatus = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('trial_end_date, is_paid, is_approved, subscription_end_date')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        setStatus({
          isTrialActive: false,
          isPaid: false,
          isApproved: false,
          daysRemaining: 0,
          trialEndDate: null,
          loading: false,
        });
        return;
      }

      const now = new Date();
      const trialEnd = data.trial_end_date ? new Date(data.trial_end_date) : null;
      const isTrialActive = trialEnd ? trialEnd > now : false;
      const daysRemaining = trialEnd 
        ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      setStatus({
        isTrialActive,
        isPaid: data.is_paid || false,
        daysRemaining,
        trialEndDate: trialEnd,
        loading: false,
      });
    };

    fetchTrialStatus();
  }, [user]);

  return status;
}
