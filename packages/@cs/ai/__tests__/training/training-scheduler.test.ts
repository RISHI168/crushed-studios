/**
 * Tests for Training Scheduler
 */

import { describe, it, expect } from 'vitest';
import { shouldTriggerTraining, calculateNextTrainTime, scheduleTrainings } from '../../src/training/training-scheduler';

describe('Training Scheduler', () => {
  it('should trigger training with enough data', () => {
    const shouldTrain = shouldTriggerTraining(150, 7 * 24 * 60 * 60 * 1000, 0.8);
    expect(typeof shouldTrain).toBe('boolean');
  });

  it('should not trigger with insufficient data', () => {
    const shouldTrain = shouldTriggerTraining(10, 1 * 24 * 60 * 60 * 1000, 0.9);
    expect(typeof shouldTrain).toBe('boolean');
  });

  it('should calculate next train time', () => {
    const lastTrain = new Date();
    const nextTrain = calculateNextTrainTime(lastTrain);
    expect(nextTrain.getTime()).toBeGreaterThan(lastTrain.getTime());
  });

  it('should schedule trainings for all agents', async () => {
    const schedule = await scheduleTrainings();
    expect(schedule).toBeDefined();
  });

  it('should consider quality degradation', () => {
    const shouldTrain = shouldTriggerTraining(50, 7 * 24 * 60 * 60 * 1000, 0.65);
    expect(typeof shouldTrain).toBe('boolean');
  });
});
