import { Request, Response } from "express";
import { db } from "../config/db";
import { emails } from "../schema/emails";
import { emailQueue } from "../queue";
import { eq, and, desc } from "drizzle-orm";
import { AuthRequest } from "../middleware";

// Get all sent emails for the logged-in user (without bodies)
export const getAllSentEmails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    // Select all fields except the body
    const sentEmails = await db
      .select({
        id: emails.id,
        to: emails.to,
        subject: emails.subject,
        type: emails.type,
        status: emails.status,
        scheduledAt: emails.scheduledAt,
        createdAt: emails.createdAt,
        userId: emails.userId,
      })
      .from(emails)
      .where(and(eq(emails.type, "sent"), eq(emails.userId, userId)))
      .orderBy(desc(emails.createdAt)) // Most recent first
      .offset(offset)
      .limit(limit);

    res.json(sentEmails);
  } catch (error) {
    console.error("Error fetching sent emails:", error);
    res.status(500).json({ error: "Error fetching sent emails" });
  }
};

// Get all draft emails for the logged-in user (without bodies)
export const getAllDraftEmails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    // Select all fields except the body
    const draftEmails = await db
      .select({
        id: emails.id,
        to: emails.to,
        subject: emails.subject,
        type: emails.type,
        status: emails.status,
        scheduledAt: emails.scheduledAt,
        createdAt: emails.createdAt,
        userId: emails.userId,
      })
      .from(emails)
      .where(and(eq(emails.type, "draft"), eq(emails.userId, userId)))
      .orderBy(desc(emails.createdAt)) // Most recent first
      .offset(offset)
      .limit(limit);

    res.json(draftEmails);
  } catch (error) {
    console.error("Error fetching draft emails:", error);
    res.status(500).json({ error: "Error fetching draft emails" });
  }
};

// Get a single email by ID (includes body)
export const getEmailById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const emailId = parseInt(req.params.id, 10);

    if (isNaN(emailId)) {
      res.status(400).json({ error: "Invalid email ID" });
      return;
    }

    // Get the full email including body
    const [email] = await db
      .select()
      .from(emails)
      .where(
        and(
          eq(emails.id, emailId),
          eq(emails.userId, userId) // Make sure the email belongs to the user
        )
      );

    if (!email) {
      res.status(404).json({ error: "Email not found" });
      return;
    }

    res.json(email);
  } catch (error) {
    console.error("Error fetching email:", error);
    res.status(500).json({ error: "Error fetching email" });
  }
};

// Send an email (assigns to user and moves to queue)
export const sendEmail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;
    const { to, subject, body, scheduleAt, draftId } = req.body;

    // Validate inputs
    if (!to) {
      res.status(400).json({ error: "Recipient and subject are required" });
      return;
    }

    // Create the email record
    const [email] = await db
      .insert(emails)
      .values({
        to,
        subject,
        body: body || "",
        type: "sent",
        status: "pending", // If scheduled, mark as pending
        scheduledAt: scheduleAt ? new Date(scheduleAt) : null,
        userId,
      })
      .returning();

    // If this was sent from a draft, delete the draft
    if (draftId) {
      const draftIdNum = parseInt(draftId, 10);
      if (!isNaN(draftIdNum)) {
        await db
          .delete(emails)
          .where(
            and(
              eq(emails.id, draftIdNum),
              eq(emails.type, "draft"),
              eq(emails.userId, userId)
            )
          );
        console.log(`Deleted draft ${draftId} after sending`);
      }
    }

    // Add to email queue for processing
    if (scheduleAt) {
      // For scheduled emails
      const scheduleTime = new Date(scheduleAt);
      await emailQueue.add(
        "send-email",
        {
          mailId: email.id,
          to,
          subject,
          body,
          userId,
          userName: userEmail!.split("@")[0], // Use the username part of the email
        },
        {
          delay: scheduleTime.getTime() - Date.now(),
          removeOnComplete: true,
        }
      );
    } else {
      // For immediate emails
      await emailQueue.add(
        "send-email",
        {
          mailId: email.id,
          to,
          subject,
          body,
          userId,
          userName: userEmail!.split("@")[0], // Use the username part of the email
        },
        { removeOnComplete: true }
      );
    }

    res.status(201).json({ message: "Email queued successfully", email });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email" });
  }
};

// Save a new draft email
export const createDraft = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const { subject, body, to } = req.body;

    const draftEmail = {
      userId,
      subject,
      body,
      to,
      type: "draft",
      createdAt: new Date(),
    };

    const [email] = await db.insert(emails).values(draftEmail).returning();

    res.status(201).json({ message: "Draft saved successfully", email });
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({ error: "Error saving draft" });
  }
};

// Delete a email
export const deleteMail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const id = parseInt(req.params.id, 10); // Convert to number

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid mail ID" });
      return;
    }
    // Ensure the email exists and belongs to the user before deleting
    const [email] = await db
      .delete(emails)
      .where(and(eq(emails.id, id), eq(emails.userId, userId)))
      .returning();

    if (!email) {
      res.status(404).json({ error: "Mail not found" });
      return;
    }
    if (email.type === "sent" && email.status === "pending") {
      try {
        // Get all pending jobs in the queue
        const pendingJobs = await emailQueue.getJobs(["waiting", "delayed"]);

        // Find and remove the email job
        // Jobs data typically contains the email data we passed when adding to queue
        for (const job of pendingJobs) {
          const jobData = await job.data;

          // Match job with our email using the relevant fields
          // Since job data might not have id, we match with other fields
          if (jobData.mailId === email.id) {
            // Remove the job from the queue
            await job.remove();
            console.log(`Removed job ${job.id} from queue for email ${id}`);
            break;
          }
        }
      } catch (queueError) {
        console.error(`Error removing from queue for email ${id}:`, queueError);
        // We don't fail the whole operation if queue removal fails
        // Just log it and continue with deletion from DB
      }
    }

    res.json({ message: "Mail deleted successfully", email });
  } catch (error) {
    console.error("Error deleting Mail:", error);
    res.status(500).json({ error: "Error deleting Mail" });
  }
};

export const updateEmail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { subject, body, to, scheduledAt } = req.body;

    // Validate that the email belongs to the user and is of the correct type
    const existingEmail = await db
      .select()
      .from(emails)
      .where(
        and(
          eq(emails.id, parseInt(id, 10)),
          eq(emails.userId, userId),
          eq(emails.type, "draft") // Only drafts can be updated
        )
      )
      .limit(1);

    if (existingEmail.length === 0) {
      res.status(404).json({
        error: `draft not found`,
      });
      return;
    }

    // Update the email
    const [updatedEmail] = await db
      .update(emails)
      .set({
        subject: subject || "",
        body: body || "",
        to: to || "",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      })
      .where(and(eq(emails.id, parseInt(id, 10)), eq(emails.userId, userId)))
      .returning();

    res.json({
      message: `draft updated successfully`,
      email: updatedEmail,
    });
  } catch (error) {
    console.error(`Error updating email:`, error);
    res.status(500).json({ error: "Error updating email" });
  }
};
