"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { UploadContent } from "@/modules/chatbots/upload-content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InputNote from "@/components/ui/input-note";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
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
import { Toggle } from "@/components/ui/toggle";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { Switch } from "@/components/ui/switch";
import { getPermissions } from "@/lib/permissions/plans";

const ParameterKeys = ["string", "number", "date"] as const;
type ParameterTypes = (typeof ParameterKeys)[number];

const ParameterLabels: Record<ParameterTypes, string> = {
  string: "Text",
  number: "Number",
  date: "Date",
};

const zodParameters = z.enum(ParameterKeys).optional();

const FunctionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters long",
  }),
  webhook: z.string().url(),
  parameters: z.array(z.object({ name: z.string(), type: zodParameters })),
  parameterName: z.string().optional(),
  parameterType: zodParameters.optional(),
});

const defaultValues = {
  id: undefined,
  name: "",
  description: "",
  webhook: "",
  parameters: [],
  parameterName: "",
  parameterType: undefined,
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

  const { fields, append, remove } = useFieldArray({
    name: "parameters",
    control: form.control,
  });

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
    console.log("submitting", data, form.formState);
    addFunction.mutate({
      id: data.id,
      chatbot_id,
      name: data.name,
      description: data.description,
      webhook: data.webhook,
      parameters: data.parameters,
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
                        The data-auth attribute used to embed the chatbot will be passed as the http Authorization
                        header
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Parameters</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-2">
                      <FormField
                        control={form.control}
                        name="parameterName"
                        render={({ field }) => <Input className="max-w-[200px]" placeholder="Name" {...field} />}
                      />
                      <FormField
                        control={form.control}
                        name="parameterType"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className={cn(!field.value && "text-muted-foreground", "max-w-[200px]")}>
                                <SelectValue>{field.value ? ParameterLabels[field.value] : "Type"}</SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ParameterKeys.map((key) => (
                                <SelectItem key={key} value={key}>
                                  {ParameterLabels[key]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      <Button
                        className="whitespace-nowrap"
                        type="button"
                        onClick={() => {
                          if (formData.parameterName && formData.parameterType) {
                            append({ name: formData.parameterName, type: formData.parameterType });
                            form.setValue("parameterName", "");
                            form.setValue("parameterType", undefined);
                            form.setFocus("parameterName");
                          }
                        }}
                        disabled={!formData.parameterName || !formData.parameterType}
                      >
                        Add
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>What information should the chatbot send to the webhook?</FormDescription>
                </FormItem>

                {fields.map((field, index) => (
                  <React.Fragment key={field.name}>
                    <div className="flex flex-row items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`parameters.${index}.name`}
                        render={({ field }) => (
                          <Input placeholder="Name" className="max-w-[200px]" readOnly {...field} />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`parameters.${index}.type`}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className={cn(!field.value && "text-muted-foreground", "max-w-[200px]")}>
                                <SelectValue>{field.value ? ParameterLabels[field.value] : "Type"}</SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ParameterKeys.map((key) => (
                                <SelectItem key={key} value={key}>
                                  {ParameterLabels[key]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size={"sm"}
                        className="text-red-500"
                        onClick={() => remove(index)}
                      >
                        <Icon icon={"ph:trash"} />
                      </Button>
                    </div>
                    {index < fields.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
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
