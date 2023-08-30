import React from "react";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/layouts/user-avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingIcon } from "@/components/ui/icons";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const Page = () => {
  return (
    <DashboardShell className="container gap-0 mt-4">
      <DashboardHeader
        heading={"Accounts"}
        text="Manage your account here"
        className="flex-col md:flex-row"
      ></DashboardHeader>

      <div className="flex flex-col gap-10 max-w-4xl mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>
              {" "}
              Your Plan
              {/*{subscription?.stripe_prices?.stripe_products?.name && (*/}
              {/*    <>*/}
              {/*      <p>You are currently on the </p>*/}
              {/*      <p className="text-lg font-bold">*/}
              {/*        {subscription?.stripe_prices?.stripe_products?.name} plan.*/}
              {/*      </p>*/}
              {/*    </>*/}
              {/*)}*/}
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
              <Button
              // variant={loading || !subscription ? "outline" : "default"}
              // loading={loading}
              // disabled={loading || !subscription}
              // onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>

          <CardContent>
            Usage
            {/*<div className="text-sm font-semibold text-gray-600 ">*/}
            {/*  Websites created: {subscriptionDetails?.numberOfWebsite} /{" "}*/}
            {/*  {subscriptionDetails?.numberOfSitesAllowed}*/}
            {/*</div>*/}
            {/*{subscriptionDetails?.numberOfDomainsAllowed && (*/}
            {/*    <div className="text-sm font-semibold text-gray-600 ">*/}
            {/*      Custom domains registered: {subscriptionDetails?.numberOfDomains}{" "}*/}
            {/*      / {subscriptionDetails?.numberOfDomainsAllowed}*/}
            {/*    </div>*/}
            {/*)}*/}
          </CardContent>
          <CardContent>
            <UserAvatar
              className="w-16 h-16 mt-2 shadow-xl"
              // avatar_url={userDetails?.avatar_url}
              full_name={"@Name"}
            />
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
            <Alert variant="warning">
              <InfoCircledIcon className="w-4 h-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                This action will delete your account all it's data.
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
