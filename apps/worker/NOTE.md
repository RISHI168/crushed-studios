# Worker Process Explanation

The `apps/worker` package is extracted from `apps/api/src/jobs/` when GPU workloads need independent scaling.

## Architecture

Instead of running GPU-intensive jobs within the main API server:

1. **API Server** (`apps/api/`) enqueues jobs to Redis via BullMQ
2. **Worker Process** (`apps/worker/`) runs as a separate service with:
   - Dedicated GPU resources
   - Independent scaling (can run multiple worker instances)
   - Health monitoring and automatic recovery
   - Job concurrency control

## Why Separate?

- **Isolation**: GPU jobs don't block API request handling
- **Scalability**: Run more workers on machines with multiple GPUs
- **Reliability**: Failed GPU jobs don't crash the API
- **Efficiency**: Workers can be paused/resumed without affecting API
- **Cost**: Scale worker instances independently based on queue depth

## Deployment Strategy

### Development
Run single API and single worker locally:
```bash
pnpm dev -F api  # one terminal
pnpm dev -F worker  # another terminal
```

### Production

**Single-GPU Setup:**
- 1 API instance (requests)
- 1 Worker instance (GPU jobs)

**Multi-GPU Setup:**
- 1 API instance (requests)
- N Worker instances (one per GPU)
- Each worker assigned to a specific GPU via `CUDA_VISIBLE_DEVICES`

**Scaling:**
- Monitor Redis queue depth
- Auto-scale workers when queue > threshold
- Use container orchestration (Kubernetes, ECS)

## Job Types

- `inference`: Video/storyboard generation (GPU)
- `training`: Model fine-tuning (GPU)
- `evaluation`: Model evaluation (GPU)

See `src/processors/` for implementations.
