import { useSupabaseAuth } from "@/lib/store/use-user";

("use-client");

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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

const FormSchema = z.object({
  display_name: z
    .string()
    .min(3, {
      message: "Display Name must be at least 3 characters.",
    })
    .optional(),
  welcome_message: z.string().optional(),
  suggested_message: z.array(z.string()).optional(),
  theme: z.string().optional(),
  primary_color: z.string().optional(),
  user_message_background: z.string().optional(),
});

const CustomizeForm = ({ chatbotId }) => {
  const { supabase, user } = useSupabaseAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <Card>
          <CardHeader>{/*<CardTitle>Add logo</CardTitle>*/}</CardHeader>
          <CardContent className="flex gap-4 flex-col">
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
            {/*  Theme - select */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Change Theme of your chatbot
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  Chatbot logo - select */}

            {/*  chat bubble color - color */}
            {/*  chat bubble icon/logo - color */}
            {/*  chat bubble align - color */}

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
            {/*  user message background - color */}
            <FormField
              control={form.control}
              name="user_message_background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Message Background Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Background color to show on user message
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
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
  );
};

export default CustomizeForm;
