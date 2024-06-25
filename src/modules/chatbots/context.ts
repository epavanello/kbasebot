// Create an OpenAI API client (that's edge friendly!)
import { encode } from "gpt-tokenizer";
import { Chunk, SupabaseClientTyped } from "@/lib/supabase";
import { getEmbedding } from "./llm-actions";

export async function searchKnowledgeBase(search: string, chatbotId: string, supabaseAdminClient: SupabaseClientTyped) {
  // Generate a one-time embedding for the query itself
  const embedding = await getEmbedding(search, chatbotId);

  // Fetching whole documents for this simple example.
  //
  // Ideally for context injection, documents are chunked into
  // smaller sections at earlier pre-processing/embedding step.
  const { data: documents = [] } = await supabaseAdminClient
    .rpc("match_documents", {
      p_query_embedding: embedding as any,
      p_match_count: 20, // Choose the number of matches
      p_chatbot_id: chatbotId,
      p_threshold: 0.4,
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

  return documents!.filter((doc) => doc?.content).filter((doc) => counter.canAdd(doc.content));
}

export function printChunk(chunk: Chunk) {
  const content = chunk.content;
  const source = (chunk.metadata as Record<string, string>)["source"];
  const similarity = chunk.similarity;
  return `source: ${source || ""}\nsimilarity:${similarity}\ncontent: ${content.trim()}\n\n---\n`;
}

export function printKnowledgeBaseResponse(chunks: Chunk[]) {
  return chunks.map(printChunk).join("");
}

export class TokenCounter {
  private tokenCount = 0;

  constructor(private readonly limit: number) {}

  canAdd(text: string): boolean {
    this.count(text);
    return this.tokenCount <= this.limit;
  }

  count(text: string) {
    const encoded = encode(text);
    this.tokenCount += encoded.length;
  }

  reset() {
    this.tokenCount = 0;
  }

  get countedTokens() {
    return this.tokenCount;
  }
}

export const tokenLimits = {
  context: 1_000,
  knowledgeBase: 12_000,
  response: 1_000,
  historyAvailable(used: number) {
    return 16_000 - this.response - used;
  },
  // Size of the chunk for the text splitter
  chunk: 1000,
};
