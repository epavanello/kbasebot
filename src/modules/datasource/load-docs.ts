import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const parseFile = async (files: string[], supabase) => {
  return Promise.all(
    files.map(async (fileUrl) => {
      const { data } = await supabase.storage
        .from("chatbots")
        .download(fileUrl);

      const loader = new PDFLoader(data, {
        splitPages: true,
      });

      return loader.load();
    }),
  );
};
