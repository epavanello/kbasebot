// Create an OpenAI API client (that's edge friendly!)
import { Configuration, CreateEmbeddingResponse, OpenAIApi } from "openai-edge";
import GPT3Tokenizer from "gpt3-tokenizer";
import { OPENAI_API_KEY } from "@/lib/env";
import { SupabaseClientTyped } from "@/lib/supabase";

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const getContext = async (
  input: string,
  chatbotId: string,
  supabaseAdminClient: SupabaseClientTyped,
) => {
  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input,
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

  const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
  let tokenCount = 0;
  let contextText = "";

  // Concat matched documents
  for (let i = 0; documents && i < documents.length; i++) {
    const document = documents[i];
    if (document?.content) {
      const content = document?.content;
      const source = (document?.metadata as Record<string, string>)["source"];
      const similarity = document.similarity;
      const encoded = tokenizer.encode(content);
      tokenCount += encoded.text.length;

      // Limit context to max 1500 tokens (configurable)
      if (tokenCount > 1500) {
        break;
      }

      contextText += `source: ${
        source || ""
      }\nsimilarity:${similarity}\ncontent: ${content.trim()}\n\n---\n`;
    }
  }

  return contextText;
};
