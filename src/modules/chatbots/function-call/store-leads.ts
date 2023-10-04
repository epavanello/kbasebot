import {z, ZodObject} from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const FUNC_STORE_LEAD = 'store-leads';

type SchemaFields = {
    name: boolean;
    email: boolean;
    phone: boolean;
};

const createStoreLeadZodSchema = ({ name, email, phone }: SchemaFields  = {}): ZodObject<any> => {
    const optionalString = z.string().optional();
    return z.object({
        ...(name ? { name: optionalString } : {}),
        ...(email ? { email: z.string() } : {}),
        ...(phone ? { phone: optionalString } : {}),
    });
};

export const storeLeadSchema = ({ name, email, phone }: SchemaFields  = {}) =>
    ({
        name: FUNC_STORE_LEAD,
        description: "Call the lead store function whenever a lead is found",
        parameters:zodToJsonSchema(createStoreLeadZodSchema({ name, email, phone }))
    })

// type IStoreLead = z.infer<typeof createStoreLeadZodSchema>;

export const callStoreLeads = async (leads, conversation_id, chatbot_owner_id, chatbot_id,  supabase) => {
    try {

       const {data, error} = await supabase.from('leads').insert({
            ...leads,
           conversation_id,
           chatbot_id,
           chatbot_owner_id
        });

        console.log({data, error})
    }
    catch (e) {
        console.error(e)
        throw e
    }
}

