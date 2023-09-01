"use client";

import React, { useEffect, useState } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";
import CopyButton from "@/components/ui/copy-button";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icon, LoadingIcon } from "@/components/ui/icons";
import { LOADING_ICON } from "@/components/ui/icons";
import { useSupabaseAuth } from "@/lib/store/use-user";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";

const Settings = () => {
  const [chatbot, setChatbot] = useState({});
  const { supabase } = useSupabaseAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { chatbot_id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("chatbots")
        .select("*, conversations(*)")
        .eq("id", chatbot_id)
        .single()
        .throwOnError();

      if (data) setChatbot(data);

      setLoading(false);
    };
    if (chatbot_id) getData();
  }, [chatbot_id]);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateChatBot = async (data) => {
    setUpdating(true);
    try {
      const { tone, info, audience, name } = data;
      await supabase
        .from("chatbots")
        .update({
          name,
          params: {
            tone,
            info,
            audience,
          },
        })
        .eq("id", chatbot?.id)
        .throwOnError();

      toast({
        variant: "default",
        title: "Updated Successfully",
      });

      await router.replace(`/chatbots/${chatbot?.id}/settings`);
      setUpdating(false);
    } catch (e) {
      setUpdating(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. please try again",
      });
      console.error(e);
    }
  };

  const deleteChatbot = async () => {
    setDeleting(true);
    try {
      await supabase
        .from("chatbots")
        .delete()
        .eq("id", chatbot?.id)
        .throwOnError();

      toast({
        variant: "default",
        title: "Deleted Successfully",
      });

      await router.push(`/app`);
      setDeleting(false);
    } catch (e) {
      setDeleting(false);
      toast({
        variant: "destructive",
        title: "Sorry for the inconvenience",
        description: "Internal Server Error. please try again",
      });
      console.error(e);
    }
  };

  if (loading && !chatbot) return <LoadingIcon />;

  return (
    <DashboardShell className="container gap-0 mt-10">
      <DashboardHeader
        heading={"Chatbot Settings"}
        className="flex-col md:flex-row justify-center my-4 gap-6"
      />
      <div className="flex flex-col gap-8 px-0 md:px-24 lg:px-36 mb-20">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=" flex flex-col relative w-full justify-start gap-2 items-center">
              <div className=" flex relative w-full justify-start gap-2 items-center">
                <p className="text-gray-700 font-medium text-sm">Chatbot ID</p>
                <p className="p-2 bg-muted rounded-lg text-gray-700 text-xs">
                  {chatbot.id}
                </p>
                <CopyButton text={chatbot.id} />
              </div>
              <div className=" flex relative w-full justify-start gap-2 items-center">
                <p className="text-gray-700 font-medium text-sm">Created at</p>
                <p className="p-4 rounded-lg text-gray-700 text-xs">
                  {formatDate(chatbot?.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-300">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <p>Delete your chatbot and all it&apos;s data</p>
          </CardHeader>
          <CardContent>
            <div className="">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Icon
                      icon={deleting ? LOADING_ICON : "pajamas:remove"}
                      className="mr-1"
                    />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex gap-1 items-center">
                      <Icon icon={"pajamas:remove"} className="mr-1" /> Please
                      confirm your action
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <p className="mt-2">
                        you are permanently deleting your chatbot and it can not
                        be undone
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteChatbot}
                      className={cn(buttonVariants({ variant: "destructive" }))}
                    >
                      <Icon
                        icon={deleting ? LOADING_ICON : "pajamas:remove"}
                        className="mr-1"
                      />
                      Delete Anyway
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Settings;
