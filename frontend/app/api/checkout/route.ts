import { NextResponse } from "next/server";

import { Stripe } from "stripe";

export async function POST(request: Request) {
  const body = await request.json();
  const { user_id, order_id, order_items, customer_email } = body;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const host = process.env.NEXT_PUBLIC_CLIENT_URL;

  // Safety check (prevents build-time crash)
  if (!secretKey) {
    console.error("❌ STRIPE_SECRET_KEY missing");
    return NextResponse.json(
      { error: "Payment configuration missing." },
      { status: 500 }
    );
  }

  if (!host) {
    console.error("❌ NEXT_PUBLIC_CLIENT_URL missing");
    return NextResponse.json(
      { error: "Client URL missing." },
      { status: 500 }
    );
  }

  // Initialize Stripe ONLY inside the handler
  const stripe = new Stripe(secretKey);

  const line_items = order_items.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image],
        metadata: {
          id: item.id,
          quantity: item.quantity,
        },
      },
      unit_amount: parseInt(item.price, 10),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      customer_email,
      mode: "payment",
      success_url: `${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/order`,
      metadata: {
        order_id,
        user_id,
      },
    });

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (err: any) {
      console.error("Stripe error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
