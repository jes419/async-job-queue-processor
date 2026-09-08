import { Worker, Job } from 'bullmq';
import { REDIS_CONNECTION } from './queue';

interface TaskPayload {
  taskId: string;
  payloadType: 'PDF_GEN' | 'IMAGE_PROCESS' | 'EMAIL_DISPATCH';
  data: Record<string, unknown>;
}

export const worker = new Worker<TaskPayload>(
  'heavy-tasks',
  async (job: Job<TaskPayload>) => {
    console.log(`[Processing] Job ID: ${job.id} | Type: ${job.data.payloadType}`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (Math.random() < 0.2) {
      throw new Error(`Transient error during processing task ${job.data.taskId}`);
    }

    console.log(`[Completed] Job ID: ${job.id}`);
    return { status: 'SUCCESS', processedAt: new Date().toISOString() };
  },
  {
    connection: REDIS_CONNECTION,
    concurrency: 5,
  }
);

worker.on('failed', (job, err) => {
  console.error(`[Failed] Job ID: ${job?.id} | Attempt ${job?.attemptsMade} | Error: ${err.message}`);
});
