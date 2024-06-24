"use client";

import React from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Icon } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/lib/store/use-user";
import LoadingDots from "@/components/ui/loading-dots";
import { ChatbotFunction } from "@/lib/supabase";
import { Database } from "@/lib/types/database.types";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { getPermissions } from "@/lib/permissions/plans";
import HeadersFields from "@/app/app/chatbots/[chatbot_id]/functions/_headers-fields";
import {
  FunctionSchema,
  ParameterKeys,
  ParameterLabels,
  ParameterTypes,
  RequestTypeEnum,
} from "@/app/app/chatbots/[chatbot_id]/functions/_function-form.scema";
import ParametersFields from "@/app/app/chatbots/[chatbot_id]/functions/_parameters-fields";

const defaultValues = {
  id: undefined,
  name: "",
  description: "",
  webhook: "",
  request_type: RequestTypeEnum.enum.GET,
  parameters: [],
  parameterName: "",
  parameterType: undefined,
  headers: [],
  headerKey: "",
  headerValue: "",
};

export default function Sources({ params }: { params: { chatbot_id: string } }) {
  const { chatbot_id } = params;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FunctionSchema>>({
    resolver: zodResolver(FunctionSchema),
    defaultValues,
    resetOptions: {
      keepDefaultValues: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepDirtyValues: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepValues: false,
    },
  });

  const formData = form.watch();

  const { supabase, subscription } = useSupabaseAuth();
  const { permission } = getPermissions(subscription);

  const queryClient = useQueryClient();

  const queryFunctions = useQuery({
    queryKey: ["functions", chatbot_id],
    queryFn: async () =>
      await supabase.from("chatbot_functions").select("*").eq("chatbot_id", chatbot_id).throwOnError(),
  });

  const addFunction = useMutation({
    mutationFn: async (func: Database["public"]["Tables"]["chatbot_functions"]["Insert"]) => {
      if (Object.keys(form.formState.errors).length > 0) {
        throw new Error("Form is invalid");
      }
      if (permission.canIntegrateWebhooks === false) {
        throw new Error("You need to upgrade to a Pro plan to use this feature");
      }
      return await supabase.from("chatbot_functions").upsert(func);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["functions", chatbot_id] });
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const deleteFunction = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("chatbot_functions").delete().eq("id", id);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["functions", chatbot_id] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const toggleFunction = useMutation({
    mutationFn: async (func: ChatbotFunction) => {
      await supabase
        .from("chatbot_functions")
        .update({
          enabled: !func.enabled,
        })
        .eq("id", func.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["functions", chatbot_id] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  function onSubmit(data: z.infer<typeof FunctionSchema>) {
    addFunction.mutate({
      id: data.id,
      chatbot_id,
      name: data.name,
      description: data.description,
      request_type: data.request_type,
      webhook: data.webhook,
      parameters: data.parameters,
      headers: data.headers,
    });
  }

  return (
    <DashboardShell className="container mx-auto max-w-4xl">
      <DashboardHeader heading="Add your Webhook functions" text="Here you can add your webhook functions" />
      <Form {...form}>
        <form className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col items-center">
            <div className="mb-2 flex w-full flex-row items-start space-x-2">
              <div className="flex w-full flex-col justify-stretch gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="flex flex-row gap-2">
                          <Input type="text" placeholder="Function name" {...field} />
                          <Button>{formData.id ? "Update" : "Add"}</Button>
                          {formData.id && (
                            <Button
                              type="button"
                              onClick={() => {
                                form.reset(defaultValues);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What does the function do?" {...field} />
                      </FormControl>
                      <FormDescription>
                        Explain what the function does and how it can be used by the chatbot.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="request_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="webhook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="https://example.com/webhook" {...field} />
                      </FormControl>
                      <FormDescription>
                        The webhook URL will be called with a POST request from the chatbot.
                        <br /> The data-auth attribute (if present) will be sent as the Authorization header.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <HeadersFields form={form} headerValue={formData.headerValue} headerKey={formData.headerKey} />
                <ParametersFields
                  form={form}
                  parameterName={formData.parameterName}
                  parameterType={formData.parameterType}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>

      <div className="max-h-[50vh] w-full overflow-auto border border-dashed p-4">
        <h1 className="my-1 font-bold">Functions ({queryFunctions.data?.data?.length || 0})</h1>
        {queryFunctions.isLoading ? (
          <div className="mt-4">
            <LoadingDots className="!h-16 !w-16" />
          </div>
        ) : (
          <Accordion type="multiple">
            {(queryFunctions.data?.data || []).map((func) => (
              <AccordionItem value={func.name} key={func.name}>
                <AccordionTrigger
                  actions={
                    <div className="absolute right-0 mr-6 flex flex-row items-center gap-2">
                      <Switch
                        onClick={(e) => {
                          toggleFunction.mutate(func);
                          e.stopPropagation();
                        }}
                        checked={func.enabled}
                      />
                    </div>
                  }
                >
                  {func.name}
                </AccordionTrigger>

                <AccordionContent>
                  <div className="flex flex-col justify-stretch gap-2 px-2">
                    <Label>Description</Label>
                    <Textarea value={func.description} readOnly />
                    <Label>Webhook URL</Label>
                    <Input type="text" value={func.webhook} readOnly />

                    <Label>Headers</Label>
                    <div className="flex flex-col gap-2">
                      {(func.headers as { key: string; value: string }[]).map((header) => (
                        <div key={header.key} className="flex flex-row gap-2">
                          <Input value={header.key} readOnly />
                          <Input value={header.value} readOnly />
                        </div>
                      ))}
                    </div>

                    <Label>Parameters</Label>
                    <div className="flex flex-col gap-2">
                      {(func.parameters as { name: string; type: ParameterTypes }[]).map((param) => (
                        <div key={param.name} className="flex flex-row gap-2">
                          <Input value={param.name} readOnly />
                          <Input value={ParameterLabels[param.type]} readOnly />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-row items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          form.reset({
                            id: func.id,
                            name: func.name,
                            description: func.description,
                            webhook: func.webhook,
                            parameters: func.parameters as { name: string; type: ParameterTypes }[],
                            headers: func.headers as { key: string; value: string }[],
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteFunction.mutate(func.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </DashboardShell>
  );
}
