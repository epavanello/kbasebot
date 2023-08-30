import { create } from "zustand";

export interface UseDocStore {
  docs: File[];
  url: string;
  text: string;
  setDocs: (docs: File[]) => void;
  deleteDoc: (name: string) => void;
  setText: (text: string) => void;
  setUrl: (url: string) => void;
  reset: () => void;
}

export const useDatasourceStore = create<UseDocStore>()((set) => ({
  docs: [],
  text: "",
  url: "",
  setDocs: (docs) => set((state) => ({ docs: [...state.docs, ...docs] })),
  deleteDoc: (name) => {
    set((state) => ({ docs: state.docs.filter((i) => i.name !== name) }));
  },
  setText: (text) => set(() => ({ text })),
  setUrl: (url) => set(() => ({ url })),
  reset: () =>
    set(() => ({
      docs: [],
      url: "",
    })),
}));
