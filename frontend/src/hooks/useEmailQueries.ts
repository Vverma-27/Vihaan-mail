import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import emailApi, { Email, SendEmailPayload } from "../lib/api";
import { useEmailStore } from "../lib/store/emailStore";
import { toast } from "sonner";
import { useEffect } from "react";

// Define query keys
export const emailKeys = {
  all: ["emails"] as const,
  drafts: () => [...emailKeys.all, "drafts"] as const,
  sent: () => [...emailKeys.all, "sent"] as const,
  detail: (id: string, type?: "draft" | "sent") =>
    [...emailKeys.all, id, type] as const,
};

// Convert API email to internal format
export const convertApiEmail = <T extends "draft" | "sent">(
  email: Email<T>
): Email<T> => ({
  ...email,
  id: `${email.id}`,
  type: email.type as T,
  createdAt: new Date(email.createdAt).toISOString(),
});

// Hooks for fetching emails
export const useDrafts = () => {
  const setDrafts = useEmailStore((state) => state.setDrafts);

  const query = useQuery({
    queryKey: emailKeys.drafts(),
    queryFn: async () => {
      const drafts = await emailApi.getDraftEmails();
      return drafts.map((draft) => convertApiEmail<"draft">(draft));
    },
  });

  // Update Zustand store when data changes
  useEffect(() => {
    if (query.data) {
      setDrafts(query.data);
    }
  }, [query.data, setDrafts]);

  return query;
};

export const useSentEmails = () => {
  const setSent = useEmailStore((state) => state.setSent);

  const query = useQuery({
    queryKey: emailKeys.sent(),
    queryFn: async () => {
      const sent = await emailApi.getSentEmails();
      return sent.map((email) => convertApiEmail<"sent">(email));
    },
  });

  // Update Zustand store when data changes
  useEffect(() => {
    if (query.data) {
      setSent(query.data);
    }
  }, [query.data, setSent]);

  return query;
};

export const useEmailById = (id: string) => {
  const setCurrentEmail = useEmailStore((state) => state.setCurrentEmail);

  const query = useQuery({
    queryKey: emailKeys.detail(id),
    queryFn: async () => {
      const email = await emailApi.getEmailById(id);
      return convertApiEmail(email);
    },
    enabled: !!id, // Only run query if id is provided
  });

  // Update Zustand store when data changes
  useEffect(() => {
    if (query.data) {
      setCurrentEmail(query.data);
    }
  }, [query.data, setCurrentEmail]);

  return query;
};

// Mutation hooks
export const useSendEmail = () => {
  const queryClient = useQueryClient();
  const { removeComposeTab, addSentEmail, removeDraft } = useEmailStore();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: SendEmailPayload;
    }) => {
      const response = await emailApi.sendEmail(data);
      return { response, id, draftId: data.draftId };
    },
  });

  // Handle success effects
  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const { response, id, draftId } = mutation.data;

      // Convert API response to internal format
      const sentEmail = convertApiEmail<"sent">(response.email);

      // Update Zustand state
      addSentEmail(sentEmail);
      removeComposeTab(id);

      // If it was sent from a draft, remove draft from store
      if (draftId) {
        removeDraft(draftId);
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: emailKeys.sent() });
      queryClient.invalidateQueries({ queryKey: emailKeys.drafts() });

      toast.success("Email sent successfully");
    }
  }, [
    mutation.isSuccess,
    mutation.data,
    queryClient,
    addSentEmail,
    removeComposeTab,
    removeDraft,
  ]);

  // Handle error effects
  useEffect(() => {
    if (mutation.isError) {
      toast.error("Failed to send email");
      console.error("Error sending email:", mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

export const useCreateDraft = () => {
  const queryClient = useQueryClient();
  const { addDraft, removeComposeTab } = useEmailStore();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      subject,
      body,
      to,
      scheduledAt,
    }: {
      id: string;
      subject: string;
      body: string;
      to: string;
      scheduledAt?: Date;
    }) => {
      const response = await emailApi.saveDraft({
        subject,
        body,
        to,
        type: "draft",
        scheduledAt: scheduledAt ? scheduledAt.toISOString() : undefined,
      });
      return { response, id };
    },
  });

  // Handle success effects
  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const { response, id } = mutation.data;

      // Convert API response to internal format
      const draft = convertApiEmail<"draft">(response.email);

      // Update store
      addDraft(draft);
      removeComposeTab(id);

      // Invalidate drafts query
      queryClient.invalidateQueries({ queryKey: emailKeys.drafts() });

      toast.success("Draft saved successfully");
    }
  }, [
    mutation.isSuccess,
    mutation.data,
    queryClient,
    addDraft,
    removeComposeTab,
  ]);

  // Handle error effects
  useEffect(() => {
    if (mutation.isError) {
      toast.error("Failed to save draft");
      console.error("Error saving draft:", mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

export const useUpdateDraft = () => {
  const queryClient = useQueryClient();
  const { updateDraftInStore, removeComposeTab } = useEmailStore();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      subject,
      body,
      to,
      scheduledAt,
    }: {
      id: string;
      subject: string;
      body: string;
      to: string;
      scheduledAt?: Date;
    }) => {
      const response = await emailApi.updateDraft(id, {
        subject,
        body,
        to,
        scheduledAt: scheduledAt || null,
      });
      return { response, id };
    },
  });

  // Handle success effects
  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const { response, id } = mutation.data;

      // Convert API response to our format
      const draft = convertApiEmail<"draft">(response.email);

      // Update store
      updateDraftInStore(draft);
      removeComposeTab(id);

      // Invalidate draft queries
      queryClient.invalidateQueries({ queryKey: emailKeys.drafts() });
      queryClient.invalidateQueries({
        queryKey: emailKeys.detail(id),
      });

      toast.success("Draft updated successfully");
    }
  }, [
    mutation.isSuccess,
    mutation.data,
    queryClient,
    updateDraftInStore,
    removeComposeTab,
  ]);

  // Handle error effects
  useEffect(() => {
    if (mutation.isError) {
      toast.error("Failed to update draft");
      console.error("Error updating draft:", mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();
  const { removeDraft, removeSentEmail } = useEmailStore();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: string;
      type?: "draft" | "sent";
    }) => {
      await emailApi.deleteEmail(id);
      return { id, type };
    },
  });

  // Handle success effects
  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const { id, type } = mutation.data;

      // Update store based on email type
      if (type === "draft") {
        removeDraft(id);
        queryClient.invalidateQueries({ queryKey: emailKeys.drafts() });
      } else {
        removeSentEmail(id);
        queryClient.invalidateQueries({ queryKey: emailKeys.sent() });
      }

      // Invalidate the specific email detail if it exists in cache
      queryClient.invalidateQueries({
        queryKey: emailKeys.detail(id),
      });

      toast.success(
        `${type === "draft" ? "Draft" : "Email"} deleted successfully`
      );
    }
  }, [
    mutation.isSuccess,
    mutation.data,
    queryClient,
    removeDraft,
    removeSentEmail,
  ]);

  // Handle error effects
  useEffect(() => {
    if (mutation.isError) {
      toast.error("Failed to delete email");
      console.error("Error deleting email:", mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};
