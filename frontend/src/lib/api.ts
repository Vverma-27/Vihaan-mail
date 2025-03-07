import axios from "axios";
import { getSession } from "next-auth/react";

// Create an Axios instance with base configuration for emails
const emailApiBase = axios.create({
  baseURL: "/api", // Relative URL, will be handled by Next.js API routes
  headers: {
    "Content-Type": "application/json",
  },
});

// Create an Axios instance for auth
const authApiBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api", // Absolute URL, called only on server side
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add authorization token to email requests
emailApiBase.interceptors.request.use(
  async (config) => {
    // Get the current session
    const session = await getSession();

    // If session exists and has an accessToken, add it to the Authorization header
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Interface for email data structure
 */
export interface Email<T extends "draft" | "sent"> {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: T;
  status?: "processed" | "pending" | "failed";
  scheduledAt?: string; // Date as ISO string
  createdAt: string; // Date as ISO string
  userId: string;
}
/**
 * Interface for sending new emails
 */
export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  scheduleAt?: Date;
  draftId?: string; // Add this field to identify the draft to delete
}
/**
 * User related interfaces
 */
export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  picture?: string;
}

export interface RegisterUserPayload {
  googleId?: string;
  name?: string | null | undefined;
  email?: string | null;
  picture?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

/**
 * API functions for authentication
 */
export const authApi = {
  /**
   * Register or login a user with Google authentication data
   */
  registerUser: async (
    userData: RegisterUserPayload
  ): Promise<RegisterResponse> => {
    try {
      const response = await authApiBase.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },
};

/**
 * API functions for email operations
 */
const emailApi = {
  /**
   * Get all sent emails with optional pagination
   */
  getSentEmails: async (
    params?: PaginationParams
  ): Promise<Email<"sent">[]> => {
    try {
      const response = await emailApiBase.get("/emails/sent", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching sent emails:", error);
      throw error;
    }
  },

  /**
   * Get all draft emails with optional pagination
   */
  getDraftEmails: async (
    params?: PaginationParams
  ): Promise<Email<"draft">[]> => {
    try {
      const response = await emailApiBase.get("/emails/drafts", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching draft emails:", error);
      throw error;
    }
  },

  /**
   * Send a new email
   */
  sendEmail: async (
    emailData: SendEmailPayload
  ): Promise<{ message: string; email: Email<"sent"> }> => {
    try {
      const response = await emailApiBase.post("/emails/send", emailData);
      return response.data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

  /**
   * Create or update a draft email
   */
  saveDraft: async (
    draftData: Partial<Email<"draft">>
  ): Promise<{ message: string; email: Email<"draft"> }> => {
    try {
      const response = await emailApiBase.post("/emails/draft", draftData);
      return response.data;
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  },

  /**
   * Delete an email (draft or sent)
   */
  deleteEmail: async (id: string): Promise<void> => {
    try {
      await emailApiBase.delete(`/emails/${id}`);
    } catch (error) {
      console.error(`Error deleting email:`, error);
      throw error;
    }
  },

  /**
   * Get a single email by ID (includes body)
   */
  getEmailById: async (
    id: string,
    type: "draft" | "sent"
  ): Promise<Email<"draft" | "sent">> => {
    try {
      const response = await emailApiBase.get(`/emails/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching email with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update a draft email
   */
  updateDraft: async (
    id: string,
    data: {
      subject: string;
      body: string;
      to: string;
      scheduledAt: Date | null;
    }
  ): Promise<{ message: string; email: Email<"draft"> }> => {
    try {
      const response = await emailApiBase.put(`/emails/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching email with id ${id}:`, error);
      throw error;
    }
  },
};

export default emailApi;
