import { NextResponse } from "next/server";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json(
      { error: { message: "Missing session_id parameter" } },
      { status: 400 }
    );
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    return NextResponse.json({
      id: session.id,
      user_id : session.metadata.user_id,
      order_id : session.metadata.order_id,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      items: lineItems.data.map((item) => ({
        id: item.id,
        price: item.price.unit_amount,
        description : item.description,
        quantity: item.quantity,
        image: item.price.product.images
      })),
      
    });
  } catch (err) {
    console.error("Error retrieving session:", err);
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 }
    );
  }
}
