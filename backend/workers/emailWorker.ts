import { Job, Worker } from "bullmq";
import { resend } from "../services/resend.service";
import { EmailJob } from "../interfaces/emailInterface";
import { db } from "../config/db";
import { emails } from "../schema/emails";
import { eq } from "drizzle-orm";
import { redisOptions } from "../queue";

const emailWorker = new Worker(
  "emailQueue",
  async (job: Job<EmailJob>) => {
    const { to, subject, body, mailId, userId, userName } = job.data;

    try {
      // First, check if the email exists in the database
      const emailRecord = await db
        .select()
        .from(emails)
        .where(eq(emails.id, mailId))
        .limit(1);

      // If email doesn't exist in the database, log and exit
      if (emailRecord.length === 0) {
        console.error(`Email with ID ${mailId} not found in the database`);
        return;
      }
      // Split recipients by comma and trim spaces
      const recipients = to.split(",").map((email) => email.trim());

      // Send email to each recipient
      for (const recipient of recipients) {
        const response = await resend.emails.send({
          from: `${userName || "onboarding"}@resend.dev`,
          to: recipient,
          subject,
          html: body,
        });
        if (response.error) {
          console.error(
            `Error sending email to ${recipient} from ${userName} (ID: ${mailId}):`,
            response.error
          );
          throw new Error(response.error.message);
        }
        console.log(
          `🚀 Email sent to ${recipient} from ${userName} (ID: ${mailId})`
        );
      }

      // Update the email status to "processed"
      await db
        .update(emails)
        .set({
          status: "processed",
        })
        .where(eq(emails.id, mailId));

      console.log(`Email status updated to "processed" for ID: ${mailId}`);
    } catch (error) {
      console.error(`Error processing email ID ${mailId}:`, error);

      // Update the email status to "failed" in case of error
      try {
        await db
          .update(emails)
          .set({
            status: "failed",
          })
          .where(eq(emails.id, mailId));

        console.log(`Email status updated to "failed" for ID: ${mailId}`);
      } catch (updateError) {
        console.error(
          `Failed to update email status for ID ${mailId}:`,
          updateError
        );
      }
    }
  },
  { connection: redisOptions }
);

// Add event handlers for better monitoring
emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

export default emailWorker;
