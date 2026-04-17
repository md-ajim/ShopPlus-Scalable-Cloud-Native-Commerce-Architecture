"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton({ user_id, order_id, order_items, customer_email }) {
  const [loading, setLoading] = useState(false);

  const handelCheckOut = async () => {
    setLoading(true);
    try {
      // 1. Await the Stripe instance
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // 2. Create the checkout session on your backend
      const response = await axios.post(`/api/checkout`, {
        user_id,
        order_id,
        order_items,
        customer_email,
      });

      if (!response.data || !response.data.id) {
        throw new Error("Checkout session creation failed");
      }
      
      const sessionId = response.data.id;

      // 3. Redirect to Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe Redirect Error:", error.message);
      }
    } catch (error) {
      console.log("Checkout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handelCheckOut} disabled={loading}>
      {loading ? "Processing..." : "Pay Now"}
    </Button>
  );
}