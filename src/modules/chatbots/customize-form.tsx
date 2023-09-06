"use client";
import { useSupabaseAuth } from "@/lib/store/use-user";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ColorPicker from "@/components/pickers/color.picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Creatable from "react-select/creatable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PublicChatUi from "@/modules/chatbots/chat-ui/public-chat-ui";
import ImagePicker from "@/components/pickers/image.picker";
import TabRadio from "@/components/ui/tab-radio";

const FormSchema = z.object({
  display_name: z
    .string()
    .min(3, {
      message: "Display Name must be at least 3 characters.",
    })
    .optional(),
  welcome_message: z.string().optional(),
  suggested_message: z.array(z.string()).optional().nullable(),
  // theme: z.string().optional().nullable(),
  primary_color: z.string().optional(),
  chatbot_logo: z.string().optional().nullable(),
  chatbot_bubble_logo: z.string().optional().nullable(),
  chatbot_bubble_align: z.string().optional().nullable(),
});

const CustomizeForm = ({ chatbotId, settings }) => {
  const { supabase, user } = useSupabaseAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...settings,
    },
  });

  const { formState } = form;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await supabase
        .from("chatbot_settings")
        .upsert(
          {
            chatbot_id: chatbotId,
            user_id: user?.id,
            ...data,
          },
          { onConflict: "chatbot_id" },
        )
        .throwOnError();

      toast({
        title: "Updated Successfully",
        description: "",
      });
    } catch (e) {
      console.error(e);

      toast({
        title: "Something went wrong",
        description: "",
        variant: "destructive",
      });
    }
  }

  const formData = form.watch();

  console.log({ formData });

  return (
    <div className="flex gap-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2">
          <Card>
            <CardHeader>{/*<CardTitle>Add logo</CardTitle>*/}</CardHeader>
            <CardContent className="flex gap-4 flex-col h-[70vh] overflow-y-scroll">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. Dr. Knowledge" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="welcome_message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="eg: Hi there! How can i help?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This message will greet user to start chatting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*  Suggested Message - select */}
              <FormField
                control={form.control}
                name="suggested_message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Message</FormLabel>
                    <FormControl>
                      <Creatable
                        placeholder="eg. how to upgrade my plan?"
                        className="text-sm"
                        isMulti
                        onChange={(val) => {
                          field.onChange(val.map((i) => i.value));
                        }}
                        value={field.value?.map((i) => ({
                          label: i,
                          value: i,
                        }))}
                      />
                    </FormControl>
                    <FormDescription>
                      These message will be shown to your users as suggestions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-2" />
              {/*  primary color */}
              <FormField
                control={form.control}
                name="primary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <ColorPicker
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Primary color of the chatbot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*  Theme - select */}
              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name="theme"*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem>*/}
              {/*      <FormLabel>Theme</FormLabel>*/}
              {/*      <Select*/}
              {/*        onValueChange={field.onChange}*/}
              {/*        defaultValue={field.value}*/}
              {/*      >*/}
              {/*        <FormControl>*/}
              {/*          <SelectTrigger>*/}
              {/*            <SelectValue placeholder="Select a theme" />*/}
              {/*          </SelectTrigger>*/}
              {/*        </FormControl>*/}
              {/*        <SelectContent>*/}
              {/*          <SelectItem value="light">Light</SelectItem>*/}
              {/*          <SelectItem value="dark">Dark</SelectItem>*/}
              {/*        </SelectContent>*/}
              {/*      </Select>*/}
              {/*      <FormDescription>*/}
              {/*        Change Theme of your chatbot*/}
              {/*      </FormDescription>*/}
              {/*      <FormMessage />*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}

              <div className="flex gap-8">
                <div className="w-44">
                  {/*  Chatbot logo - select */}
                  <FormField
                    control={form.control}
                    name="chatbot_logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chat Logo</FormLabel>
                        <FormControl>
                          <ImagePicker {...field} />
                        </FormControl>
                        <FormDescription>
                          Logo to show on your chatbot (Only square image)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-44">
                  {/*  Chatbot bubble icon/logo - select */}
                  <FormField
                    control={form.control}
                    name="chatbot_bubble_logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bubble Logo</FormLabel>
                        <FormControl>
                          <ImagePicker {...field} />
                        </FormControl>
                        <FormDescription>
                          This will on show in the floating chat bubble (Only
                          square image)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/*  chat bubble align - color */}

              <FormField
                control={form.control}
                name="chatbot_bubble_align"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floating Bubble Alignnment</FormLabel>
                    <FormControl>
                      <TabRadio
                        type="tabRadio"
                        showLabel
                        tabs={[
                          {
                            label: "Left",
                            value: "left",
                            icon: "material-symbols:align-horizontal-left",
                          },
                          {
                            label: "Right",
                            value: "right",
                            icon: "material-symbols:align-horizontal-right",
                          },
                        ]}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Direction of floating chat bubble
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="p-2">
              <Button
                loading={formState.isSubmitting || formState.isLoading}
                disabled={formState.isSubmitting || formState.isLoading}
                type="submit"
              >
                Update
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <div className="w-1/2 container h-[80vh] overflow-y-scroll">
        <PublicChatUi settings={formData} />
      </div>
    </div>
  );
};

export default CustomizeForm;
