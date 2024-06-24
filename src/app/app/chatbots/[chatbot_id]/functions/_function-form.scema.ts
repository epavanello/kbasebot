import { z } from "zod";

export const ParameterKeys = ["string", "number", "date"] as const;
export type ParameterTypes = (typeof ParameterKeys)[number];

export const ParameterLabels: Record<ParameterTypes, string> = {
  string: "Text",
  number: "Number",
  date: "Date",
};

const zodParameters = z.enum(ParameterKeys).optional();

export const zodHeader = z.object({
  key: z.string(),
  value: z.string(),
});

export const RequestTypeEnum = z.enum(["GET", "POST"]);

export const FunctionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters long",
  }),
  webhook: z.string().url(),
  request_type: RequestTypeEnum,
  parameters: z.array(z.object({ name: z.string(), type: zodParameters })),
  parameterName: z.string().optional(),
  parameterType: zodParameters.optional(),
  headers: z.array(zodHeader),
  headerKey: zodHeader.shape.key,
  headerValue: zodHeader.shape.value,
});
