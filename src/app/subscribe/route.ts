import { Database } from "@/lib/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { cookies } from "next/headers";
import { getSubscription, isPaidUser } from "@/lib/supabase";
import { BillingInterval, plans } from "@/lib/stripe";
import { NEXT_PUBLIC_URL, STRIPE_API_KEY } from "@/lib/env";
import { getDevErrorMessage } from "@/lib/utils";
import { Plan } from "@/lib/permissions/plans";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { searchParams } = new URL(request.url);
    const plan: Plan = searchParams.get("plan") as Plan;
    const interval = searchParams.get("interval") as BillingInterval;

    const price = plans
      .find((p) => p.id === plan)
      ?.prices.find((p) => p.interval === interval);

    if (!price) {
      throw new Error("Price not found");
    }

    if (session) {
      const subscription = await getSubscription(supabase, session.user.id);

      if (isPaidUser(subscription) && subscription?.plan === plan) {
        return NextResponse.redirect(`${NEXT_PUBLIC_URL}/app`);
      }
    }

    const stripe = new Stripe(STRIPE_API_KEY, {
      apiVersion: "2022-11-15",
    });

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${NEXT_PUBLIC_URL}/app?payment=success&plan=${plan}`,
      cancel_url: `${NEXT_PUBLIC_URL}/pricing?payment=cancel&plan=${plan}`,
      line_items: [
        {
          price: price.priceId,
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
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: getDevErrorMessage(e, "Checkout error") },
      { status: 500 },
    );
  }
}
