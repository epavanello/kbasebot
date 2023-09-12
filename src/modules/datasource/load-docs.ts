import { SupabaseClientTyped } from "@/lib/supabase";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const parseFiles = async (
  files: string[],
  supabase: SupabaseClientTyped,
) => {
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

export const parseFile = async (
  file: string,
  supabase: SupabaseClientTyped,
) => {
  const { data, error } = await supabase.storage
    .from("chatbots")
    .download(file);


  if (error) {
    throw error;
  }

  const loader = new PDFLoader(data, {
    splitPages: true,
  });

  return loader.loadAndSplit();
};
