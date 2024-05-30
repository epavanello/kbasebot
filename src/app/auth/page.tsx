"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon, LoadingIcon } from "@/components/ui/icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/gotrue-js";
import { NEXT_PUBLIC_URL } from "@/lib/env";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { useRouter } from "next/navigation";
import LoadingDots from "@/components/ui/loading-dots";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/landing/logo";
import { Metadata } from "next";

const Page = ({ searchParams }) => {
  const supabase = createClientComponentClient();

  const { code } = searchParams;

  const { push } = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(!!code);

  const handleOAuth = async (provider: Provider = "google") => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${NEXT_PUBLIC_URL}/auth`,
        },
      });
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (user?.id) {
      push(`/app/`);
    }
  }, [user, code]);

  return (
    <div className="relative flex h-screen w-full items-center justify-center p-4">
      <Card className="border_run border-4 border-b-primary bg-transparent p-10">
        <CardHeader className="flex items-center justify-center">
          <Logo />
        </CardHeader>
        <CardContent className="text-center">
          <p className="my-2 text-3xl font-bold">Welcome</p>
          <small>Login/Register to create your awesome chatbot</small>
        </CardContent>
        <CardFooter className="justify-center">
          {isLoading ? (
            <LoadingDots className="!h-16 !w-16" />
          ) : (
            <Button onClick={() => handleOAuth("google")} className="w-full" variant="outline" size="lg">
              <Icon className="mr-2 text-xl" icon={"flat-color-icons:google"} />
              Login with Google
            </Button>
          )}
        </CardFooter>
      </Card>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "absolute right-4 top-4 md:right-8 md:top-8")}
      >
        Go back
      </Link>
    </div>
  );
};

export default Page;
