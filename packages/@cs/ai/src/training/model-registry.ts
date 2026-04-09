/**
 * Model Version Registry and Tracking
 * Manages model versions like Docker registry
 */

import type { ModelVersion } from '@cs/types';

export interface ModelVersionEntry {
  id: string;
  agentId: string;
  version: string;
  modelPath: string;
  loraPath?: string;
  isActive: boolean;
  metrics?: Record<string, number>;
  createdAt: string;
  trainedAt?: string;
  promotedAt?: string;
  notes?: string;
}

/**
 * Registry for model versions
 */
export class ModelRegistry {
  private versions: Map<string, ModelVersionEntry> = new Map();

  /**
   * Register a new model version
   */
  registerVersion(entry: ModelVersionEntry): void {
    this.versions.set(entry.id, entry);
  }

  /**
   * Get model version by ID
   */
  getVersion(id: string): ModelVersionEntry | undefined {
    return this.versions.get(id);
  }

  /**
   * Get active version for agent
   */
  getActiveVersion(agentId: string): ModelVersionEntry | undefined {
    for (const version of this.versions.values()) {
      if (version.agentId === agentId && version.isActive) {
        return version;
      }
    }
    return undefined;
  }

  /**
   * List all versions for agent
   */
  listVersions(agentId: string): ModelVersionEntry[] {
    return Array.from(this.versions.values()).filter((v) => v.agentId === agentId);
  }

  /**
   * Promote version to active
   */
  promoteVersion(versionId: string): void {
    const version = this.versions.get(versionId);
    if (version) {
      // Deactivate current active
      for (const v of this.versions.values()) {
        if (v.agentId === version.agentId && v.isActive) {
          v.isActive = false;
        }
      }
      // Activate new version
      version.isActive = true;
      version.promotedAt = new Date().toISOString();
    }
  }

  /**
   * Get latest version for agent
   */
  getLatestVersion(agentId: string): ModelVersionEntry | undefined {
    const versions = this.listVersions(agentId);
    if (versions.length === 0) return undefined;
    return versions.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest,
    );
  }
}
