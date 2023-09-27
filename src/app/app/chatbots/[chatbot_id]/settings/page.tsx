"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Chatbot, Conversation } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SaveButton from "@/components/ui/save-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@/lib/permissions/plans";

const Settings = () => {
  const [chatbot, setChatbot] = useState<
    (Chatbot & { conversations: Conversation[] }) | null
  >(null);
  const { supabase, subscription } = useSupabaseAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { chatbot_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [chatbotName, setChatbotName] = useState("");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("chatbots")
        .select("*, conversations(*)")
        .eq("id", chatbot_id)
        .single()
        .throwOnError();

      if (data) {
        setChatbot(data);
        setChatbotName(data.name || "");
      }

      setLoading(false);
    };
    if (chatbot_id) getData();
  }, [chatbot_id]);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateChatBot = async (values: Partial<Chatbot>) => {
    if (!chatbot || Object.keys(values).length === 0) return;
    setUpdating(true);
    try {
      await supabase
        .from("chatbots")
        .update(values)
        .eq("id", chatbot.id)
        .throwOnError();

      toast({
        variant: "default",
        title: "Updated Successfully",
      });

      setChatbot({ ...chatbot, ...values });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. please try again",
      });
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const deleteChatbot = async () => {
    setDeleting(true);
    if (!chatbot) return;
    try {
      await supabase
        .from("chatbots")
        .delete()
        .eq("id", chatbot.id)
        .throwOnError();

      toast({
        variant: "default",
        title: "Deleted Successfully",
      });

      router.push(`/app`);
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

  if (loading || !chatbot) return <LoadingIcon />;

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
            <div className=" flex flex-col relative w-full justify-start gap-2 items-start">
              <div>
                <Label htmlFor="name">Name</Label>
                <div className="flex flex-row items-end gap-2">
                  <Input
                    id="name"
                    value={chatbotName}
                    disabled={loading || updating}
                    onChange={(e) => setChatbotName(e.target.value)}
                    size={20}
                  />
                  <SaveButton
                    disabled={!chatbotName.trim()}
                    onSave={() => updateChatBot({ name: chatbotName })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <div className="flex flex-row items-end gap-2">
                  <Select
                    value={chatbot.model}
                    onValueChange={(value) => updateChatBot({ model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT 3.5</SelectItem>
                      <SelectItem
                        value="gpt-4"
                        disabled={subscription?.plan !== Plan.PRO}
                      >
                        GPT 4
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className={cn("text-xs text-muted-foreground mt-2")}>
                  GPT 4 model is only available for pro users
                </p>
              </div>
              <div>
                <Label htmlFor="id">Chatbot ID</Label>
                <div className="flex flex-row items-end gap-2">
                  <Input
                    id="id"
                    value={chatbot.id}
                    readOnly
                    className="text-xs"
                    size={33}
                  />
                  <CopyButton text={chatbot.id} />
                </div>
              </div>
              <div className=" flex relative w-full justify-start gap-2 items-center">
                <p className="text-gray-700 font-medium text-sm">Created at</p>
                <p className="rounded-lg text-gray-700 text-xs">
                  {formatDate(chatbot.created_at)}
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
