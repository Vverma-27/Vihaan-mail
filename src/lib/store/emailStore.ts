import { create } from "zustand";

interface ComposeTab {
  id: string;
  subject: string;
  body: string;
  to: string;
  minimized: boolean;
}

export interface Draft {
  id: string;
  subject: string;
  body: string;
  to: string;
  timestamp: Date;
  files?: File[];
}

export interface SentEmail {
  id: string;
  subject: string;
  body: string;
  to: string;
  timestamp: Date;
  files?: File[];
}

interface EmailStoreState {
  composeTabs: ComposeTab[];
  drafts: Draft[];
  sent: SentEmail[];
  filteredEmails: (Draft | SentEmail)[] | null;
  getTabById: (id: string) => ComposeTab | undefined;
  addComposeTab: () => void;
  closeTab: (id: string) => void;
  minimizeTab: (id: string) => void;
  bringTabToFront: (id: string) => void;
  updateSubject: (id: string, subject: string) => void;
  updateBody: (id: string, body: string) => void;
  updateRecipient: (id: string, to: string) => void;
  moveTabToDrafts: (id: string) => void;
  deleteTab: (id: string) => void;
  sendEmail: (id: string) => void;
  setFilteredEmails: (emails: (Draft | SentEmail)[] | null) => void;
  deleteDraft: (id: string) => void;
  deleteSent: (id: string) => void;
}

export const useEmailStore = create<EmailStoreState>((set, get) => ({
  composeTabs: [],
  drafts: [],
  sent: [],
  filteredEmails: null,

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
  bringTabToFront: (id: string) => {
    set((state) => {
      // Find the tab
      const tabIndex = state.composeTabs.findIndex((tab) => tab.id === id);
      if (tabIndex === -1) return state;

      // Remove the tab from its current position
      const tab = state.composeTabs[tabIndex];
      const newTabs = [...state.composeTabs];
      newTabs.splice(tabIndex, 1);

      // Add it back at the beginning (highest priority)
      return {
        ...state,
        composeTabs: [tab, ...newTabs],
      };
    });
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
    if (!tab || (!tab.subject && !tab.body && !tab.to)) return;

    const draft: Draft = {
      id: `draft-${Date.now()}`,
      subject: tab.subject,
      body: tab.body,
      to: tab.to,
      timestamp: new Date(),
      // You'd need to add file handling here if implementing attachments
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

  sendEmail: (id: string) => {
    const tab = get().getTabById(id);
    if (!tab || !tab.to || !tab.subject) return; // Basic validation

    const email: SentEmail = {
      id: `sent-${Date.now()}`,
      subject: tab.subject,
      body: tab.body,
      to: tab.to,
      timestamp: new Date(),
      // Add file handling here for attachments
    };

    set((state) => ({
      sent: [email, ...state.sent], // Add to the beginning for chronological order
      composeTabs: state.composeTabs.filter((t) => t.id !== id),
    }));
  },

  setFilteredEmails: (emails: (Draft | SentEmail)[] | null) => {
    set({ filteredEmails: emails });
  },

  deleteDraft: (id: string) => {
    set((state) => ({
      drafts: state.drafts.filter((draft) => draft.id !== id),
    }));
  },

  deleteSent: (id: string) => {
    set((state) => ({
      sent: state.sent.filter((email) => email.id !== id),
    }));
  },
}));
