"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/gotrue-js";

const Page = () => {
  const supabase = createClientComponentClient();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleOAuth = async (provider: Provider = "google") => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin || ""}/app`,
        },
      });
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="bg-transparent border-4 border-b-primary p-10">
        <CardHeader className="flex justify-center items-center">
          <Logo />
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-3xl font-bold my-2">Welcome</p>
          <small>Login/Register to create your awesome chatbot</small>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            onClick={() => handleOAuth("google")}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Icon className="mr-2 text-xl" icon={"flat-color-icons:google"} />
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
