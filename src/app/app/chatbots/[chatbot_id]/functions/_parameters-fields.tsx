import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  FunctionSchema,
  ParameterKeys,
  ParameterLabels,
  ParameterTypes,
} from "@/app/app/chatbots/[chatbot_id]/functions/_function-form.scema";
import { Icon } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface IParametersFields {
  form: UseFormReturn<z.infer<typeof FunctionSchema>>;
  parameterName?: string;
  parameterType?: ParameterTypes;
}
const ParametersFields: React.FC<IParametersFields> = ({ form, parameterName, parameterType }) => {
  const { fields, append, remove } = useFieldArray({
    name: "parameters",
    control: form.control,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-0 pb-4">
        <FormItem className="px-6">
          <FormControl>
            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="parameterName"
                render={({ field }) => <Input className="w-5/12" placeholder="Name" {...field} />}
              />
              <FormField
                control={form.control}
                name="parameterType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className={cn(!field.value && "text-muted-foreground", "w-5/12")}>
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
                  if (parameterName && parameterType) {
                    append({ name: parameterName, type: parameterType });
                    form.setValue("parameterName", "");
                    form.setValue("parameterType", undefined);
                    form.setFocus("parameterName");
                  }
                }}
                disabled={!parameterName || !parameterType}
              >
                Add
              </Button>
            </div>
          </FormControl>
          <FormDescription>
            The parameters values will be extracted by the chatbot and sent in the body as JSON.
          </FormDescription>
        </FormItem>

        {fields.length > 0 && (
          <>
            <Separator />

            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto px-6 py-2">
              {fields.map((field, index) => (
                <React.Fragment key={field.name}>
                  <div className="flex flex-row items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`parameters.${index}.name`}
                      render={({ field }) => <Input placeholder="Name" className="w-5/12" readOnly {...field} />}
                    />
                    <FormField
                      control={form.control}
                      name={`parameters.${index}.type`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className={cn(!field.value && "text-muted-foreground", "w-5/12")}>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ParametersFields;
