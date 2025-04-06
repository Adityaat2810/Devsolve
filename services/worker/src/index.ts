import { Worker } from 'bullmq';
import { redisConnection } from './reddisconnection';

export const dataWorker = new Worker(
  'data-processing',
  async (job) => {
    const data = job.data;
    console.log(`Processing job ${job.id} with data:`, data);

    return { processed: true, timestamp: new Date() };
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
);

dataWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

dataWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});

// run the worker
(async () => {
  await dataWorker.waitUntilReady();
  console.log('Worker is ready and processing jobs...');
}
)().catch((error) => {
  console.error('Error starting worker:', error);
}
);