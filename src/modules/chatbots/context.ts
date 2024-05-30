// Create an OpenAI API client (that's edge friendly!)
import { Configuration, CreateEmbeddingResponse, OpenAIApi } from "openai-edge";
import GPT3Tokenizer from "gpt3-tokenizer";
import { OPENAI_API_KEY } from "@/lib/env";
import { SupabaseClientTyped } from "@/lib/supabase";

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const searchKnowledgeBase = async (
  search: string,
  chatbotId: string,
  supabaseAdminClient: SupabaseClientTyped,
) => {
  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: search,
  });

  const {
    data: [{ embedding }],
  }: CreateEmbeddingResponse = await embeddingResponse.json();

  // Fetching whole documents for this simple example.
  //
  // Ideally for context injection, documents are chunked into
  // smaller sections at earlier pre-processing/embedding step.
  const { data: documents = [] } = await supabaseAdminClient
    .rpc("match_documents", {
      p_query_embedding: embedding,
      p_match_count: 10, // Choose the number of matches
      p_chatbot_id: chatbotId,
      p_threshold: 0.6,
    })
    .throwOnError();

  // # variable_conflict use_column
  //   BEGIN
  //   RETURN query
  //   SELECT
  //   id,
  //       content,
  //       metadata,
  //       embedding,
  //   1 -(documents.embedding <=> query_embedding) AS similarity
  //   FROM
  //   documents
  //   where documents.chatbot_id = chatbot_id
  //   ORDER BY
  //   documents.embedding <=> query_embedding
  //   LIMIT match_count;
  //   END;

  const counter = new TokenCounter(tokenLimits.knowledgeBase);
  let contextText = "";

  // Concat matched documents
  for (let i = 0; documents && i < documents.length; i++) {
    const document = documents[i];
    if (document?.content) {
      const content = document?.content;
      const source = (document?.metadata as Record<string, string>)["source"];
      const similarity = document.similarity;

      const chunk = `source: ${source || ""}\nsimilarity:${similarity}\ncontent: ${content.trim()}\n\n---\n`;

      if (!counter.canAdd(chunk)) {
        break;
      }

      contextText += chunk;
    }
  }

  return contextText;
};

export class TokenCounter {
  private tokenCount = 0;
  private tokenizer = new GPT3Tokenizer({ type: "gpt3" });

  constructor(private readonly limit: number) {}

  canAdd(text: string): boolean {
    this.count(text);
    return this.tokenCount <= this.limit;
  }

  count(text: string) {
    const encoded = this.tokenizer.encode(text);
    this.tokenCount += encoded.text.length;
  }

  reset() {
    this.tokenCount = 0;
  }

  get countedTokens() {
    return this.tokenCount;
  }
}

export const tokenLimits = {
  context: 500,
  knowledgeBase: 6_000,
  response: 1_000,
  historyAvailable(used: number) {
    return 12_000 - this.response - used;
  },
  // Size of the chunk for the text splitter
  chunk: 400,
};
