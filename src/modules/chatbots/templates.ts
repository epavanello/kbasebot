import { map } from "zod";

export interface ILeads {
  name: boolean;
  email: boolean;
  phone: boolean;
  confirmation_message: string;
}

const templates = {
  basic({
    knowledgeBase,
    context,
  }: {
    knowledgeBase?: string;
    context: string;
  }) {
    return (
      context + "\n\n" + this.searchResults({ results: knowledgeBase || "" })
    );
  },

  searchResults({ results }: { results: string }) {
    return `The search on the knowledge base for the user's request has returned the following results:\n[start]\n${
      results ? results : "No results found"
    }\n[end]`;
  },

  defaultContext({ model }: { model: string }) {
    return `You are a chatbot named KBaseBot (based on model ${model}) and you can search the knowledge base for the user's request.
  The rules to follow are:
    - If the answer is not explicitly available in the given resources below, kindly respond with "Sorry, I'm not sure about that"
    - Provide the source links for the answer if available
    - Answer as markdown
    `;
  },
  leads: (leads?: ILeads) => {
    const isLeadsEnabled = leads && (leads.name || leads.email || leads.phone);

    if (!isLeadsEnabled) return "";

    const leadsKeys = {
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
    };

    const askableLeadKeys = Object.entries(leadsKeys)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => `"${key}"`)
      .join(", ");

    return `Do not answer other questions, ask first to the user to provide ${askableLeadKeys} and when user provide all the data call 'store_lead' function.
${
  leads.confirmation_message
    ? `After getting the leads please give the confirmation message '${leads.confirmation_message}' as it is unless there's a spelling or grammar mistake.`
    : ""
}`;
  },
};

export { templates };
