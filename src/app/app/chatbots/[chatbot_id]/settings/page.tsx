"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plan } from "@/lib/permissions/plans";
import { GPTModel, GPTModels, prettifyGPTModelName } from "@/modules/chatbots/helpers";
import { Textarea } from "@/components/ui/textarea";
import InputNote from "@/components/ui/input-note";
import { templates } from "@/modules/chatbots/templates";
import ActionButton from "@/components/ui/action-button";
import { tokenLimits } from "@/modules/chatbots/context";
import LeadsSettings from "@/app/app/chatbots/[chatbot_id]/settings/leads-settings";

const Settings = () => {
  const [chatbot, setChatbot] = useState<(Chatbot & { conversations: Conversation[] }) | null>(null);
  const { supabase, subscription } = useSupabaseAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { chatbot_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [chatbotName, setChatbotName] = useState("");
  const [context, setContext] = useState("");
  const basicContext = useMemo(
    () =>
      templates.defaultContext({
        model: prettifyGPTModelName(chatbot?.model || ""),
      }),
    [chatbot?.model],
  );

  // Load chatbot
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
        setContext(data.custom_context);
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
      await supabase.from("chatbots").update(values).eq("id", chatbot.id).throwOnError();

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
      await supabase.from("chatbots").delete().eq("id", chatbot.id).throwOnError();

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
    <DashboardShell className="container max-w-xl">
      <DashboardHeader heading={"Settings"} />
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex w-full flex-col items-start justify-start gap-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <div className="flex flex-row items-start gap-2">
                  <Input
                    id="name"
                    value={chatbotName}
                    disabled={loading || updating}
                    onChange={(e) => setChatbotName(e.target.value)}
                    size={20}
                  />
                  <ActionButton
                    icon="ion:save-outline"
                    disabled={!chatbotName.trim() || chatbotName === chatbot.name}
                    onClick={() => updateChatBot({ name: chatbotName })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <div className="flex flex-row items-start gap-2">
                  <Select
                    value={GPTModels.includes(chatbot.model as GPTModel) ? chatbot.model : GPTModel.GPT_3}
                    onValueChange={(value) => updateChatBot({ model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GPTModel.GPT_3}>{prettifyGPTModelName(GPTModel.GPT_3)}</SelectItem>
                      <SelectItem value={GPTModel.GPT_4} disabled={subscription?.plan !== Plan.PRO}>
                        {prettifyGPTModelName(GPTModel.GPT_4)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className={cn("mt-2 text-xs text-muted-foreground")}>GPT-4 model is only available for pro users</p>
              </div>
              <div>
                <Label htmlFor="context">Context</Label>
                <div className="flex flex-row items-start gap-2">
                  <div className="relative">
                    <Textarea
                      id="context"
                      maxLength={tokenLimits.context * 4}
                      className="text-xs"
                      onFocus={(e) => {
                        if (context === "") {
                          setContext(basicContext);
                        }
                      }}
                      onBlur={() => {
                        if (context === basicContext) {
                          setContext("");
                        }
                      }}
                      rows={10}
                      cols={60}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder={basicContext}
                      value={context}
                    />
                    <InputNote>
                      {context.length}/{tokenLimits.context * 4}
                      {" chars"}
                    </InputNote>
                  </div>
                  <div className="flex flex-col">
                    <ActionButton
                      icon="ion:save-outline"
                      disabled={
                        context === chatbot.custom_context || (!chatbot.custom_context && context === basicContext)
                      }
                      onClick={() => updateChatBot({ custom_context: context })}
                    />
                    <ActionButton
                      icon="carbon:reset"
                      disabled={!context}
                      onClick={() => {
                        setContext("");
                        updateChatBot({ custom_context: "" });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="id">Chatbot ID</Label>
                <div className="flex flex-row items-start gap-2">
                  <Input id="id" value={chatbot.id} readOnly className="text-xs" size={33} />
                  <CopyButton text={chatbot.id} />
                </div>
              </div>
              <div className="relative flex w-full items-center justify-start gap-2">
                <p className="text-sm font-medium text-gray-700">Created at</p>
                <p className="rounded-lg text-xs text-gray-700">{formatDate(chatbot.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <LeadsSettings />

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
                    <Icon icon={deleting ? LOADING_ICON : "pajamas:remove"} className="mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-1">
                      <Icon icon={"pajamas:remove"} className="mr-1" /> Please confirm your action
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <p className="mt-2">you are permanently deleting your chatbot and it can not be undone</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteChatbot}
                      className={cn(buttonVariants({ variant: "destructive" }))}
                    >
                      <Icon icon={deleting ? LOADING_ICON : "pajamas:remove"} className="mr-1" />
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
