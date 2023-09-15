import { Database } from "@/lib/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { cookies } from "next/headers";

import { NEXT_PUBLIC_URL, STRIPE_API_KEY } from "@/lib/env";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(`${NEXT_PUBLIC_URL}/auth`);
    }

    const subscription = (
      await supabase.from("subscriptions").select().maybeSingle().throwOnError()
    ).data;

    if (!subscription?.customer_id) {
      throw new Error("No customer ID found");
    }

    const stripe = new Stripe(STRIPE_API_KEY, {
      apiVersion: "2022-11-15",
    });

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: subscription?.customer_id,
      return_url: `${NEXT_PUBLIC_URL}/app`,
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
      { status: 500 },
    );
  }
}
