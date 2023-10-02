interface ILeads {
  name?: string;
  email?: string;
  phone?: string;
  confirmation_message?: string;
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
      context +
      "\n\n" + this.searchResults({ results: knowledgeBase || "" })
    );
  },

  searchResults({ results }: { results: string }) {
    return `The search on the knowledge base for the user's request has returned the following results:\n[start]\n${
      results ? results : "No results found"
    }\n[end]`;
  },

  defaultContext({ model }: { model: string }) {
    return `You are a dedicated chatbot (named KBaseBot based on model ${model}) trained on knowledge base, resources and guidelines provided to you.
  The rules to follow are:
    - If the answer is not explicitly available in the given resources below, kindly respond with "Sorry, I'm not sure about that"
    - Provide the source links for the answer if available
    - respond to greetings
    - be gentle
    - Answer as markdown
    `;
  },
  leads: (leads: ILeads)=> {
    const isLeadsEnabled = !!(leads.name || leads.email || leads.phone)

    if(!isLeadsEnabled) return ''

    const leadsKeys = {
      name: leads.name,
      email: leads.email,
      phone: leads.phone
    }

    const askableLeadKeys = Object.keys(leadsKeys).filter(i => leadsKeys[i]).join(', ')

    return `- As first step before starting any conversation, please ask the user ${askableLeadKeys} by one 
    and when user provide all the data call 'store_lead' function.
    - and after getting the leads please give the confirmation message '${leads.confirmation_message}' 
    as it is unless there's a spelling or grammar mistake.
    `

  }
};

export { templates };
