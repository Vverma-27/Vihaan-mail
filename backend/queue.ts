import { Queue } from "bullmq";
import config from "./config";
import { EmailJob } from "./interfaces/emailInterface";

export const redisOptions = { host: config.REDIS_HOST, port: 6379 };

// Queue default options
const defaultJobOptions = {
  // Automatically remove jobs from the completed set
  removeOnComplete: true,
  // Remove failed jobs after all attempts have been exhausted
  removeOnFail: true,
  // Retry configuration
  attempts: 3, // Number of retry attempts
  backoff: {
    type: "exponential", // Exponential backoff strategy
    delay: 10000, // Starting delay of 10 seconds (10000ms)
  },

  // Job timeout
  timeout: 60000, // Consider job failed if it takes longer than 60 seconds
};

// Create email queue with default settings
export const emailQueue = new Queue<EmailJob>("emailQueue", {
  connection: redisOptions,
  defaultJobOptions,
});
