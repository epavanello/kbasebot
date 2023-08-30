import { User } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import {
  STRIPE_API_KEY,
  STRIPE_ENDPOINT_SECRET,
  STRIPE_PRICE_ID_BASIC,
  STRIPE_PRICE_ID_EXTRA,
} from "@/lib/env";
import Stripe from "stripe";
import { getErrorMessage } from "@/lib/utils";
import { Plan } from "@/lib/stripe";
import {
  getSupabaseClientAdmin,
  getUserByEmailAndSignin,
  handleSupabaseError,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

function checkForProduction(email: string) {
  if (process.env.NODE_ENV !== "production") {
    if (
      email !== "pavanello.emanuele@gmail.com" &&
      email !== "dev.nilooy@gmail.com"
    ) {
      throw new Error("Email not allowed in test mode");
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No signature");
    }

    const stripe = new Stripe.Stripe(STRIPE_API_KEY, {
      apiVersion: "2022-11-15",
    });

    const event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      STRIPE_ENDPOINT_SECRET
    );

    const supabaseClientAdmin = getSupabaseClientAdmin();

    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customer =
          typeof invoice.customer == "string" ? invoice.customer : null;
        const priceID = invoice.lines.data?.[0].price?.id;

        const email = invoice.customer_email?.toLowerCase();
        if (!email) {
          throw new Error("Missing email");
        }
        if (!priceID) {
          throw new Error("Missing price id");
        }

        checkForProduction(email);

        //await subscribeToSendgridList(email, PRIVATE_SENGRID_PAID_LIST_ID);

        let clientReferenceID: string | null = null;
        let currentPeriodStart: Date | null = null;
        let currentPeriodEnd: Date | null = null;
        if (typeof invoice.subscription == "string") {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          );
          clientReferenceID = subscription.metadata?.client_reference_id;
          currentPeriodStart = new Date(
            subscription.current_period_start * 1000
          );
          currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        }

        if (!clientReferenceID && !email) {
          throw new Error("Missing reference id and email");
        }

        let user: User | null = null;

        if (clientReferenceID) {
          const { data } =
            await supabaseClientAdmin.auth.admin.getUserById(clientReferenceID);
          user = data.user;
        }

        if (!user && email) {
          user = await getUserByEmailAndSignin(email, supabaseClientAdmin);
        }

        if (!user) {
          throw new Error(
            `User not found: ref_id ${clientReferenceID}, email:${email}`
          );
        }

        let plan: Plan;
        if (STRIPE_PRICE_ID_BASIC.split("|").includes(priceID)) {
          plan = "basic";
        } else if (STRIPE_PRICE_ID_EXTRA.split("|").includes(priceID)) {
          plan = "extra";
        } else {
          throw new Error(`Invalid price id: ${priceID}`);
        }

        const { error: errorUpsert } = await supabaseClientAdmin
          .from("user_info")
          .upsert({
            id: user.id,
            current_period_start: currentPeriodStart?.toISOString(),
            current_period_end: currentPeriodEnd?.toISOString(),
            customer_id: customer,
            plan: plan,
          });

        if (errorUpsert) {
          throw errorUpsert;
        }
        break;
      }
    }

    return NextResponse.json({ done: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
