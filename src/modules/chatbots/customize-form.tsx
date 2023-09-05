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

const FormSchema = z.object({
  display_name: z.string().min(2, {
    message: "Display Name must be at least 2 characters.",
  }),
  primary_color: z.string(),
  welcome_message: z.string(),
});

const CustomizeForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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

            <Separator className="my-2" />

            {/*  Theme - select */}

            {/*  Chatbot logo - select */}

            {/*  user message background - color */}

            {/*  chat bubble color - color */}
            {/*  chat bubble icon/logo - color */}

            {/*  chat bubble align - color */}

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
          </CardContent>

          <CardFooter>
            <Button type="submit">Update</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CustomizeForm;
