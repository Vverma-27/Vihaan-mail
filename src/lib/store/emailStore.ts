import { create } from "zustand";

interface ComposeTab {
  id: string;
  subject: string;
  body: string;
  to: string;
  minimized: boolean;
}

interface Draft {
  id: string;
  subject: string;
  body: string;
  to: string;
  timestamp: Date;
}

interface EmailStoreState {
  composeTabs: ComposeTab[];
  drafts: Draft[];
  getTabById: (id: string) => ComposeTab | undefined;
  addComposeTab: () => void;
  closeTab: (id: string) => void;
  minimizeTab: (id: string) => void;
  updateSubject: (id: string, subject: string) => void;
  updateBody: (id: string, body: string) => void;
  updateRecipient: (id: string, to: string) => void;
  moveTabToDrafts: (id: string) => void;
  deleteTab: (id: string) => void;
}

export const useEmailStore = create<EmailStoreState>((set, get) => ({
  composeTabs: [],
  drafts: [],

  getTabById: (id: string) => {
    return get().composeTabs.find((tab) => tab.id === id);
  },

  addComposeTab: () => {
    const newTab: ComposeTab = {
      id: `compose-${Date.now()}`,
      subject: "",
      body: "",
      to: "",
      minimized: false,
    };
    set((state) => ({ composeTabs: [...state.composeTabs, newTab] }));
  },

  closeTab: (id: string) => {
    set((state) => ({
      composeTabs: state.composeTabs.filter((tab) => tab.id !== id),
    }));
  },

  minimizeTab: (id: string) => {
    set((state) => ({
      composeTabs: state.composeTabs.map((tab) =>
        tab.id === id ? { ...tab, minimized: !tab.minimized } : tab
      ),
    }));
  },

  updateSubject: (id: string, subject: string) => {
    set((state) => ({
      composeTabs: state.composeTabs.map((tab) =>
        tab.id === id ? { ...tab, subject } : tab
      ),
    }));
  },

  updateBody: (id: string, body: string) => {
    set((state) => ({
      composeTabs: state.composeTabs.map((tab) =>
        tab.id === id ? { ...tab, body } : tab
      ),
    }));
  },

  updateRecipient: (id: string, to: string) => {
    set((state) => ({
      composeTabs: state.composeTabs.map((tab) =>
        tab.id === id ? { ...tab, to } : tab
      ),
    }));
  },

  moveTabToDrafts: (id: string) => {
    const tab = get().getTabById(id);
    if (!tab) return;

    const draft: Draft = {
      id: `draft-${Date.now()}`,
      subject: tab.subject,
      body: tab.body,
      to: tab.to,
      timestamp: new Date(),
    };

    set((state) => ({
      drafts: [...state.drafts, draft],
      composeTabs: state.composeTabs.filter((t) => t.id !== id),
    }));
  },

  deleteTab: (id: string) => {
    set((state) => ({
      composeTabs: state.composeTabs.filter((tab) => tab.id !== id),
    }));
  },
}));
