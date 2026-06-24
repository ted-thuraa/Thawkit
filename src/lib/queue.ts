import { Queue } from "bullmq";
import IORedis from "ioredis";

// Reuse the connection to avoid limits on Upstash
export const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // Required for BullMQ
});

export const previewQueue = new Queue("preview-generation", {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry 3 times on failure
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true, // Keep Redis clean
    removeOnFail: 100, // Keep last 100 failures for debugging
  },
});

export const cleanupQueue = new Queue("preview-cleanup", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});
