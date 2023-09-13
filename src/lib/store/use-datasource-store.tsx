import { create } from "zustand";

export type IUrl = {
  url: string;
  chars: number;
  uploaded?: boolean;
};

export type IText = {
  content: string;
  changed?: boolean;
};

export type IFile = { file: File; uploaded: boolean; path: string };

export interface UseDocStore {
  docs: IFile[];
  urls: IUrl[];
  text: IText;
  setDocs: (docs: IFile[]) => void;
  appendDocs: (docs: IFile[]) => void;
  deleteDoc: (name: string) => void;
  setDocUploaded: (file: IFile) => void;
  setText: (text: IText) => void;
  setUrls: (urls: IUrl[]) => void;
  appendUrls: (urls: IUrl[]) => void;
  setUrlUploaded: (url: IUrl) => void;
  deleteUrl: (url: string) => void;
  deleteAllUrls: () => void;
  reset: () => void;
}

export const useDatasourceStore = create<UseDocStore>()((set) => ({
  docs: [],
  text: { content: "", changed: false },
  urls: [],
  setDocs: (docs) => set(() => ({ docs })),
  appendDocs: (docs) => set((state) => ({ docs: [...state.docs, ...docs] })),
  deleteDoc: (name) => {
    set((state) => ({ docs: state.docs.filter((i) => i.file.name !== name) }));
  },
  setDocUploaded: (file) => {
    set((state) => {
      const index = state.docs.findIndex((i) => i.file.name === file.file.name);
      const newDocs = [...state.docs];
      newDocs[index].uploaded = true;
      return { docs: newDocs };
    });
  },
  setText: (text) => set(() => ({ text })),
  setUrls: (urls) => set(() => ({ urls })),
  appendUrls: (urls) => set((state) => ({ urls: [...state.urls, ...urls] })),
  setUrlUploaded: (url) => {
    set((state) => {
      const newUrls = [...state.urls];
      const index = state.urls.findIndex((i) => i === url);
      if (index !== -1) {
        newUrls[index].uploaded = true;
      }
      return { urls: newUrls };
    });
  },
  deleteUrl: (url) => {
    set((state) => ({ urls: state.urls.filter((i) => i.url !== url) }));
  },
  deleteAllUrls: () =>
    set(() => ({
      urls: [],
    })),
  reset: () =>
    set(() => ({
      docs: [],
      urls: [],
      text: {
        content: "",
        changed: false,
      },
    })),
}));
