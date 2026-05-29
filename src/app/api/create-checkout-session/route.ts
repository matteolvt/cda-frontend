import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { jwtDecode } from "jwt-decode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummyKeyForBuildProcess");

interface JwtPayload {
  user_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, token } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    // Extraire le user_id depuis le token JWT
    let userId = "";
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userId = decoded.user_id;
    } catch {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const line_items = items.map((item: {
      product: { name: string; image: string; price: number };
      quantity: number;
    }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/panier`,
      metadata: {
        user_id: userId,
        items: JSON.stringify(
          items.map((item: { product: { id: number }; quantity: number }) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Erreur Stripe" }, { status: 500 });
  }
}