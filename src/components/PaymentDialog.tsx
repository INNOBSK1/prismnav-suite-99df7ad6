import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDialog({ open, onOpenChange }: PaymentDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const BUSINESS_PHONE = "+256 XXX XXX XXX"; // Replace with your actual business number
  const SUBSCRIPTION_AMOUNT = "50,000 UGX"; // Replace with your actual amount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !user) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Store the payment request in profiles for tracking
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: phoneNumber // Store phone number temporarily for tracking
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Instructions Sent",
        description: "Please complete the payment via mobile money. Your subscription will be activated once payment is confirmed.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Complete your payment via mobile money to continue using the app
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Instructions</Label>
            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2 text-sm">
              <p className="font-medium">Send {SUBSCRIPTION_AMOUNT} to:</p>
              <p className="text-lg font-bold text-primary">{BUSINESS_PHONE}</p>
              <p className="text-muted-foreground">Via MTN Mobile Money or Airtel Money</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Your Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+256 XXX XXX XXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the phone number you're sending payment from
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "I've Sent the Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
