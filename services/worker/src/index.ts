import { SubmissionWorker } from "./queue/getData";

const submissionWorker = new SubmissionWorker();

const shutdown = async () => {
  console.log('Shutting down worker...');
  await submissionWorker.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Submission worker started and listening for jobs...');