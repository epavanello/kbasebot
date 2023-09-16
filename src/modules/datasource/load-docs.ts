import { SupabaseClientTyped } from "@/lib/supabase";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MIMEType } from "util";
import { COMMON_MIME_TYPES } from "file-selector/src/file";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

enum IMimeType {
  pdf = "application/pdf",
  docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  csv = "text/csv",
  txt = "text/plain",
  json = "application/json",
  epub = "application/epub+zip",
}

// export const parseFiles = async (
//   files: string[],
//   supabase: SupabaseClientTyped,
// ) => {
//   return Promise.all(
//     files.map(async (fileUrl) => {
//       const { data } = await supabase.storage
//         .from("chatbots")
//         .download(fileUrl);
//
//       const loader = new PDFLoader(data!, {
//         splitPages: true,
//       });
//
//       return loader.load();
//     }),
//   );
// };

// export const parseFile = async (
//   file: string,
//   supabase: SupabaseClientTyped,
// ) => {
//   const { data, error } = await supabase.storage.from("files").download(file);
//
//   if (error) {
//     throw error;
//   }
//
//   const loader = new PDFLoader(data, {
//     splitPages: true,
//   });
//
//   return loader.loadAndSplit();
// };

const fileLoadersByExt = (file: File) => {
  return {
    [IMimeType.pdf]: () => {
      const loader = new PDFLoader(file);
      return loader.load();
    },
    [IMimeType.docx]: () => {
      const loader = new DocxLoader(file);
      return loader.load();
    },
    [IMimeType.json]: () => {
      const loader = new JSONLoader(file);
      return loader.load();
    },
    [IMimeType.txt]: () => {
      const loader = new TextLoader(file);
      return loader.load();
    },
    // [IMimeType.epub]: () => {
    //   const loader = new EPubLoader(file);
    //   return loader.load();
    // },
    [IMimeType.csv]: () => {
      const loader = new CSVLoader(file);
      return loader.load();
    },
  }[file.type];
};

export const loadFIlesByExtension = async (file: File) => {
  return fileLoadersByExt(file)();
};
