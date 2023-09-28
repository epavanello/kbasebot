import { create } from "zustand";

export type IUrl = {
  url: string;
  chars: number;
  trained?: boolean;
};

export type IText = {
  content: string;
  changed?: boolean;
};

export type INotion = {
  id: string;
  name: string;
  chars: number;
  trained?: boolean;
};

export type IFile = {
  id: string;
  name: string;
  chars: number;
  trained?: boolean;
};

export interface UseDocStore {
  text: IText;
  docs: IFile[];
  urls: IUrl[];
  notion: INotion[];
  setText: (text: IText) => void;
  setDocs: (docs: IFile[]) => void;
  appendDocs: (docs: IFile[]) => void;
  deleteDoc: (name: string) => void;
  deleteAllDocs: () => void;
  setDocTrained: (file: IFile) => void;
  setUrls: (urls: IUrl[]) => void;
  appendUrls: (urls: IUrl[]) => void;
  deleteUrl: (url: string) => void;
  deleteAllUrls: () => void;
  setUrlTrained: (url: IUrl) => void;
  setNotion: (notion: INotion[]) => void;
  appendNotion: (notion: INotion[]) => void;
  deleteNotion: (notion: INotion) => void;
  setNotionTrained: (notion: INotion) => void;
  deleteAllNotion: () => void;
  reset: () => void;
}

export const useDatasourceStore = create<UseDocStore>()((set) => ({
  text: { content: "", changed: false },
  docs: [],
  urls: [],
  notion: [],

  // 'Set' Methods
  setText: (text) => set(() => ({ text })),
  setDocs: (docs) => set(() => ({ docs })),
  setUrls: (urls) => set(() => ({ urls })),
  setNotion: (notion) => set(() => ({ notion })),

  // 'Append' Methods
  appendDocs: (docs) =>
    set((state) => ({
      docs: [
        ...state.docs,
        ...docs.filter(
          (newDoc) => !state.docs.find((doc) => doc.id === newDoc.id),
        ),
      ],
    })),
  appendUrls: (urls) =>
    set((state) => ({
      urls: [
        ...state.urls,
        ...urls.filter(
          (newUrl) => !state.urls.find((url) => url.url === newUrl.url),
        ),
      ],
    })),
  appendNotion: (notion) =>
    set((state) => ({
      notion: [
        ...state.notion,
        ...notion.filter(
          (newNotion) => !state.notion.find((n) => n.id === newNotion.id),
        ),
      ],
    })),

  // 'Delete' Methods
  deleteDoc: (id) => {
    set((state) => ({ docs: state.docs.filter((i) => i.id !== id) }));
  },
  deleteAllDocs: () =>
    set(() => ({
      docs: [],
    })),
  deleteUrl: (url) => {
    set((state) => ({ urls: state.urls.filter((i) => i.url !== url) }));
  },
  deleteAllUrls: () =>
    set(() => ({
      urls: [],
    })),
  deleteNotion: (notion: INotion) => {
    set((state) => ({
      notion: state.notion.filter((i) => i.id !== notion.id),
    }));
  },
  deleteAllNotion: () =>
    set(() => ({
      notion: [],
    })),

  // 'Upload' Methods
  setDocTrained: (file) => {
    set((state) => {
      const index = state.docs.findIndex((i) => i.id === file.id);
      const newDocs = [...state.docs];
      newDocs[index].trained = true;
      return { docs: newDocs };
    });
  },
  setUrlTrained: (url) => {
    set((state) => {
      const newUrls = [...state.urls];
      const index = state.urls.findIndex((i) => i === url);
      if (index !== -1) {
        newUrls[index].trained = true;
      }
      return { urls: newUrls };
    });
  },
  setNotionTrained: (notion) => {
    set((state) => {
      const newNotions = [...state.notion];
      const index = state.notion.findIndex((i) => i.id === notion.id);
      if (index !== -1) {
        newNotions[index].trained = true;
      }
      return { notion: newNotions };
    });
  },

  // 'Reset' Method
  reset: () =>
    set(() => ({
      text: {
        content: "",
        changed: false,
      },
      docs: [],
      urls: [],
      notion: [],
    })),
}));
