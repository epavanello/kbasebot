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
    - Answer as markdown`;
  },
};

export { templates };
