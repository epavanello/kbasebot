import { User } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import {
  STRIPE_API_KEY,
  STRIPE_ENDPOINT_SECRET,
  STRIPE_PRICE_ID_BASIC,
  STRIPE_PRICE_ID_BASIC_YEARLY,
  STRIPE_PRICE_ID_EXTRA,
  STRIPE_PRICE_ID_EXTRA_YEARLY,
} from "@/lib/env";
import Stripe from "stripe";
import { getErrorMessage, isProduction } from "@/lib/utils";
import { BillingInterval } from "@/lib/stripe";
import { getSubscription, getUserByEmailAndSignin } from "@/lib/supabase";
import { getSupabaseClientAdmin } from "@/lib/supabase.server";
import { Plan } from "@/lib/permissions/plans";

export const dynamic = "force-dynamic";

function checkForProduction(email: string) {
  if (!isProduction) {
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
      STRIPE_ENDPOINT_SECRET,
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
        if (!customer) {
          throw new Error("Missing customer id");
        }

        checkForProduction(email);

        //await subscribeToSendgridList(email, PRIVATE_SENGRID_PAID_LIST_ID);

        let clientReferenceID: string | null = null;
        let currentPeriodStart: Date | null = null;
        let currentPeriodEnd: Date | null = null;
        let subscription: Stripe.Subscription | null = null;

        if (typeof invoice.subscription == "object") {
          subscription = invoice.subscription;
        } else if (typeof invoice.subscription == "string") {
          subscription = await stripe.subscriptions.retrieve(
            invoice.subscription,
          );
        }

        if (!subscription) {
          throw new Error("Missing subscription");
        }

        clientReferenceID = subscription.metadata?.client_reference_id;
        currentPeriodStart = new Date(subscription.current_period_start * 1000);
        currentPeriodEnd = new Date(subscription.current_period_end * 1000);

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
            `User not found: ref_id ${clientReferenceID}, email:${email}`,
          );
        }

        let plan: Plan;
        let billingInterval: BillingInterval;
        if (STRIPE_PRICE_ID_BASIC.split("|").includes(priceID)) {
          plan = Plan.BASIC;
          billingInterval = "month";
        } else if (STRIPE_PRICE_ID_EXTRA.split("|").includes(priceID)) {
          plan = Plan.PRO;
          billingInterval = "month";
        } else if (STRIPE_PRICE_ID_BASIC_YEARLY.split("|").includes(priceID)) {
          plan = Plan.BASIC;
          billingInterval = "year";
        } else if (STRIPE_PRICE_ID_EXTRA_YEARLY.split("|").includes(priceID)) {
          plan = Plan.PRO;
          billingInterval = "year";
        } else {
          throw new Error(`Invalid price id: ${priceID}`);
        }

        const actualSubscription = await getSubscription(
          supabaseClientAdmin,
          user.id
        );

        // cancel old subscription
        if (
          actualSubscription &&
          actualSubscription.subscription_id !== subscription.id
        ) {
          await stripe.subscriptions.del(actualSubscription.subscription_id);
        }

        const { error: errorUpsert } = await supabaseClientAdmin
          .from("subscriptions")
          .upsert({
            id: user.id,
            current_period_start: currentPeriodStart?.toISOString(),
            current_period_end: currentPeriodEnd?.toISOString(),
            customer_id: customer,
            plan: plan,
            subscription_id: subscription.id,
            billing_interval: billingInterval,
          });

        if (errorUpsert) {
          throw errorUpsert;
        }
        break;
      }
    }

    return NextResponse.json({ done: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}
