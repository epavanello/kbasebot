import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { FunctionSchema } from "@/app/app/chatbots/[chatbot_id]/functions/_function-form.scema";
import { Icon } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IHeadersFields {
  form: UseFormReturn<z.infer<typeof FunctionSchema>>;
  headerValue: string;
  headerKey: string;
}
const HeadersFields: React.FC<IHeadersFields> = ({ form, headerKey, headerValue }) => {
  const { fields, append, remove } = useFieldArray({
    name: "headers",
    control: form.control,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Headers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <FormItem>
          <FormControl>
            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="headerKey"
                render={({ field }) => <Input className="w-3/5" placeholder="Key" {...field} />}
              />

              <FormField
                control={form.control}
                name="headerValue"
                render={({ field }) => <Input className="" placeholder="Value" {...field} />}
              />

              <Button
                className="whitespace-nowrap"
                type="button"
                onClick={() => {
                  if (headerKey && headerValue) {
                    append({ key: headerKey, value: headerValue });
                    form.setValue("headerKey", "");
                    form.setValue("headerValue", "");
                    form.setFocus("headerKey");
                  }
                }}
                disabled={!headerKey || !headerValue}
              >
                Add
              </Button>
            </div>
          </FormControl>
          <FormDescription>The headers defined here will be sent with request headers</FormDescription>
        </FormItem>

        <Separator />

        <div className="flex max-h-48 flex-col gap-2 overflow-y-scroll">
          {fields.map((field, index) => (
            <React.Fragment key={field.key}>
              <div className="flex flex-row items-center gap-2">
                <FormField
                  control={form.control}
                  name={`headers.${index}.key`}
                  render={({ field }) => <Input placeholder="Key" className="w-3/5" readOnly {...field} />}
                />

                <FormField
                  control={form.control}
                  name={`headers.${index}.value`}
                  render={({ field }) => <Input placeholder="Value" className="" readOnly {...field} />}
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
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadersFields;
