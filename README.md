# async-job-queue-processor

A high-concurrency asynchronous job queue worker system built with Node.js, TypeScript, BullMQ, Redis, and Docker.

## Features
- Queue & Worker Architecture: Decoupled HTTP API producer and background job processing workers.
- Exponential Backoff: Automated retry strategy with configurable attempts and delays.
- Containerized: Full Docker Compose setup for Redis and application services.
