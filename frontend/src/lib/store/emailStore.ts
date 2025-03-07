import { create } from "zustand";
import emailApi, { Email } from "../api";
import { toast } from "sonner";

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

  // Methods
  getTabById: (id: string) => ComposeTab | undefined;
  addComposeTab: (options?: {
    existingDraftId?: string;
    subject?: string;
    body?: string;
    to?: string;
    scheduledAt?: Date | undefined;
  }) => void;
  closeTab: (id: string, hasChanged: boolean) => void;
  updateDraft: (
    id: string,
    content: {
      subject?: string;
      body?: string;
      to?: string;
      scheduledAt?: Date | undefined;
    }
  ) => void;
  minimizeTab: (id: string) => void;
  bringTabToFront: (id: string) => void;
  updateSubject: (id: string, subject: string) => void;
  updateBody: (id: string, body: string) => void;
  updateRecipient: (id: string, to: string) => void;
  updateScheduledTime: (id: string, scheduledAt: Date | undefined) => void;
  moveTabToDrafts: (id: string, hasChanged: boolean) => void;
  deleteTab: (id: string) => void;
  sendEmail: (id: string) => Promise<void>;
  setFilteredEmails: (emails: Email<"draft" | "sent">[] | null) => void;
  deleteMail: (id: string, isDraft?: boolean) => Promise<void>;
  fetchDrafts: () => Promise<void>;
  fetchSent: () => Promise<void>;
  currentEmail: Email<"draft" | "sent"> | null;
  fetchEmailById: (
    id: string,
    type: "draft" | "sent"
  ) => Promise<Email<"draft" | "sent">>;
}

