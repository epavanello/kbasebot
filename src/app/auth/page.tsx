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
import { cn, getErrorMessage } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/landing/logo";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Page = ({ searchParams }) => {
  const supabase = createClientComponentClient();

  const { code } = searchParams;

  const { push } = useRouter();
  const [email, setEmail] = React.useState("");
  const { toast } = useToast();

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

  const handleMagicLink = async (email: string) => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${NEXT_PUBLIC_URL}/auth`,
        },
      });
      console.log("Magic link sent");
      toast({
        title: "Success",
        description: "Check your email for the magic link",
        variant: "default",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: getErrorMessage(e),
        variant: "destructive",
      });
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
            <div className="flex w-full flex-col space-y-4">
              <Button onClick={() => handleOAuth("google")} className="w-full" variant="outline" size="lg">
                <Icon className="mr-2 text-xl" icon={"flat-color-icons:google"} />
                Login with Google
              </Button>
              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t"></div>
                <span className="mx-4 flex-shrink text-xs">Or</span>
                <div className="flex-grow border-t"></div>
              </div>
              <Input
                className="w-full"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleMagicLink(email)}
                disabled={!email || !email.includes("@")}
              >
                Login with Magic link
              </Button>
            </div>
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
