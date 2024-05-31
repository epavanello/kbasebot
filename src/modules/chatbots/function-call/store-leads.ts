import { SupabaseClientTyped } from "@/lib/supabase";
import { z, ZodObject } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const FUNC_STORE_LEAD = "store-leads";

type SchemaFields = {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
};

export type LeadsFields = {
  name?: string;
  email?: string;
  phone?: string;
};

const createStoreLeadZodSchema = ({ name, email, phone }: SchemaFields = {}): ZodObject<any> => {
  const optionalString = z.string().optional();
  return z.object({
    ...(name ? { name: optionalString } : {}),
    ...(email ? { email: z.string() } : {}),
    ...(phone ? { phone: optionalString } : {}),
  });
};

export const storeLeadSchema = ({ name, email, phone }: SchemaFields = {}) => ({
  name: FUNC_STORE_LEAD,
  description: "Call the lead store function whenever a lead is found",
  parameters: zodToJsonSchema(createStoreLeadZodSchema({ name, email, phone })),
});

// type IStoreLead = z.infer<typeof createStoreLeadZodSchema>;

export const callStoreLeads: (
  leads: LeadsFields,
  conversation_id: string,
  chatbot_owner_id: string,
  chatbot_id: string,
  ip: string | undefined,
  supabase: SupabaseClientTyped,
) => Promise<void> = async (leads, conversation_id, chatbot_owner_id, chatbot_id, ip, supabase) => {
  try {
    await supabase
      .from("leads")
      .insert({
        ...leads,
        conversation_id,
        chatbot_id,
        chatbot_owner_id,
        ip,
      })
      .throwOnError();
  } catch (e) {
    console.error(e);
    throw e;
  }
};
