import { NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  console.log(body, 'body')
  const signature = await request.headers.get("stripe-signature");
  console.log(signature , 'signature ')
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`webhooks error : ${error}`);
    return NextResponse.json({ message: error }, { status: 500 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
   
      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful:", paymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return NextResponse.json({ received: true });
}
