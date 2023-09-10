import { create } from "zustand";

type IUrl = {
  url: string,
  chars: number
}

export interface UseDocStore {
  docs: File[];
  urls: IUrl[];
  text: string;
  setDocs: (docs: File[]) => void;
  deleteDoc: (name: string) => void;
  setText: (text: string) => void;
  setUrls: (urls: IUrl[]) => void;
  deleteUrl: (url: string) => void;
  deleteAllUrls: () => void;
  reset: () => void;
}

export const useDatasourceStore = create<UseDocStore>()((set) => ({
  docs: [],
  text: "",
  urls: [],
  setDocs: (docs) => set((state) => ({ docs: [...state.docs, ...docs] })),
  deleteDoc: (name) => {
    set((state) => ({ docs: state.docs.filter((i) => i.name !== name) }));
  },
  setText: (text) => set(() => ({ text })),
  setUrls: (urls) => set((state) => ({ urls: [...state.urls, ...urls] })),
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
      urls: "",
    })),
}));
