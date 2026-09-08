import express from 'express';
import { taskQueue } from './queue';
import './worker';

const app = express();
app.use(express.json());

app.post('/jobs', async (req, res) => {
  const { payloadType, data } = req.body;

  if (!payloadType) {
    return res.status(400).json({ error: 'payloadType is required' });
  }

  const job = await taskQueue.add('process-job', {
    taskId: `task_${Date.now()}`,
    payloadType,
    data: data || {},
  });

  return res.status(202).json({
    message: 'Job enqueued successfully',
    jobId: job.id,
    statusUrl: `/jobs/${job.id}`,
  });
});

app.get('/jobs/:id', async (req, res) => {
  const job = await taskQueue.getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const state = await job.getState();
  return res.json({
    id: job.id,
    state,
    progress: job.progress,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
    returnvalue: job.returnvalue,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
