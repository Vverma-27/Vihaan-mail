import { create } from "zustand";
import { Email } from "../api";

interface ComposeTab {
  id: string;
  subject: string;
  body: string;
  to: string;
  minimized: boolean;
  scheduledAt?: Date;
  isExistingDraft?: boolean;
}

interface EmailStoreState {
  composeTabs: ComposeTab[];
  drafts: Email<"draft">[];
  sent: Email<"sent">[];
  filteredEmails: Email<"draft" | "sent">[] | null;
  loading: {
    drafts: boolean;
    sent: boolean;
    current: boolean;
  };
  error: string | null;
  currentEmail: Email<"draft" | "sent"> | null;

  // Core state setters (to be called by React Query)
  setDrafts: (drafts: Email<"draft">[]) => void;
  setSent: (sent: Email<"sent">[]) => void;
  setCurrentEmail: (email: Email<"draft" | "sent">) => void;
  setFilteredEmails: (emails: Email<"draft" | "sent">[] | null) => void;

  // Tab management
  getTabById: (id: string) => ComposeTab | undefined;
  addComposeTab: (options?: {
    existingDraftId?: string;
    subject?: string;
    body?: string;
    to?: string;
    scheduledAt?: Date | undefined;
  }) => void;
  removeComposeTab: (id: string) => void;
  minimizeTab: (id: string) => void;
  bringTabToFront: (id: string) => void;
  updateTabContent: (
    id: string,
    content: {
      subject?: string;
      body?: string;
      to?: string;
      scheduledAt?: Date | undefined;
    }
  ) => void;

  // Email store mutations
  addDraft: (draft: Email<"draft">) => void;
  removeDraft: (id: string) => void;
  updateDraftInStore: (draft: Email<"draft">) => void;
  addSentEmail: (email: Email<"sent">) => void;
  removeSentEmail: (id: string) => void;
}

export const useEmailStore = create<EmailStoreState>((set, get) => ({
  composeTabs: [],
  drafts: [],
  sent: [],
  filteredEmails: null,
  loading: {
    drafts: false,
    sent: false,
    current: false,
  },
  error: null,
  currentEmail: null,

  // Core state setters
  setDrafts: (drafts) => set({ drafts }),
  setSent: (sent) => set({ sent }),
  setCurrentEmail: (email) => set({ currentEmail: email }),
  setFilteredEmails: (emails) => set({ filteredEmails: emails }),

  // Tab management
  getTabById: (id) => {
    return get().composeTabs.find((tab) => tab.id === id);
  },

  addComposeTab: (options = {}) => {
    const {
      existingDraftId,
      subject = "",
      body = "",
      to = "",
      scheduledAt,
    } = options;

    const newTab: ComposeTab = {
      id: existingDraftId || `compose-${Date.now()}`,
      subject,
      body,
      to,
      minimized: false,
      scheduledAt,
      isExistingDraft: !!existingDraftId,
    };

    set((state) => ({ composeTabs: [...state.composeTabs, newTab] }));
  },

  removeComposeTab: (id) => {
    set((state) => ({
      composeTabs: state.composeTabs.filter((tab) => tab.id !== id),
    }));
  },

  minimizeTab: (id) => {
    set((state) => ({
      composeTabs: state.composeTabs.map((tab) =>
        tab.id === id ? { ...tab, minimized: !tab.minimized } : tab
      ),
    }));
  },

  bringTabToFront: (id) => {
    set((state) => {
      const tabIndex = state.composeTabs.findIndex((tab) => tab.id === id);
      if (tabIndex === -1) return state;

      const tab = state.composeTabs[tabIndex];
      const newTabs = [...state.composeTabs];
      newTabs.splice(tabIndex, 1);

      return {
        ...state,
        composeTabs: [tab, ...newTabs],
      };
    });
  },

  updateTabContent: (id, content) => {
    set((state) => ({
      composeTabs: state.composeTabs.map((tab) =>
        tab.id === id ? { ...tab, ...content } : tab
      ),
    }));
  },

  // Email store mutations
  addDraft: (draft) => {
    set((state) => ({
      drafts: [draft, ...state.drafts],
    }));
  },

  removeDraft: (id) => {
    set((state) => ({
      drafts: state.drafts.filter((draft) => draft.id !== id),
    }));
  },

  updateDraftInStore: (draft) => {
    set((state) => ({
      drafts: state.drafts.map((d) => (d.id === draft.id ? draft : d)),
    }));
  },

  addSentEmail: (email) => {
    set((state) => ({
      sent: [email, ...state.sent],
    }));
  },

  removeSentEmail: (id) => {
    set((state) => ({
      sent: state.sent.filter((email) => email.id !== id),
    }));
  },
}));
