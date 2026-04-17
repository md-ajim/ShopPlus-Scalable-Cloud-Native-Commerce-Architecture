// components/stripe-provider.js
'use client';

import { loadStripe } from '@stripe/stripe-js';

import { createContext, useContext, useEffect, useState } from 'react';

const StripeContext = createContext(null);

export function StripeProvider({ children }) {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripe);
    };

    initializeStripe();
  }, []);

  return (
    <StripeContext.Provider value={stripePromise}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}