import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { tokenLimits } from "../chatbots/context";

export const loadText = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: tokenLimits.chunk * 4,
  });

  return splitter.createDocuments([text]);
};
