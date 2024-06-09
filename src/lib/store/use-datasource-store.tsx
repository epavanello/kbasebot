import { create } from "zustand";

export type IUrl = {
  id: string;
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

export type IQA = {
  id: string;
  question: string;
  answer: string;
  trained?: boolean;
  toSave?: boolean;
};

export interface UseDocStore {
  text?: IText;
  docs?: IFile[];
  urls?: IUrl[];
  notion?: INotion[];
  qas?: IQA[];

  setText: (text: IText) => void;
  setDocs: (docs: IFile[]) => void;
  setUrls: (urls: IUrl[]) => void;
  setNotion: (notion: INotion[]) => void;
  setQAs: (qas: IQA[]) => void;

  appendDocs: (docs: IFile[]) => void;
  appendUrls: (urls: IUrl[]) => void;
  appendNotion: (notion: INotion[]) => void;
  appendQAs: (qas: IQA[]) => void;

  deleteDoc: (name: string) => void;
  deleteUrl: (url: string) => void;
  deleteNotion: (notion: INotion) => void;
  deleteQA: (qa: IQA) => void;

  deleteAllDocs: () => void;
  deleteAllUrls: () => void;
  deleteAllNotion: () => void;
  deleteAllQA: () => void;

  setDocTrained: (file: IFile) => void;
  setUrlTrained: (url: IUrl) => void;
  setNotionTrained: (notion: INotion) => void;
  setQATrained: (qa: IQA) => void;

  updateQA: (qa: IQA) => void;

  reset: () => void;
  startLoading: () => void;
}

export const useDatasourceStore = create<UseDocStore>()((set) => ({
  text: { content: "", changed: false },
  docs: undefined,
  urls: undefined,
  notion: undefined,

  // 'Set' Methods
  setText: (text) => set(() => ({ text })),
  setDocs: (docs) => set(() => ({ docs })),
  setUrls: (urls) => set(() => ({ urls })),
  setNotion: (notion) => set(() => ({ notion })),
  setQAs: (qas) => set(() => ({ qas })),

  // 'Append' Methods
  appendDocs: (docs) =>
    set((state) => ({
      docs: [...(state.docs || []), ...docs.filter((newDoc) => !state.docs?.find((doc) => doc.id === newDoc.id))],
    })),
  appendUrls: (urls) =>
    set((state) => ({
      urls: [...(state.urls || []), ...urls.filter((newUrl) => !state.urls?.find((url) => url.url === newUrl.url))],
    })),
  appendNotion: (notion) =>
    set((state) => ({
      notion: [
        ...(state.notion || []),
        ...notion.filter((newNotion) => !state.notion?.find((n) => n.id === newNotion.id)),
      ],
    })),
  appendQAs: (qas) =>
    set((state) => ({
      qas: [...(state.qas || []), ...qas.filter((newQA) => !state.qas?.find((qa) => qa.id === newQA.id))],
    })),

  // 'Delete' Methods
  deleteDoc: (id) => {
    set((state) => ({ docs: state.docs?.filter((i) => i.id !== id) }));
  },
  deleteUrl: (url) => {
    set((state) => ({ urls: state.urls?.filter((i) => i.url !== url) }));
  },
  deleteNotion: (notion: INotion) => {
    set((state) => ({
      notion: state.notion?.filter((i) => i.id !== notion.id),
    }));
  },
  deleteQA: (qa: IQA) => {
    set((state) => ({
      qas: state.qas?.filter((i) => i.id !== qa.id),
    }));
  },

  deleteAllDocs: () =>
    set(() => ({
      docs: [],
    })),
  deleteAllUrls: () =>
    set(() => ({
      urls: [],
    })),
  deleteAllNotion: () =>
    set(() => ({
      notion: [],
    })),
  deleteAllQA: () =>
    set(() => ({
      qas: [],
    })),

  // 'Upload' Methods
  setDocTrained: (file) => {
    set((state) => {
      const index = (state.docs || []).findIndex((i) => i.id === file.id);
      const newDocs = [...(state.docs || [])];
      newDocs[index].trained = true;
      return { docs: newDocs };
    });
  },
  setUrlTrained: (url) => {
    set((state) => {
      const newUrls = [...(state.urls || [])];
      const index = (state.urls || []).findIndex((i) => i === url);
      if (index !== -1) {
        newUrls[index].trained = true;
      }
      return { urls: newUrls };
    });
  },
  setNotionTrained: (notion) => {
    set((state) => {
      const newNotions = [...(state.notion || [])];
      const index = (state.notion || []).findIndex((i) => i.id === notion.id);
      if (index !== -1) {
        newNotions[index].trained = true;
      }
      return { notion: newNotions };
    });
  },
  setQATrained: (qa) => {
    set((state) => {
      const newQAs = [...(state.qas || [])];
      const index = (state.qas || []).findIndex((i) => i.id === qa.id);
      if (index !== -1) {
        newQAs[index].trained = true;
      }
      return { qas: newQAs };
    });
  },
  updateQA: (qa) => {
    set((state) => {
      const newQAs = [...(state.qas || [])];
      const index = (state.qas || []).findIndex((i) => i.id === qa.id);
      if (index !== -1) {
        newQAs[index] = qa;
      }
      return { qas: newQAs };
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
  startLoading: () =>
    set(() => ({
      text: undefined,
      docs: undefined,
      urls: undefined,
      notion: undefined,
    })),
}));
