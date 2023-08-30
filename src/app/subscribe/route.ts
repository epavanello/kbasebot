import { Database } from "@/lib/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { cookies } from "next/headers";
import { isPaidUser } from "@/lib/supabase";
import { Plan } from "@/lib/stripe";
import {
  NEXT_PUBLIC_URL,
  STRIPE_API_KEY,
  STRIPE_PRICE_ID_BASIC,
  STRIPE_PRICE_ID_EXTRA,
} from "@/lib/env";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const userInfo = (await supabase.from("user_info").select().single())
        .data;
      if (isPaidUser(userInfo)) {
        return NextResponse.redirect(`${NEXT_PUBLIC_URL}/app`);
      }
    }

    const { searchParams } = new URL(request.url);
    const plan: Plan = searchParams.get("plan") as Plan;

    let priceID;
    switch (plan) {
      case "basic":
        priceID = STRIPE_PRICE_ID_BASIC;
        break;
      case "extra":
        priceID = STRIPE_PRICE_ID_EXTRA;
        break;
      default:
        throw new Error("Invalid plan");
    }

    const stripe = new Stripe(STRIPE_API_KEY, {
      apiVersion: "2022-11-15",
    });

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${NEXT_PUBLIC_URL}/app?payment=success&plan=${plan}`,
      cancel_url: `${NEXT_PUBLIC_URL}/app?payment=cancel&plan=${plan}`,
      line_items: [
        {
          price: priceID,
          quantity: 1,
        },
      ],

      customer_email: session?.user.email,
      subscription_data: {
        metadata: {
          client_reference_id: session?.user.id || null,
        },
      },
      mode: "subscription",
    });

    if (stripeSession.url) {
      return NextResponse.redirect(stripeSession.url);
    } else {
      throw new Error("Stripe session not valid", {
        cause: stripeSession,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