// Helper to convert API data to our internal format
const convertApiEmail = <T extends "draft" | "sent">(
  email: Email<T>
): Email<T> => ({
  ...email,
  id: `${email.id}`,
  type: email.type as T,
  createdAt: new Date(email.createdAt).toISOString(),
});

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

  getTabById: (id: string) => {
    return get().composeTabs.find((tab) => tab.id === id);
  },
  currentEmail: null,
  fetchEmailById: async (id: string, type: "draft" | "sent") => {
    try {
      set({ loading: { ...get().loading, current: true } });

      const email = await emailApi.getEmailById(id, type);

      set({
        currentEmail: email,
        loading: { ...get().loading, current: false },
      });

      return email;
    } catch (error) {
      console.error(`Error fetching email with id ${id}:`, error);
      set({
        error: `Failed to fetch email with id ${id}`,
        loading: { ...get().loading, current: false },
      });
      throw error;
    }
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
      isExistingDraft: !!existingDraftId,
    };

    set((state) => ({ composeTabs: [...state.composeTabs, newTab] }));
  },

  bringTabToFront: (id: string) => {
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

  closeTab: (id: string, hasChanged: boolean) => {
    const tab = get().getTabById(id);
    if (!tab) return;

    if (hasChanged && tab.isExistingDraft) {
      get().updateDraft(id, {
        subject: tab.subject,
        body: tab.body,
        to: tab.to,
        scheduledAt: tab.scheduledAt,
      });
      return;
    }

    // Check if there's content to save as draft
    const hasContent = tab.subject || tab.body || tab.to;

    // If there's no content, just remove the tab
    if (!hasContent) {
      set((state) => ({
        composeTabs: state.composeTabs.filter((t) => t.id !== id),
      }));
      return;
    }

    set((state) => ({
      composeTabs: state.composeTabs.filter((t) => t.id !== id),
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

  updateScheduledTime: (id: string, scheduledAt: Date | undefined) => {
    set((state) => ({
      composeTabs: state.composeTabs.map((tab) =>
        tab.id === id ? { ...tab, scheduledAt } : tab
      ),
    }));
  },

  updateDraft: async (
    id: string,
    content: {
      subject?: string;
      body?: string;
      to?: string;
      scheduledAt?: Date;
    }
  ) => {
    try {
      // Get the current tab
      const tab = get().getTabById(id);
      if (!tab || !tab.isExistingDraft) return;
      if (!content.subject && !content.body && !content.to) {
        get().deleteMail(id, true);
        return;
      }
      // Call API to update the draft
      const response = await emailApi.updateDraft(id, {
        subject: content.subject || "",
        body: content.body || "",
        to: content.to || "",
        scheduledAt: content.scheduledAt || null,
      });

      // Convert API response to our format
      const draftAPI = convertApiEmail<"draft">(response.email);

      // Update our local state
      set((state) => ({
        drafts: state.drafts.map((draft) =>
          draft.id === id ? draftAPI : draft
        ),
        composeTabs: state.composeTabs.filter((t) => t.id !== id),
      }));

      toast.success("Draft updated successfully");
    } catch (error) {
      console.error("Error updating draft:", error);
      toast.error("Failed to update draft");
    }
  },

  moveTabToDrafts: async (id: string, hasChanged: boolean) => {
    const tab = get().getTabById(id);
    if (!tab || (!tab.subject && !tab.body && !tab.to)) return;
    // If it's an existing draft, check for changes and update if needed
    if (hasChanged && tab.isExistingDraft) {
      get().updateDraft(id, {
        subject: tab.subject,
        body: tab.body,
        to: tab.to,
        scheduledAt: tab.scheduledAt,
      });
      return;
    }

    try {
      // Save to API first
      const response = await emailApi.saveDraft({
        subject: tab.subject,
        body: tab.body,
        to: tab.to,
        type: "draft",
      });

      // Convert API response to our format
      const draft = convertApiEmail<"draft">(response.email);

      // Update local state
      set((state) => ({
        drafts: [draft, ...state.drafts],
        composeTabs: state.composeTabs.filter((t) => t.id !== id),
      }));

      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error("Error saving draft:", error);
    }
  },

  deleteTab: (id: string) => {
    const tab = get().getTabById(id);
    if (!tab) return;

    // If it's an existing draft, delete it from the backend as well
    if (tab.isExistingDraft) {
      get().deleteMail(id, true);
    }

    // Remove the tab from state
    set((state) => ({
      composeTabs: state.composeTabs.filter((tab) => tab.id !== id),
    }));
  },

  sendEmail: async (id: string) => {
    const tab = get().getTabById(id);
    if (!tab || !tab.to) return;

    try {
      // Create the request payload
      const emailData = {
        to: tab.to,
        subject: tab.subject,
        body: tab.body,
        scheduleAt: tab.scheduledAt,
      };

      // Check if this is an existing draft
      const isExistingDraft = tab.isExistingDraft;
      const draftId = isExistingDraft ? id : undefined;

      // Send the email
      const response = await emailApi.sendEmail({
        ...emailData,
        // If this is a draft, include the draft ID so the backend knows to delete it
        draftId,
      });

      // Convert API response to our format
      const sentMail = convertApiEmail<"sent">(response.email);

      // Update local state
      set((state) => ({
        // Add the new email to sent list
        sent: [sentMail, ...state.sent],
        // Remove the compose tab
        composeTabs: state.composeTabs.filter((t) => t.id !== id),
        // If it was an existing draft, remove from drafts list too
        drafts: isExistingDraft
          ? state.drafts.filter((draft) => draft.id !== id)
          : state.drafts,
      }));
    } catch (error) {
      toast.error("Failed to send email");
      console.error("Error sending email:", error);
    }
  },

  setFilteredEmails: (emails: Email<"draft" | "sent">[] | null) => {
    set({ filteredEmails: emails });
  },

  deleteMail: async (id: string, isDraft?: boolean) => {
    try {
      // First update local state for optimistic UI
      set((state) => ({
        drafts: state.drafts.filter((draft) => draft.id !== id),
      }));
      // Then delete from API
      await emailApi.deleteEmail(id);
    } catch (error) {
      // Revert local state and show error
      toast.error("Failed to delete draft");
      console.error("Error deleting draft:", error);
    } finally {
      // Refresh mails from the server to ensure consistency
      if (isDraft) await get().fetchDrafts();
      else await get().fetchSent();
    }
  },

  fetchDrafts: async () => {
    set((state) => ({
      loading: { ...state.loading, drafts: true },
      error: null,
    }));

    try {
      const draftsData = await emailApi.getDraftEmails();
      const drafts = draftsData.map((email) => convertApiEmail<"draft">(email));

      set({
        drafts,
        loading: { ...get().loading, drafts: false },
      });
    } catch (error) {
      set({
        error: "Failed to fetch drafts",
        loading: { ...get().loading, drafts: false },
      });
      console.error("Error fetching drafts:", error);
    }
  },

  fetchSent: async () => {
    set((state) => ({
      loading: { ...state.loading, sent: true },
      error: null,
    }));

    try {
      const sentData = await emailApi.getSentEmails();
      const sent = sentData.map((email) => convertApiEmail<"sent">(email));

      set({
        sent,
        loading: { ...get().loading, sent: false },
      });
    } catch (error) {
      set({
        error: "Failed to fetch sent emails",
        loading: { ...get().loading, sent: false },
      });
      console.error("Error fetching sent emails:", error);
    }
  },
}));
