import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const loadText = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter();

  return splitter.createDocuments([text]);
};
