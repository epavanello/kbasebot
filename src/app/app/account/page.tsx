"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/layouts/user-avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useSupabaseAuth } from "@/lib/store/use-user";
import Link from "next/link";
import { getPermissions } from "@/lib/permissions/plans";
import { useChatbots } from "@/lib/hooks/use-chatbots";
import { countMonthlyConversationUsage } from "@/lib/supabase";

const Page = () => {
  const { subscription, plan, user, supabase } = useSupabaseAuth();
  const { permission } = getPermissions(subscription);
  const { chatbots } = useChatbots();
  const [messagesCount, setMessagesCount] = useState(0);

  const { email } = user || {};
  const { avatar_url, full_name } = user?.user_metadata || {};

  useEffect(() => {
    if (supabase && user) {
      countMonthlyConversationUsage(supabase, user.id).then(setMessagesCount);
    }
  }, [supabase, user]);

  return (
    <DashboardShell className="container gap-0 mt-4">
      <DashboardHeader
        heading={"Accounts"}
        text="Manage your account here"
      ></DashboardHeader>

      <div className="flex flex-col gap-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>
              You are currently on the {plan} plan
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div>
              {/*{subscription?.cancel_at_period_end &&*/}
              {/*    !!subscription?.cancel_at && (*/}
              {/*        <p>*/}
              {/*          Your subscription is cancelled, your credits will remain till{" "}*/}
              {/*          <strong>*/}
              {/*            {new Date(subscription?.cancel_at).toLocaleDateString()}*/}
              {/*          </strong>*/}
              {/*        </p>*/}
              {/*    )}*/}
            </div>

            <div className="mb-4 text-xl font-semibold text-zinc-600">
              {/*{isLoading ? (*/}
              {/*    <div className="h-12 mb-6">*/}
              {/*      <LoadingIcon className="w-4 h-4 ml-2 animate-spin" />*/}
              {/*    </div>*/}
              {/*) : subscription ? (*/}
              {/*    `${subscriptionPrice}/${subscription?.stripe_prices?.interval}`*/}
              {/*) : (*/}
              {/*    <Link*/}
              {/*        className={cn(*/}
              {/*            buttonVariants({ variant: "default", size: "lg" })*/}
              {/*        )}*/}
              {/*        href="/app/account/plan"*/}
              {/*    >*/}
              {/*      Choose your plan*/}
              {/*    </Link>*/}
              {/*)}*/}
            </div>

            {/*{subscription?.status === "active" && (*/}
            {/*    <div className="text-sm">*/}
            {/*      {!subscription?.cancel_at_period_end && (*/}
            {/*          <p className="my-2">*/}
            {/*            Next Renewal:*/}
            {/*            <span className="ml-1 font-medium">*/}
            {/*            {new Date(*/}
            {/*                subscription?.current_period_end*/}
            {/*            ).toLocaleDateString()}*/}
            {/*          </span>*/}
            {/*          </p>*/}
            {/*      )}*/}
            {/*    </div>*/}
            {/*)}*/}
          </CardContent>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 mr-4 sm:pb-0">
                Manage your subscription on Stripe.
              </p>
              {subscription ? (
                <Link className={buttonVariants({})} href="/app/subscription">
                  Open customer portal
                </Link>
              ) : (
                <Link className={buttonVariants({})} href="/pricing">
                  Select a plan
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>

          <CardContent>
            Usage
            <div className="text-sm font-semibold text-gray-600 ">
              Chatbot created: {chatbots.length} / {permission.maxChatbots}
            </div>
            <div className="text-sm font-semibold text-gray-600 ">
              Messages/month: {messagesCount} / {permission.maxMessages}
            </div>
          </CardContent>
          <CardContent>
            <div className="flex items-center">
              <UserAvatar
                avatar_url={avatar_url}
                full_name={full_name || "@"}
              />
              <div className="flex flex-col mr-1">
                <span className="font-bold">{full_name}</span>
                <span className="text-sm">{email}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="text-lg font-medium text-gray-600">
              {/*<p>{userDetails?.full_name}</p>*/}
              {/*<p>{user?.email}</p>*/}
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Account</CardTitle>
          </CardHeader>

          <CardContent>
            <Alert variant="destructive">
              <InfoCircledIcon className="w-4 h-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                This action will delete your account all it&apos;s data.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter>
            <Button
              variant={"destructive"}
              // loading={loading}
              disabled={true}
              // onClick={redirectToCustomerPortal}
            >
              Delete your account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Page;
